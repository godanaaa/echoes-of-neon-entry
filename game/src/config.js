export const WORLD = { width: 2400, height: 1800, road: 124, block: 300 };
export const STEP = 1 / 60;
export const DISTRICTS = ['CENTRAL NOVA', 'OLD HARBOR', 'NEON MARKET', 'INDUSTRIAL ZONE', 'SKYLINE HEIGHTS', 'UNDERCITY'];
export const VEHICLES = [
  { name: 'PULSE RUNNER', color: '#fa4e9a', acceleration: 340, max: 430, handling: 4.5, armor: 80 },
  { name: 'HELIX SUV', color: '#66e6d1', acceleration: 240, max: 315, handling: 3.2, armor: 150 },
  { name: 'ATLAS VAN', color: '#f5ad54', acceleration: 145, max: 220, handling: 2.2, armor: 240 },
];
export const WEAPONS = [
  { name: 'PULSE PISTOL', mag: 12, cooldown: .28, damage: 34, speed: 680, reload: 1.05 },
  { name: 'COMPACT SMG', mag: 30, cooldown: .105, damage: 16, speed: 720, reload: 1.35 },
  { name: 'SCATTER RIFLE', mag: 8, cooldown: .62, damage: 22, speed: 620, reload: 1.5 },
];
export const MISSIONS = [
 ['THE BLACKOUT','travel','Reach the first dead relay.','Mira: Kade, the whole waterfront just went dark. Find the relay.'],
 ['DEAD SIGNAL','interact','Trace the signal at Echo Tower.','Mira: There is a pulse under the noise. Touch the tower terminal.'],
 ['RUNNER','drive','Drive the Pulse Runner to Nova Bridge.','Mira: I left a relay key in the runner. Get it across town.'],
 ['GHOST NODE','eliminate','Clear the hostile crew by Neon Cathedral.','Mira: Security is already there. Make a little room.'],
 ['AFTERIMAGE','collect','Recover an Echo fragment.','Mira: Switch on Echo Vision. It leaves a trail in the rain.'],
 ['LOCKDOWN','survive','Hold out for 18 seconds.','Mira: Gates are closing. Keep moving until the grid cycles.'],
 ['HUNTED','drive','Reach Skyline Heights in any vehicle.','Mira: They have your plate. Take the high road, fast.'],
 ['BELOW','activate','Activate the Undercity access node.','Mira: The old flood channel still has power. Go below.'],
 ['THE CORE','interact','Reach and access the Atlas Reactor.','Mira: I found the source. Whatever you hear in there, listen.'],
 ['ECHOES','activate','Bring the city signal back online.','Mira: Kade, Echo remembers the people it was built to protect.'],
];
export const PALETTE = { ink:'#06101b', cyan:'#56f4eb', pink:'#ff4f9a', gold:'#ffc66d', white:'#effcff', muted:'#8aa5b4' };
