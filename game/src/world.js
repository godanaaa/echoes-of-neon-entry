import { DISTRICTS, MISSIONS, VEHICLES, WEAPONS, WORLD } from './config.js';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const landmarkData=[['ECHO TOWER',500,320],['NOVA BRIDGE',1880,610],['NEON CATHEDRAL',1210,920],['SAFEHOUSE',320,1480],['ATLAS REACTOR',2020,1450],['MERIDIAN STATION',1050,300]];

export function createWorld(random){
  const buildings=[];
  for(let y=0;y<WORLD.height;y+=WORLD.block)for(let x=0;x<WORLD.width;x+=WORLD.block){
    const bx=x+WORLD.road/2+10, by=y+WORLD.road/2+10, w=WORLD.block-WORLD.road-20, h=WORLD.block-WORLD.road-20;
    const district=Math.min(5,Math.floor(x/800)+Math.floor(y/600)*2);
    buildings.push({x:bx,y:by,w,h,tone:Math.floor(random()*4),height:.6+random()*1.6,district, sign:random()>.58});
  }
  const player={x:320,y:1480,vx:0,vy:0,angle:-Math.PI/2,hp:100,maxHp:100,credits:140,echo:100,echoCooldown:0,echoTime:0,weapon:0,ammo:WEAPONS.map(w=>w.mag),reload:0,shotTimer:0,meleeTimer:0,car:-1,hop:0,invuln:0,fragments:0,upgrades:{health:0,echo:0,handling:0}};
  const traffic=Array.from({length:6},(_,i)=>({x:180+(i*367)%2100,y:124+(i%2)*300,angle:i%2?Math.PI:0,speed:45+random()*44,type:i%3,color:['#f44f94','#58cadb','#e9a64d'][i%3],route:i%2}));
  const peds=Array.from({length:10},(_,i)=>({x:90+random()*2200,y:100+random()*1600,phase:random()*8,speed:12+random()*20,panic:0,color:['#6fd6cf','#f497c7','#d8b96a','#bac8e8'][i%4]}));
  const enemies=[
    ...[['Guard',710,430],['Rusher',1270,740],['Heavy',1660,1080],['Hunter',900,1300],['Guard',2040,500],['Rusher',1770,1510]].map(([type,x,y],i)=>({type,x,y,hp:type==='Heavy'?160:75,max:type==='Heavy'?160:75,state:'PATROL',phase:i,attack:0,dead:false})),
  ];
  const fragments=Array.from({length:20},(_,i)=>{const [x,y]=[[490,230],[790,500],[1110,210],[1490,400],[1900,760],[350,910],[680,1070],[1050,1120],[1400,850],[1730,1000],[2150,1190],[420,1580],[810,1450],[1190,1500],[1570,1580],[1970,1460],[2250,320],[250,570],[950,720],[1800,280]][i];return{x,y,found:false,id:i};});
  const state={player,buildings,traffic,peds,enemies,fragments,landmarks:landmarkData.map(([name,x,y])=>({name,x,y})),mission:0,objective:0,screen:'title',elapsed:0,combat:0,worldTime:0,radio:0,toast:'',toastTime:0,shots:[],particles:[],map:false,completed:0};
  function reset(){const keep=player.credits;Object.assign(player,{x:320,y:1480,vx:0,vy:0,hp:player.maxHp,angle:-Math.PI/2,car:-1,echo:100,echoTime:0,echoCooldown:0,ammo:WEAPONS.map(w=>w.mag),fragments:0});state.mission=0;state.objective=0;state.elapsed=0;state.radio=0;state.toast='';state.completed=0;for(const f of fragments)f.found=false;for(const e of enemies){e.hp=e.max;e.dead=false;e.state='PATROL';} player.credits=keep;}
  function current(){return MISSIONS[Math.min(state.mission,MISSIONS.length-1)];}
  function finishMission(){state.completed++;player.credits+=100+state.mission*35;state.mission++;state.objective=0;state.radio=3.2;state.missionStart=state.elapsed+18;state.toast=state.mission>=MISSIONS.length?'SIGNAL RESTORED — NOVA HAVEN REMEMBERS':'MISSION COMPLETE  + CREDITS';state.toastTime=3.5;}
  function completeObjective(){finishMission();}
  function nearestLandmark(){let best=null,d=1e9;for(const l of state.landmarks){const n=dist(player,l);if(n<d){d=n;best=l;}}return d<100?best:null;}
  function interact(){const m=current();if(player.car>=0){player.car=-1;const c=traffic[0];player.x=c.x+40;player.y=c.y+10;return;}if(m[1]==='interact'||m[1]==='activate'){if(state.mission===1&&Math.hypot(player.x-500,player.y-320)<170||state.mission===7&&Math.hypot(player.x-1800,player.y-1500)<210||state.mission===8&&Math.hypot(player.x-2020,player.y-1450)<210||state.mission===9){completeObjective();}else if(Math.hypot(player.x-320,player.y-1480)<140){const key=['health','echo','handling'][Math.floor(random()*3)];if(player.credits>=180){player.credits-=180;player.upgrades[key]++;if(key==='health'){player.maxHp+=18;player.hp=player.maxHp;}if(key==='echo')player.echo=100;state.toast=`SAFEHOUSE UPGRADE — ${key.toUpperCase()}`;state.toastTime=2.5;}}return;}
    if(m[1]==='collect'){const f=fragments.find(q=>!q.found&&dist(player,q)<125);if(f){f.found=true;player.fragments++;player.credits+=40;completeObjective();return;}}
    const c=traffic.find(v=>Math.hypot(v.x-player.x,v.y-player.y)<100);if(c){player.car=traffic.indexOf(c);player.x=c.x;player.y=c.y;return;}const l=nearestLandmark();if(l){state.toast=`${l.name}  •  ${DISTRICTS[Math.floor(l.y/600)*2+Math.floor(l.x/800)]||'NOVA HAVEN'}`;state.toastTime=1.6;}}
  function fire(){const w=WEAPONS[player.weapon];if(player.reload>0||player.shotTimer>0)return;if(player.ammo[player.weapon]<=0){player.reload=w.reload;return;}player.ammo[player.weapon]--;player.shotTimer=w.cooldown;state.shots.push({x:player.x,y:player.y,dx:Math.cos(player.angle),dy:Math.sin(player.angle),life:.5,weapon:player.weapon});for(let i=0;i<3;i++)state.particles.push({x:player.x,y:player.y,vx:(random()-.5)*90,vy:(random()-.5)*90,life:.23,color:'#ffc66d'});}
  function step(dt,input,screen){const p=player;state.worldTime+=dt;if(state.toastTime>0)state.toastTime-=dt;if(state.radio>0)state.radio-=dt;
    if(screen==='title'||screen==='paused'||screen==='over'||screen==='victory')return;
    state.elapsed+=dt;state.combat=Math.max(0,state.combat-dt);if(p.invuln>0)p.invuln-=dt;if(p.echoCooldown>0)p.echoCooldown-=dt;if(p.echoTime>0){p.echoTime-=dt;p.echo=Math.max(0,p.echo-dt*(8+p.upgrades.echo*2));}else p.echo=Math.min(100,p.echo+dt*3.3);
    if(p.shotTimer>0)p.shotTimer-=dt;if(p.meleeTimer>0)p.meleeTimer-=dt;if(p.reload>0){p.reload-=dt;if(p.reload<=0)p.ammo[p.weapon]=WEAPONS[p.weapon].mag;}
    if(input.take('KeyQ')&&p.echo>=30&&p.echoCooldown<=0){p.echoTime=5+p.upgrades.echo*.7;p.echo-=30;p.echoCooldown=11;state.toast='ECHO VISION — SIGNAL TRACE';state.toastTime=1.4;}
    if(input.take('KeyR'))p.reload=WEAPONS[p.weapon].reload;if(input.take('Digit1'))p.weapon=0;if(input.take('Digit2'))p.weapon=1;if(input.take('Digit3'))p.weapon=2;
    if(input.take('KeyE'))interact();if(input.take('KeyF')&&p.meleeTimer<=0){p.meleeTimer=.45;state.combat=4;for(const e of enemies)if(!e.dead&&dist(p,e)<82){e.hp-=80;e.state=e.hp<=0?'DEAD':'CHASE';if(e.hp<=0)e.dead=true;state.particles.push({x:e.x,y:e.y,vx:0,vy:0,life:.42,color:'#ff4f9a'});}}
    if(input.take('KeyM'))state.map=!state.map;if(input.take('KeyN'))state.toast='AUDIO TOGGLED';
    if(input.firing)fire();
    const pointer=input.pointer(), screenW=window.innerWidth, screenH=window.innerHeight, camX=clamp(p.x-screenW*.5,0,WORLD.width-screenW),camY=clamp(p.y-screenH*.54,0,WORLD.height-screenH*.75);p.angle=Math.atan2(pointer.y-(p.y-camY),pointer.x-(p.x-camX));
    let ax=(input.down.has('KeyD')?1:0)-(input.down.has('KeyA')?1:0),ay=(input.down.has('KeyS')?1:0)-(input.down.has('KeyW')?1:0);const mag=Math.hypot(ax,ay)||1;ax/=mag;ay/=mag;
    if(p.car>=0){const car=traffic[p.car],spec=VEHICLES[p.car%3],acc=!!input.down.has('KeyW')?1:input.down.has('KeyS')?-.7:0;car.speed=clamp((car.speed||0)+acc*spec.acceleration*dt,-100,spec.max);car.angle+=((input.down.has('KeyD')?1:0)-(input.down.has('KeyA')?1:0))*spec.handling*dt*Math.max(.35,Math.abs(car.speed)/spec.max);car.x=clamp(car.x+Math.cos(car.angle)*car.speed*dt,20,WORLD.width-20);car.y=clamp(car.y+Math.sin(car.angle)*car.speed*dt,20,WORLD.height-20);p.x=car.x;p.y=car.y;p.angle=car.angle;}
    else{const speed=input.down.has('ShiftLeft')||input.down.has('ShiftRight')?285:195;p.vx+=(ax*speed-p.vx)*Math.min(1,dt*9);p.vy+=(ay*speed-p.vy)*Math.min(1,dt*9);p.x=clamp(p.x+p.vx*dt,18,WORLD.width-18);p.y=clamp(p.y+p.vy*dt,18,WORLD.height-18);if(Math.hypot(p.vx,p.vy)>15)p.angle=Math.atan2(p.vy,p.vx);if(input.take('Space'))p.hop=.35;if(p.hop>0)p.hop-=dt;}
    for(const c of traffic){if(c===traffic[p.car])continue;if(c.speed==null)c.speed=55;c.x+=Math.cos(c.angle)*c.speed*dt;c.y+=Math.sin(c.angle)*c.speed*dt;if(c.route===0&&c.x>WORLD.width+40)c.x=-30;if(c.route===1&&c.x<-40)c.x=WORLD.width+20;}
    for(const q of peds){q.phase+=dt;if(q.panic>0)q.panic-=dt;const d=dist(q,p);if(state.combat>0&&d<300)q.panic=3;if(q.panic>0){const a=Math.atan2(q.y-p.y,q.x-p.x);q.x=clamp(q.x+Math.cos(a)*q.speed*3*dt,15,WORLD.width-15);q.y=clamp(q.y+Math.sin(a)*q.speed*3*dt,15,WORLD.height-15);}else{q.x+=Math.cos(q.phase)*q.speed*.25*dt;q.y+=Math.sin(q.phase*.7)*q.speed*.25*dt;}}
    for(const e of enemies){if(e.dead)continue;const d=dist(e,p);if(d<440)e.state=d<55?'ATTACK':'CHASE';else e.state='PATROL';e.phase+=dt;if(e.state==='CHASE'){let a=Math.atan2(p.y-e.y,p.x-e.x);const s=e.type==='Hunter'?115:e.type==='Heavy'?34:e.type==='Rusher'?80:48;e.x+=Math.cos(a)*s*dt;e.y+=Math.sin(a)*s*dt;}else if(e.state==='PATROL'){e.x+=Math.cos(e.phase)*10*dt;e.y+=Math.sin(e.phase*.7)*10*dt;}if(d<48&&e.attack<=0){e.attack=1.1;p.hp-=e.type==='Heavy'?14:7;p.invuln=.35;state.combat=4;state.particles.push({x:p.x,y:p.y,vx:0,vy:0,life:.35,color:'#ff4f9a'});}e.attack=Math.max(0,e.attack-dt);}
    for(const s of state.shots){s.x+=s.dx*WEAPONS[s.weapon].speed*dt;s.y+=s.dy*WEAPONS[s.weapon].speed*dt;s.life-=dt;for(const e of enemies)if(!e.dead&&Math.hypot(s.x-e.x,s.y-e.y)<28){e.hp-=WEAPONS[s.weapon].damage;e.state=e.hp<=0?'DEAD':'CHASE';if(e.hp<=0){e.dead=true;p.credits+=25;}s.life=0;state.combat=4;state.particles.push({x:e.x,y:e.y,vx:(random()-.5)*50,vy:(random()-.5)*50,life:.28,color:'#ff659c'});}}
    state.shots=state.shots.filter(s=>s.life>0);for(const z of state.particles){z.x+=z.vx*dt;z.y+=z.vy*dt;z.life-=dt;}state.particles=state.particles.filter(z=>z.life>0);
    const m=current(),target=state.landmarks[[0,0,1,2,2,3,4,4,4,0][state.mission]||0];
    if(m){if(m[1]==='travel'&&dist(p,target)<150)completeObjective();if(m[1]==='drive'&&p.car>=0&&dist(p,target)<170)completeObjective();if(m[1]==='eliminate'&&enemies.filter(e=>!e.dead).length<=3)completeObjective();if(m[1]==='survive'&&state.elapsed>=(state.missionStart|| (state.missionStart=state.elapsed+18)))completeObjective();}
    if(p.hp<=0){p.hp=0;state.screen='over';}
  }
  reset();return {state,reset,step,current,completeObjective,interact};
}
