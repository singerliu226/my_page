#!/usr/bin/env node
/**
 * 后花园素材同步：把鹅创营目录里的成品拷进 public/，并从正式版鹅羽鮨打出单机包。
 * 只读鹅创营目录，不会改动那边的任何文件。
 *
 * 用法（在仓库根目录运行）：
 *   node scripts/garden/sync.mjs                  同步四个小游戏、B 站示例页和卡片配图
 *   node scripts/garden/sync.mjs films            转两部短片和封面（要 macOS 自带的 swift）
 *   node scripts/garden/sync.mjs eyuzu tongsui    只同步指定的几项
 *   可选项目：eyuzu tongsui kitchen luck bili images films
 *
 * 可选参数：
 *   --src <目录>          鹅创营目录，默认 ~/Desktop/鹅创营
 *   --mute-tongsui-bgm    把糖水小铺的背景音乐换成静音占位（默认保留原曲，说明见 tongsui()）
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const playDir = path.join(repo, 'public/play');
const mediaDir = path.join(repo, 'public/media');
const manifestFile = path.join(here, 'manifest.json');

const argv = process.argv.slice(2);
const flags = new Set();
const names = [];
let campRoot = path.join(os.homedir(), 'Desktop/鹅创营');
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === '--src') { campRoot = path.resolve(argv[i + 1] ?? ''); i += 1; }
  else if (argv[i].startsWith('--')) flags.add(argv[i]);
  else names.push(argv[i]);
}

const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const inCamp = (...parts) => path.join(campRoot, ...parts);
const skipJunk = (file) => !/(^|\/)\.DS_Store$/.test(file);

/** 记下每项素材是从哪里来的、哪个版本，方便以后对账；这个文件不会被发布到网站上 */
async function record(id, entry) {
  let manifest = {};
  try { manifest = JSON.parse(await readFile(manifestFile, 'utf8')); } catch { /* 第一次运行 */ }
  manifest[id] = { ...entry, syncedAt: new Date().toISOString().slice(0, 10) };
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(manifestFile, `${JSON.stringify(sorted, null, 2)}\n`);
}

async function folderBytes(dir) {
  let total = 0;
  for (const item of await readdir(dir, { withFileTypes: true, recursive: true })) {
    if (item.isFile()) total += (await readFile(path.join(item.parentPath ?? item.path, item.name))).length;
  }
  return total;
}

/**
 * 鹅羽鮨：正式版是常驻的 Node 服务，这里把它的 server.js 原文放进网页里运行，打成一个单机 HTML。
 * 画面和声音都是游戏代码现画、现合成的，所以除了这一个文件不需要别的素材。
 */
async function eyuzu() {
  const source = inCamp('鹅羽鮨');
  const read = (file) => readFile(path.join(source, file), 'utf8');
  const [page, css, runtime, world, menu, server, pkg] = await Promise.all([
    read('public/index.html'),
    read('public/css/style.css'),
    readFile(path.join(here, 'eyuzu-solo-runtime.js'), 'utf8'),
    read('shared/world.js'),
    read('shared/menu.js'),
    read('server.js'),
    read('package.json'),
  ]);

  const wrap = (id, code) => `sources[${JSON.stringify(id)}] = function (module, exports, require, __dirname, __filename, process) {\n${code}\n};`;
  const modules = [wrap('./shared/world.js', world), wrap('./shared/menu.js', menu), wrap('./server.js', server)].join('\n');
  if (!runtime.includes('/* __EYU_MODULES__ */')) throw new Error('eyuzu-solo-runtime.js 里找不到占位标记');
  const solo = runtime.replace('/* __EYU_MODULES__ */', () => modules);

  const inline = (code, what) => {
    if (/<\/script|<!--/i.test(code)) throw new Error(`${what} 里出现了 </script 或 <!--，不能直接内嵌`);
    return `<script>\n${code}\n</script>`;
  };

  let html = page;
  if (/<\/style/i.test(css)) throw new Error('style.css 里出现了 </style，不能直接内嵌');
  html = html.replace('<link rel="stylesheet" href="/css/style.css">', () => `<style>\n${css}\n</style>`);

  const scripts = [...html.matchAll(/<script src="\/([^"]+)"><\/script>/g)];
  for (const [tag, file] of scripts) {
    const code = await read(file.startsWith('shared/') ? file : `public/${file}`);
    const block = inline(code, file);
    // 店（server.js）要先开门，游戏主程序才连得上，所以运行时放在 game.js 前面
    html = html.replace(tag, () => (file === 'js/game.js' ? `${inline(solo, '单机运行时')}\n${block}` : block));
  }
  if (!scripts.some(([, file]) => file === 'js/game.js')) throw new Error('index.html 里没有找到 js/game.js');
  if (/(?:src|href)="\/(?!\/)/.test(html)) throw new Error('还有没处理的站内绝对路径，单机包放进子目录后会找不到文件');

  // 进店卡片上写着“所有打开这个链接的人，都在同一家店里”，单机包里这句话不成立，换成如实的说明
  const lead = '所有打开这个链接的人，都在同一家店里。';
  if (html.includes(lead)) html = html.replace(lead, '这里是单机试玩：其他客人都由电脑扮演。');
  else console.warn('  提示：没找到进店卡片上的原句，单机说明没有写进去');
  html = html.replace(/<title>[^<]*<\/title>/, '<title>鹅羽鮨 · 单机试玩</title>');

  const target = path.join(playDir, 'eyuzu');
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, 'index.html'), html);
  await record('eyuzu', {
    from: '鹅羽鮨/（server.js、shared/、public/）',
    version: JSON.parse(pkg).version,
    serverSha256: sha256(server),
    bytes: Buffer.byteLength(html),
    note: '单机包：server.js 原文在页面内运行，只有电脑客人；联机版需要常驻 Node 服务',
  });
  console.log(`鹅羽鮨 单机包 ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`);
}

