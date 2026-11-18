import { STEP } from './config.js';
import { createRandom } from './random.js';
import { createAudio } from './audio.js';
import { createInput } from './input.js';
import { createWorld } from './world.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';

// ECHOES OF NEON — Nova Haven runs as a static, offline browser game.
const MAX_FRAME=.25, SAVE_KEY='echoes-of-neon.save.v1';
const params=new URLSearchParams(location.search),shot=params.get('shot');
const parsed=Number.parseInt(params.get('seed')||'',10),seed=Number.isInteger(parsed)?parsed:0x4e4f5641;
const canvas=document.getElementById('game'),status=document.getElementById('status');
const world=createWorld(createRandom(seed)),renderer=createRenderer(canvas),input=createInput(canvas),audio=createAudio();
let screen='title',echo=false,muted=false,accumulator=0,last=performance.now(),bestMission=0;
function announce(message){status.textContent=message;}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({mission:world.state.mission,credits:world.state.player.credits,fragments:world.state.player.fragments,upgrades:world.state.player.upgrades,hp:world.state.player.maxHp}));}catch{}}
function start(){world.reset();screen='play';world.state.screen='play';const raw=(()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null');}catch{return null;}})();if(raw){world.state.mission=Math.min(9,Math.max(0,raw.mission||0));world.state.player.credits=Math.max(0,raw.credits||140);world.state.player.fragments=Math.max(0,raw.fragments||0);if(raw.upgrades)Object.assign(world.state.player.upgrades,raw.upgrades);world.state.player.maxHp=Math.max(100,raw.hp||100);world.state.player.hp=world.state.player.maxHp;}world.state.radio=3.2;announce('Nova Haven. Mira Vale is on the radio.');audio.play('mission');}
function pause(){screen=screen==='play'?'paused':'play';world.state.screen=screen;}
function actions(){if(input.take('KeyN')){muted=audio.toggle();world.state.toast=muted?'AUDIO MUTED':'AUDIO LIVE';world.state.toastTime=1.5;}if(input.take('Escape')||input.take('KeyP')){if(screen==='play'||screen==='paused')pause();else if(world.state.map)world.state.map=false;}if(input.take('KeyM')&&screen==='play')world.state.map=!world.state.map;if(input.take('Enter')||input.take('Space')){if(screen==='title'||screen==='over'||screen==='victory')start();else if(screen==='paused')pause();}if(input.take('KeyQ')){ // consume in world step so energy/cooldown remain authoritative
    input.pressed.add('KeyQ');
  }}
function step(){const before=world.state.mission,ammo=world.state.player.ammo[world.state.player.weapon],echoWas=world.state.player.echoTime,meleeWas=world.state.player.meleeTimer;world.step(STEP,input,screen);const s=world.state;if(s.screen==='over'){screen='over';announce('Signal lost. Press Enter to restart.');audio.play('hit');save();}if(s.mission!==before){audio.play('mission');save();if(s.mission>=10){s.screen='victory';screen='victory';announce('Signal restored. Nova Haven wakes.');}}if(s.player.ammo[s.player.weapon]<ammo)audio.play('shot');if(s.player.echoTime>echoWas)audio.play('echo');if(s.player.meleeTimer>meleeWas)audio.play('melee');if(s.player.fragments>0&&s.player.fragments>bestMission){bestMission=s.player.fragments;audio.play('collect');save();}}
function frame(now){requestAnimationFrame(frame);accumulator+=Math.min((now-last)/1000,MAX_FRAME);last=now;actions();if(screen==='play'){while(accumulator>=STEP){step();accumulator-=STEP;}}else accumulator=0;renderer.draw(world.state,echo||world.state.player.echoTime>0);}
if(shot){const staged=stageShot(shot,world);screen=world.state.screen;echo=staged.echo;let paints=0;function paint(){renderer.draw(world.state,echo);if(++paints<2)requestAnimationFrame(paint);else window.__shotReady=true;}requestAnimationFrame(paint);}else{world.state.screen=screen;announce('Echoes of Neon. Press Enter to begin.');requestAnimationFrame(frame);}
