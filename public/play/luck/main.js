import { ContentPool, chooseQuote } from './data.js';
import { TofuGame } from './game.js';
import { createMusicController } from './music.js';

const $ = id => document.getElementById(id);
const icons = {
  sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m11 5-6 4H2v6h3l6 4V5Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>',
  mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m11 5-6 4H2v6h3l6 4V5Zm5 4 6 6m0-6-6 6"/></svg>',
  haptic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M3 7v10M21 7v10M11 18h2"/></svg>',
  help: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 0 1 5 .8c0 2-2.5 2-2.5 4M12 17h.01"/></svg>'
};
icons.music='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17V5l10-2v12M10 8l10-2"/><ellipse cx="7" cy="17" rx="3" ry="2.5"/><ellipse cx="17" cy="15" rx="3" ry="2.5"/></svg>';
icons.musicOff='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17V5l10-2v12M10 8l10-2M3 3l18 18"/><ellipse cx="7" cy="17" rx="3" ry="2.5"/><ellipse cx="17" cy="15" rx="3" ry="2.5"/></svg>';
let soundEnabled = true;
let hapticEnabled = false;
let audioContext;
let session = { boardCount: 0, blockCount: 0, badLuckCount: 0, boardNumber: 0 };
let currentScreen = 'home';
let quote;
let previousQuoteId = null;
let posterBlob;
let posterUrl;
let toastTimer;
let lastThrownItem = null;
const pool = new ContentPool();
const music = createMusicController({
  getContext:getAudioContext,
  getSource:key=>$(key==='cut'?'bgm-cut':'bgm-shop').src,
  onState:updateSettings,
  onError:()=>toast('音乐暂时没载入，点音符按钮可以重试。')
});

function getAudioContext() {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  return audioContext;
}
function unlockMusic() {
  const state=music.getState();
  if(!state.unlocked || state.contextState!=='running')void music.unlock();
}
document.addEventListener('pointerdown',unlockMusic,{capture:true,passive:true});
document.addEventListener('keydown',event=>{if(!event.repeat)unlockMusic();},{capture:true});

function sound(type) {
  if (!soundEnabled) return;
  try {
    getAudioContext();
    if (audioContext.state === 'suspended') audioContext.resume();
    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    gain.connect(audioContext.destination);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(type === 'complete' ? .05 : .028, now + .008);
    gain.gain.exponentialRampToValueAtTime(.001, now + .21);
    const osc = audioContext.createOscillator();
    osc.type = 'sine';
    const pitches = { cut: [900, 260], throw: [440, 1000], poke: [330, 500], complete: [520, 1040] };
    const [from, to] = pitches[type] || pitches.poke;
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(to, now + .15);
    osc.connect(gain);osc.start(now);osc.stop(now + .23);
  } catch { /* 不支持音频时仍可正常游玩。 */ }
}
function vibrate(type) {
  if (hapticEnabled && typeof navigator.vibrate === 'function') {
    try { navigator.vibrate(type === 'complete' ? [14, 50, 14] : 12); } catch { /* 设备不支持时跳过。 */ }
  }
}
function feedback(type) {
  sound(type);vibrate(type);
  if(type==='cut'||type==='throw'||type==='complete')music.duck();
}
function setControlIcon(id,key) {
  const button=$(id);
  if(button.dataset.icon===key)return;
  button.innerHTML=icons[key];
  button.dataset.icon=key;
}
function updateSettings() {
  const musicEnabled=music.getState().enabled;
  setControlIcon('music-toggle',musicEnabled?'music':'musicOff');
  $('music-toggle').setAttribute('aria-pressed',String(musicEnabled));
  $('music-toggle').setAttribute('aria-label',musicEnabled?'关闭背景音乐':'开启背景音乐');
  $('music-toggle').title=musicEnabled?'关闭背景音乐':'开启背景音乐';
  setControlIcon('sound-toggle',soundEnabled?'sound':'mute');
  $('sound-toggle').setAttribute('aria-pressed', String(soundEnabled));
  $('sound-toggle').setAttribute('aria-label', soundEnabled ? '关闭音效' : '开启音效');
  setControlIcon('haptic-toggle','haptic');
  $('haptic-toggle').setAttribute('aria-pressed', String(hapticEnabled));
  $('haptic-toggle').setAttribute('aria-label', hapticEnabled ? '关闭震动' : '开启震动');
  setControlIcon('help-button','help');
}
$('music-toggle').addEventListener('click',()=>{
  const enabled=!music.getState().enabled;
  music.setEnabled(enabled);
  if(enabled)void music.unlock();
  updateSettings();
});
$('sound-toggle').addEventListener('click', () => { soundEnabled = !soundEnabled;updateSettings();if(soundEnabled)sound('poke'); });
$('haptic-toggle').addEventListener('click', () => {
  if (typeof navigator.vibrate !== 'function') { toast('这台设备暂不支持网页震动，照样可以玩。');return; }
  hapticEnabled = !hapticEnabled;updateSettings();vibrate('poke');
});
function toast(text) {
  clearTimeout(toastTimer);$('toast').textContent=text;$('toast').hidden=false;
  toastTimer=setTimeout(() => { $('toast').hidden=true; }, 3200);
}
function setScreen(screen) {
  currentScreen=screen;
  document.body.dataset.screen=screen;
  if(screen!=='play')music.setScene('shop');
  for (const name of ['home','play','result']) $(`${name}-screen`).hidden=name!==screen;
  window.scrollTo({top:0,behavior:'instant'});
}
function openDialog(id) { if (!$(id).open) $(id).showModal(); }
function closeDialog(id) { $(id).close(); }
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>closeDialog(button.dataset.close)));
$('board-dialog').addEventListener('cancel', event => {event.preventDefault();endSession();});
function showInfo(title,html) { $('info-title').textContent=title;$('info-content').innerHTML=html;openDialog('info-dialog'); }
$('help-button').addEventListener('click',()=>showInfo('切一切，再甩一甩。','<p><strong>先切开</strong><br>沿豆腐上的虚线滑动。三横三竖，切完六刀，小块就散开啦。</p><p><strong>再甩走</strong><br>按住一块，往喜欢的方向拖开并松手。每甩走一个烦恼，鹅老板都会回你一句。</p><p>不方便做手势，可以用切割台下面的点击辅助。没有计时，不扣分；随时可以收工。</p>'));
$('about-button').addEventListener('click',()=>showInfo('鹅老板的小店','<p>《鹅来切霉运》是一款按所提供策划案制作的放松小游戏。切开霉豆腐，再把烦恼轻轻甩走。</p><p>这里没有过关分数，也没有必须变开心的要求。来坐一会就好。</p><p>本轮数据只在当前页面保留。刷新页面会重新开始。</p>'));
function poke() { feedback('poke');openDialog('story-dialog'); }
$('poke-button').addEventListener('click',poke);$('tofu-hotspot').addEventListener('click',poke);
document.querySelector('.wordmark').addEventListener('click',event=>{
  event.preventDefault();
  returnHome();
});

