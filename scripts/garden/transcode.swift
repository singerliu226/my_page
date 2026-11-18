// 把成片转成适合网页播放的 MP4（H.264 + AAC，保持原分辨率，只降码率），不依赖 ffmpeg。
// 输出文件不带原片的元数据。仅 macOS 可用。
// 用法：swift transcode.swift <输入> <输出.mp4> [视频码率 kbps，默认 1000] [音频码率 kbps，默认 112]
import AVFoundation
import Foundation

func fail(_ message: String) -> Never {
  FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
  exit(1)
}

let args = CommandLine.arguments
guard args.count >= 3 else { fail("用法：swift transcode.swift <输入> <输出.mp4> [视频 kbps] [音频 kbps]") }
let source = URL(fileURLWithPath: args[1])
let target = URL(fileURLWithPath: args[2])
let videoKbps = args.count > 3 ? (Int(args[3]) ?? 1000) : 1000
let audioKbps = args.count > 4 ? (Int(args[4]) ?? 112) : 112
try? FileManager.default.removeItem(at: target)

let asset = AVURLAsset(url: source)
guard let videoTrack = asset.tracks(withMediaType: .video).first else { fail("找不到视频轨：\(source.path)") }
let audioTrack = asset.tracks(withMediaType: .audio).first

let reader: AVAssetReader
let writer: AVAssetWriter
do {
  reader = try AVAssetReader(asset: asset)
  writer = try AVAssetWriter(outputURL: target, fileType: .mp4)
} catch { fail("打不开文件：\(error)") }
writer.shouldOptimizeForNetworkUse = true   // 把索引放在文件开头，网页可以边下边播

let videoOutput = AVAssetReaderTrackOutput(
  track: videoTrack,
  outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange]
)
videoOutput.alwaysCopiesSampleData = false
reader.add(videoOutput)

let size = videoTrack.naturalSize
let compression: [String: Any] = [
  AVVideoAverageBitRateKey: videoKbps * 1000,
  AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
  AVVideoMaxKeyFrameIntervalDurationKey: 4,
  AVVideoAllowFrameReorderingKey: true,
  AVVideoExpectedSourceFrameRateKey: Int(videoTrack.nominalFrameRate.rounded())
]
let videoInput = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: Int(size.width),
  AVVideoHeightKey: Int(size.height),
  AVVideoCompressionPropertiesKey: compression
])
videoInput.expectsMediaDataInRealTime = false
videoInput.transform = videoTrack.preferredTransform
writer.add(videoInput)

var audioOutput: AVAssetReaderTrackOutput?
var audioInput: AVAssetWriterInput?
if let track = audioTrack {
  let output = AVAssetReaderTrackOutput(track: track, outputSettings: [
    AVFormatIDKey: kAudioFormatLinearPCM,
    AVLinearPCMBitDepthKey: 16,
    AVLinearPCMIsFloatKey: false,
    AVLinearPCMIsBigEndianKey: false,
    AVLinearPCMIsNonInterleaved: false
  ])
  output.alwaysCopiesSampleData = false
  reader.add(output)
  let input = AVAssetWriterInput(mediaType: .audio, outputSettings: [
    AVFormatIDKey: kAudioFormatMPEG4AAC,
    AVNumberOfChannelsKey: 2,
    AVSampleRateKey: 48000,
    AVEncoderBitRateKey: audioKbps * 1000
  ])
  input.expectsMediaDataInRealTime = false
  writer.add(input)
  audioOutput = output
  audioInput = input
}

guard reader.startReading() else { fail("读取失败：\(String(describing: reader.error))") }
guard writer.startWriting() else { fail("写入失败：\(String(describing: writer.error))") }
writer.startSession(atSourceTime: .zero)

let group = DispatchGroup()
func pump(_ input: AVAssetWriterInput, _ output: AVAssetReaderTrackOutput, _ label: String) {
  group.enter()
  input.requestMediaDataWhenReady(on: DispatchQueue(label: label)) {
    while input.isReadyForMoreMediaData {
      guard let buffer = output.copyNextSampleBuffer(), input.append(buffer) else {
        input.markAsFinished()
        group.leave()
        return
      }
    }
  }
}
pump(videoInput, videoOutput, "garden.video")
if let input = audioInput, let output = audioOutput { pump(input, output, "garden.audio") }
group.wait()

let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
guard reader.status == .completed, writer.status == .completed else {
  fail("转码没有完成：reader=\(String(describing: reader.error)) writer=\(String(describing: writer.error))")
}
// AVAssetWriter 做“边下边播”整理时，会在输出目录留下一个 <文件名>.sb-xxxx 的中间文件，这里顺手清掉
let folder = target.deletingLastPathComponent()
let leftovers = (try? FileManager.default.contentsOfDirectory(atPath: folder.path)) ?? []
for name in leftovers where name.hasPrefix(target.lastPathComponent + ".sb-") {
  try? FileManager.default.removeItem(at: folder.appendingPathComponent(name))
}
let attributes = try? FileManager.default.attributesOfItem(atPath: target.path)
let bytes = (attributes?[.size] as? Int) ?? 0
print("ok \(Int(size.width))x\(Int(size.height)) \(videoKbps)k+\(audioKbps)k \(bytes) bytes")
