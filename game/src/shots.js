// Screenshot scenes are staged from the same world objects and renderer used by live play.
export function stageShot(name,world){
  world.reset();const s=world.state,p=s.player;
  if(name==='start'){s.screen='title';p.x=500;p.y=320;return {echo:false};}
  s.screen='play';
  if(name==='play'){p.x=850;p.y=630;s.mission=2;s.radio=0;s.enemies[0].state='CHASE';s.enemies[0].x=930;s.enemies[0].y=595;s.enemies[1].x=770;s.enemies[1].y=670;s.traffic[0].x=870;s.traffic[0].y=520;s.traffic[1].x=740;s.traffic[1].y=520;p.angle=.1;return {echo:false};}
  if(name==='echo'){p.x=1050;p.y=1110;p.echoTime=4;s.mission=4;s.radio=2;return {echo:true};}
  p.x=1210;p.y=920;s.mission=9;s.completed=9;s.screen='victory';return {echo:false};
}