/** 生成一段静音的 m4a，需要去掉背景音乐时用它顶替 */
async function silentM4a(target, seconds = 10) {
  const rate = 44100, channels = 2, bytesPerSample = 2;
  const dataBytes = rate * channels * bytesPerSample * seconds;
  const wav = Buffer.alloc(44 + dataBytes);
  wav.write('RIFF', 0); wav.writeUInt32LE(36 + dataBytes, 4); wav.write('WAVE', 8);
  wav.write('fmt ', 12); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(channels, 22);
  wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * channels * bytesPerSample, 28);
  wav.writeUInt16LE(channels * bytesPerSample, 32); wav.writeUInt16LE(16, 34);
  wav.write('data', 36); wav.writeUInt32LE(dataBytes, 40);
  const temp = await mkdtemp(path.join(os.tmpdir(), 'garden-silence-'));
  const wavFile = path.join(temp, 'silence.wav');
  await writeFile(wavFile, wav);
  execFileSync('/usr/bin/afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '32000', wavFile, target]);
  await rm(temp, { recursive: true, force: true });
}

/**
 * 糖水小铺 V5 联网版。
 * 背景音乐 garden-loop 是作者提供的《Summer (Nature's Crescendo)》音轨，作者在 2026-11-18 确认可以用在公开站上，默认保留。
 * 以后要撤下它，加 --mute-tongsui-bgm 重新同步：会用一段静音顶替，游戏的其他声音（CC0 采样）不受影响。
 */
async function tongsui() {
  const source = inCamp('小游戏部署包/糖水小铺-V5-WorkBuddy部署包');
  const target = path.join(playDir, 'tongsui');
  await rm(target, { recursive: true, force: true });
  await cp(source, target, {
    recursive: true,
    filter: (file) => skipJunk(file) && !/部署说明\.md$|build-manifest\.json$/.test(file),
  });
  const assets = await readdir(path.join(target, 'assets'));
  const bgm = assets.filter((name) => /^garden-loop-.*\.m4a$/.test(name));
  let music = '原背景音乐';
  if (flags.has('--mute-tongsui-bgm')) {
    if (bgm.length !== 1) throw new Error(`糖水小铺：预期只有一个 garden-loop-*.m4a，实际找到 ${bgm.length} 个`);
    await silentM4a(path.join(target, 'assets', bgm[0]));
    music = '背景音乐已换成静音占位';
  }
  const manifest = JSON.parse(await readFile(path.join(source, 'build-manifest.json'), 'utf8'));
  await record('tongsui', {
    from: '小游戏部署包/糖水小铺-V5-WorkBuddy部署包/',
    version: manifest.version,
    entrySha256: sha256(await readFile(path.join(target, 'index.html'))),
    bytes: await folderBytes(target),
    note: music,
  });
  console.log(`糖水小铺 V${manifest.version} · ${music}`);
}

/** 胡闹鹅厨房：发布目录里的单文件版，字体和配乐署名一起带上 */
async function kitchen() {
  const source = inCamp('goose-kitchen-game/release/goose-kitchen-v1.5.0-deploy');
  const target = path.join(playDir, 'kitchen');
  const release = JSON.parse(await readFile(path.join(source, 'release.json'), 'utf8'));
  const entry = await readFile(path.join(source, 'index.html'));
  if (sha256(entry) !== release.entrySha256) throw new Error('胡闹鹅厨房：index.html 和 release.json 里登记的校验值对不上');
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, 'index.html'), entry);
  await cp(path.join(source, 'licenses'), path.join(target, 'licenses'), { recursive: true, filter: skipJunk });
  await record('kitchen', {
    from: 'goose-kitchen-game/release/goose-kitchen-v1.5.0-deploy/',
    version: release.version,
    entrySha256: release.entrySha256,
    bytes: await folderBytes(target),
  });
  console.log(`胡闹鹅厨房 ${release.version}`);
}

