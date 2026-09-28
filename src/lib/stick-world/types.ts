export type State = 'stepping' | 'tapping' | 'recoiling' | 'reaching' | 'held' | 'idle' | 'walking' | 'running' | 'anticipating' | 'jumping' | 'falling' | 'landing' | 'climbing' | 'hanging' | 'sitting' | 'looking' | 'startled' | 'waving' | 'sleeping';
export type Surface = { id:number; left:number; right:number; top:number; bottom:number; solid:boolean; label:string; section?:string };
export type Personality = { curiosity:number; energy:number; bravery:number; sociability:number; playfulness:number };
export type Character = {
  id:number; color:string; scale:number; personality:Personality;
  x:number; y:number; vx:number; vy:number; facing:number; state:State; timer:number; phase:number;
  platform:number|null; goal:{x:number;surface:number}|null; jump:{vx:number;vy:number}|null;
  focus?:{id:number;until:number}; stepFrom?:{x:number;y:number;targetX:number;targetY:number;surface:number}; fearUntil?:number; route?:number[]; tagRounds?:number; tagTarget?:number; tagContact?:boolean; cursorNotice?:number; sitAfterWalk?:boolean; attention?:{x:number;y:number}; intent?:{state:State;duration:number;remaining:number}; impact?:number;
  journeyUntil?:number; sectionSince?:number; lastSection?:string; recentSections?:string[]; travelDirection?:number;
  departure?:{surface:number;x:number}; ignoreSurface?:number; destination?:number; chase?:{id:number;until:number}; flee?:{id:number;until:number}; jumpStyle?:number;
  socialAt?:number; lastAction?:State; climbFrom?:{x:number;y:number;duration:number;edge?:number};
  visited:Set<number>; cooldown:number; lookX:number; grounded:boolean;
};
export type Cursor = { x:number;y:number;speed:number;active:boolean;lastMoved:number };
export type Config = {
  onCharacters?:(characters:{id:number;x:number;y:number;state:State}[])=>void;
  characters?:number; debug?:boolean;
  behavior?:Partial<{cursorAwareness:boolean;socialInteractions:boolean;climbing:boolean;rareEvents:boolean}>;
  physics?:Partial<{gravity:number;walkSpeed:number;runSpeed:number}>;
};