function setComfort(text) {
  $('comfort-text').textContent=text;
  const bubble=$('comfort-bubble');
  bubble.classList.remove('fresh');
  void bubble.offsetWidth;
  bubble.classList.add('fresh');
}
function setHeldPreview(preview) {
  $('held-label').hidden=!preview;
  $('held-label').textContent=preview ? `先甩掉「${preview.item.badLuck}」` : '';
}
function renderProgress(count,total) {
  $('phase-count').textContent=`${count} / ${total} ${total===6?'刀':'块'}`;
  $('progress-marks').innerHTML=Array.from({length:total===6?6:8},(_,i)=>`<i class="${i<(total===6?count:Math.ceil(count/2))?'done':''}"></i>`).join('');
  $('progress-marks').setAttribute('aria-label',`已完成${count}，共${total}`);
}
function renderStats() { $('total-luck').textContent=session.badLuckCount;$('total-boards').textContent=session.boardCount; }
const game = new TofuGame({
  canvas:$('game-canvas'),
  onCut:({count,total})=>{
    renderProgress(count,total);feedback('cut');
    $('play-instruction').textContent='沿着剩下的虚线，从这头划到那头。';
    $('game-hint').textContent=count===6 ? '切好啦，按住小块，往外甩。' : '这一刀切开啦，沿剩下的虚线继续。';
    if(count===1)setComfort('对，就是这样。慢慢切就好。');
  },
  onThrow:({item,removed,total})=>{
    lastThrownItem=item;
    $('play-instruction').textContent='按住下一块，拖开再松手。';
    session.blockCount++;session.badLuckCount++;renderStats();renderProgress(removed,total);setComfort(item.comfort);feedback('throw');
  },
  onPreview:setHeldPreview,
  onPhaseChange:phase=>{
    if(phase==='throw'){
      music.setScene('shop');
      $('play-title').textContent='把烦恼，轻轻甩走。';$('play-instruction').textContent='按住一块，拖开再松手。甩向哪里都可以。';
      $('phase-label').textContent='甩掉霉运';renderProgress(0,16);
      $('assist-button').innerHTML='不方便甩？点这里甩一块 '+icons.haptic;
      $('game-hint').textContent='点一下不会甩走，放心试试。';setComfort('切好啦！现在，把烦恼甩远一点。');
      $('game-canvas').style.cursor='grab';
    }
  },
  onComplete:()=>{
    session.boardCount++;renderStats();feedback('complete');
    $('board-last-comfort').textContent=lastThrownItem.comfort;
    $('board-complete-note').textContent=`这次已经甩走 ${session.badLuckCount} 个霉运。还想再坐一会吗？`;
    openDialog('board-dialog');
  },
  onNudge:text=>{
    $('game-hint').textContent=text;
    $('play-instruction').textContent=text;
  }
});
function nextBoard() {
  closeDialog('board-dialog');session.boardNumber++;
  lastThrownItem=null;setHeldPreview(null);
  $('board-number').textContent=`第 ${session.boardNumber} 板`;
  $('play-title').textContent='先把霉运，切成小块。';$('play-instruction').textContent='沿一条虚线，从这头划到那头。';
  $('phase-label').textContent='切开霉运';$('assist-button').innerHTML='不方便划？点这里切一刀 '+icons.help;
  $('game-hint').textContent='三横三竖，共六刀。慢慢划就好。';$('game-canvas').style.cursor='crosshair';
  renderProgress(0,6);renderStats();setComfort(session.boardNumber===1?'这一板，鹅陪你慢慢切。':'新的一板来咯，慢慢切，不着急。');
  setScreen('play');music.setScene('cut');game.start(pool.draw(session.boardNumber));$('play-title').focus({preventScroll:true});
}
function startSession() {
  closeDialog('story-dialog');pool.reset();session={boardCount:0,blockCount:0,badLuckCount:0,boardNumber:0};
  posterBlob=null;if(posterUrl){URL.revokeObjectURL(posterUrl);posterUrl=null;}nextBoard();
}
$('start-button').addEventListener('click',startSession);
$('assist-button').addEventListener('click',()=>{if(game.phase==='cut')game.cutNext();else if(game.phase==='throw')game.throwNext();});
$('next-board-button').addEventListener('click',nextBoard);
$('finish-button').addEventListener('click',endSession);$('end-button').addEventListener('click',endSession);
function endSession() {
  closeDialog('board-dialog');
  // 正在飞出的最后一块仍按完整一板计算，避免收工按钮与动画结束抢先。
  if(game.removed===16)session.boardCount=Math.max(session.boardCount,session.boardNumber);
  game.destroy();setHeldPreview(null);
  quote=chooseQuote(session,previousQuoteId);previousQuoteId=quote.id;
  const date=new Date();
  $('receipt-date').textContent=date.toLocaleDateString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit'}).replaceAll('/','.');
  $('result-count').textContent=session.badLuckCount;
  const summary=`甩走 ${session.blockCount} 块霉豆腐 · 完整清空 ${session.boardCount} 板`;
  $('receipt-summary').textContent=summary;
  $('result-summary').textContent=summary;
  $('result-quote').textContent=quote.text;
  $('final-quote').textContent=quote.text;
  $('receipt-id').textContent=`GOOSE · ${String(session.badLuckCount).padStart(4,'0')} · ${date.getFullYear()}`;
  $('result-note').textContent='想留住这一刻，就把小票带走吧。';posterBlob=null;
  setScreen('result');$('result-heading').focus({preventScroll:true});
}
$('replay-button').addEventListener('click',startSession);
$('return-home-button').addEventListener('click',returnHome);
function returnHome() {
  game.destroy();setHeldPreview(null);closeDialog('board-dialog');
  setScreen('home');$('poke-button').focus({preventScroll:true});
}