/** 鹅来切霉运：多文件的部署包（比单文件体验版打开更快），字体授权在 assets/ 里 */
async function luck() {
  const source = inCamp('小游戏部署包/鹅来切霉运-部署包');
  const target = path.join(playDir, 'luck');
  await rm(target, { recursive: true, force: true });
  await cp(source, target, { recursive: true, filter: (file) => skipJunk(file) && !/部署说明\.txt$/.test(file) });
  await record('luck', {
    from: '小游戏部署包/鹅来切霉运-部署包/',
    version: '1.0.0',
    entrySha256: sha256(await readFile(path.join(target, 'index.html'))),
    bytes: await folderBytes(target),
  });
  console.log('鹅来切霉运 1.0.0');
}

const filmList = [
  {
    id: 'guo-shengri',
    from: 'W4作业/制作/蛋糕/07_交付/过生日_25-刘唱.mp4',
    posterAt: 111, // 片尾六人围着蛋糕的合照
  },
  {
    id: 'hey-marvis',
    from: '个人作业/Marvis报告/2026-10-25/视频制作/4小时制作版/完善R6_叙事与IP统一/总装交付_20261110_全部已采用/交付/HeyMarvis_完整合片_20261110.mp4',
    posterAt: 20, // 第一次喊出“Hey, Marvis!”
  },
];

/** 两部短片：保持 720×1280，只把码率降到网页能顺畅播放的大小，并各取一帧做封面 */
async function films() {
  await mkdir(mediaDir, { recursive: true });
  for (const film of filmList) {
    const source = inCamp(film.from);
    const video = path.join(mediaDir, `${film.id}.mp4`);
    const poster = path.join(mediaDir, `${film.id}.jpg`);
    const quiet = { stdio: ['ignore', 'pipe', 'ignore'] };
    const done = execFileSync('/usr/bin/swift', [path.join(here, 'transcode.swift'), source, video, '800', '112'], quiet).toString().trim();
    execFileSync('/usr/bin/swift', [path.join(here, 'frame.swift'), video, poster, String(film.posterAt)], quiet);
    const bytes = (await readFile(video)).length;
    await record(`film:${film.id}`, { from: film.from, sourceSha256: sha256(await readFile(source)), bytes, note: done });
    console.log(`${film.id} ${(bytes / 1048576).toFixed(1)} MB`);
  }
}

/** B 站学习助手的两个交互示例页：单文件、不联网、没有接模型 */
async function bili() {
  const source = inCamp('outputs/B站学习助手改进_20261028/交付');
  const target = path.join(playDir, 'bili');
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  const pages = { 'index.html': '长视频学习建议_交互样例.html', 'course.html': '我的B站选课表_改版示例.html' };
  for (const [name, from] of Object.entries(pages)) {
    const html = await readFile(path.join(source, from), 'utf8');
    if (/(?:src|href)="https?:\/\//.test(html.replace(/href="https:\/\/www\.bilibili\.com[^"]*"/g, ''))) {
      throw new Error(`${from} 引用了外部资源，放上来之前先看一眼`);
    }
    await writeFile(path.join(target, name), html);
  }
  await record('bili', { from: 'outputs/B站学习助手改进_20261028/交付/', bytes: await folderBytes(target), note: '交互示例，页面没有接模型' });
  console.log('B 站学习助手 交互示例 2 页');
}

/** 卡片上用的截图和配图：都是原项目里现成的自测截图、导出卡片和报告配图 */
async function images() {
  const deck = inCamp('outputs/游戏开发心得分享_20261116/制作/图片');
  const garden = path.join(repo, 'public/portfolio/garden');
  await mkdir(garden, { recursive: true });
  const shots = ['tongsui-play.jpg', 'tongsui-card.jpg', 'luck-cut.jpg', 'luck-poster.jpg', 'kitchen-soup.jpg', 'kitchen-matcha.jpg', 'eyu-phone.jpg'];
  for (const name of shots) await cp(path.join(deck, name), path.join(garden, name));
  await cp(
    inCamp('AI风向标/M1/最终提交_20261101/交付/图表/第三轮同任务投入对比.png'),
    path.join(repo, 'public/portfolio/covers/long-board-round3.png'),
  );
  await record('images', {
    from: 'outputs/游戏开发心得分享_20261116/制作/图片/ 与 AI风向标/M1/最终提交_20261101/交付/图表/',
    note: `${shots.length} 张游戏截图 + 1 张报告配图`,
  });
  console.log(`配图 ${shots.length + 1} 张`);
}

const tasks = { eyuzu, tongsui, kitchen, luck, bili, images, films };
const selected = names.length ? names : ['eyuzu', 'tongsui', 'kitchen', 'luck', 'bili', 'images'];
const unknown = selected.filter((name) => !tasks[name]);
if (unknown.length) {
  console.error(`不认识的项目：${unknown.join('、')}（可选：${Object.keys(tasks).join('、')}）`);
  process.exit(2);
}
console.log(`素材来源：${campRoot}`);
for (const name of selected) await tasks[name]();
