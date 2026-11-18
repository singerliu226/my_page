// 从视频里取指定时刻的一帧存成 JPEG，用作网页上的封面图。仅 macOS 可用。
// 用法：swift frame.swift <输入> <输出.jpg> <秒> [<输出2.jpg> <秒2> ...]
import AVFoundation
import Foundation
import ImageIO
import UniformTypeIdentifiers

func fail(_ message: String) -> Never {
  FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
  exit(1)
}

let args = CommandLine.arguments
guard args.count >= 4, (args.count - 2) % 2 == 0 else { fail("用法：swift frame.swift <输入> <输出.jpg> <秒> [<输出.jpg> <秒> ...]") }
let asset = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero

var index = 2
while index + 1 < args.count {
  let target = URL(fileURLWithPath: args[index])
  guard let seconds = Double(args[index + 1]) else { fail("时间要写成秒数：\(args[index + 1])") }
  let time = CMTime(seconds: seconds, preferredTimescale: 600)
  do {
    let image = try generator.copyCGImage(at: time, actualTime: nil)
    guard let destination = CGImageDestinationCreateWithURL(target as CFURL, UTType.jpeg.identifier as CFString, 1, nil) else {
      fail("写不了文件：\(target.path)")
    }
    CGImageDestinationAddImage(destination, image, [kCGImageDestinationLossyCompressionQuality: 0.82] as CFDictionary)
    guard CGImageDestinationFinalize(destination) else { fail("写入失败：\(target.path)") }
    print("ok \(image.width)x\(image.height) @\(seconds)s -> \(target.lastPathComponent)")
  } catch { fail("取不到 \(seconds) 秒的画面：\(error)") }
  index += 2
}