function rounded(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();ctx.fill();}
function wrapText(ctx,text,x,y,maxWidth,lineHeight){let line='';let row=0;for(const char of text){if(ctx.measureText(line+char).width>maxWidth&&line){ctx.fillText(line,x,y+row*lineHeight);line=char;row++;}else line+=char;}if(line)ctx.fillText(line,x,y+row*lineHeight);return (row+1)*lineHeight;}
async function getPoster() {
  if(posterBlob)return posterBlob;
  await document.fonts.ready;
  const canvas=document.createElement('canvas');canvas.width=900;canvas.height=1380;const ctx=canvas.getContext('2d');
  ctx.fillStyle='#10212d';ctx.fillRect(0,0,900,1380);
  ctx.fillStyle='#98eace';ctx.textAlign='center';ctx.font='43px Goose';ctx.fillText('鹅来切霉运',450,95);
  ctx.fillStyle='#f5f1dc';rounded(ctx,85,150,730,1125,6);
  ctx.fillStyle='#10212d';
  for(let x=85;x<815;x+=30){ctx.beginPath();ctx.moveTo(x,1275);ctx.lineTo(x+15,1256);ctx.lineTo(x+30,1275);ctx.fill();}
  ctx.fillStyle='#5b746a';ctx.textAlign='left';ctx.font='21px sans-serif';ctx.fillText('鹅老板的小店',135,210);ctx.textAlign='right';ctx.fillText($('receipt-date').textContent,765,210);
  ctx.textAlign='center';ctx.fillStyle='#263f39';ctx.font='56px Goose';ctx.fillText('霉运清理小票',450,326);
  ctx.fillStyle='#28735b';ctx.font='168px sans-serif';ctx.fillText(String(session.badLuckCount),450,528);
  ctx.fillStyle='#3e5d51';ctx.font='30px sans-serif';ctx.fillText('个霉运，已甩走',450,595);
  ctx.font='23px sans-serif';ctx.fillText(`甩走 ${session.blockCount} 块霉豆腐 · 完整清空 ${session.boardCount} 板`,450,657);
  ctx.strokeStyle='#879d8c';ctx.setLineDash([7,8]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(140,705);ctx.lineTo(760,705);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#263f39';ctx.font='35px Goose';wrapText(ctx,quote.text,450,775,580,52);
  const goose=$('companion-goose');
  if(!goose.complete){try{await goose.decode();}catch{}}
  if(goose.naturalWidth){const ratio=goose.naturalWidth/goose.naturalHeight;const h=275;const w=h*ratio;ctx.drawImage(goose,180-w/2+100,875,w,h);}
  ctx.textAlign='left';ctx.fillStyle='#416252';ctx.font='29px Goose';ctx.fillText('鹅老板盖章，下班！',470,985);
  ctx.save();ctx.translate(645,1090);ctx.rotate(-.18);ctx.strokeStyle='#be748a';ctx.fillStyle='#b8697f';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,60,0,Math.PI*2);ctx.stroke();ctx.textAlign='center';ctx.font='30px Goose';ctx.fillText('霉运',0,-5);ctx.fillText('打烊',0,31);ctx.restore();
  ctx.textAlign='center';ctx.fillStyle='#5f7768';ctx.font='21px sans-serif';ctx.fillText('不必事事顺利，也值得好好休息。',450,1208);
  ctx.fillStyle='#98bcb9';ctx.font='21px sans-serif';ctx.fillText('今天的烦恼，到此为止。',450,1335);
  posterBlob=await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('图片生成失败')),'image/png'));
  return posterBlob;
}
async function showPoster(note) {
  const blob=await getPoster();if(posterUrl)URL.revokeObjectURL(posterUrl);posterUrl=URL.createObjectURL(blob);
  $('poster-preview').src=posterUrl;$('poster-download').href=posterUrl;
  await $('poster-preview').decode();openDialog('poster-dialog');
  if(note)$('result-note').textContent=note;
}
$('save-button').addEventListener('click',async()=>{
  const button=$('save-button');button.disabled=true;
  try{
    const blob=await getPoster();
    if(/iPhone|iPad|iPod|Android|MicroMessenger/i.test(navigator.userAgent))await showPoster('长按图片保存，就能把这份轻松带走。');
    else{const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download='鹅来切霉运-收工小票.png';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('收工小票已生成，正在下载。');}
  }catch{toast('图片还没生成好，请再试一次。');}finally{button.disabled=false;}
});
$('share-button').addEventListener('click',async()=>{
  const button=$('share-button');button.disabled=true;
  try{
    const blob=await getPoster();const file=new File([blob],'鹅来切霉运-收工小票.png',{type:'image/png'});
    if(navigator.canShare?.({files:[file]})&&navigator.share){
      try{await navigator.share({files:[file],title:'鹅来切霉运',text:`今天甩走了${session.badLuckCount}个霉运。剩下的，慢慢来。`});}
      catch(error){if(error.name!=='AbortError')await showPoster('这里暂时无法调起系统分享。保存图片，再发给朋友吧。');}
    }else await showPoster('这里暂时无法调起系统分享。保存图片，再发给朋友吧。');
  }catch{toast('海报暂时没生成好，请重试。');}finally{button.disabled=false;}
});
updateSettings();
document.body.dataset.screen=currentScreen;
// 供浏览器验收读取状态，不提供修改接口。
window.getGooseGameState=()=>({...session,phase:game.phase,cuts:game.cuts,removed:game.removed,screen:currentScreen,view:game.getView(),comfort:$('comfort-text').textContent,quote:quote?.text||'',music:music.getState()});
