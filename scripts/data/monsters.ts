export type PF2eTraits = 'humanoid' | 'mutant' | 'serpentfolk' | 'evil' | 'chaotic' | 'fey' | 'gremlin' | 'animal';

export const monsters = [
  { name: 'Cinder Rat', additionalTraits: ['rat', 'fire', 'flaming'] },
  { name: 'Slurk', additionalTraits: ['frog'] },
  { name: 'Giant Fly', additionalTraits: ['insect', 'fly'] },
  { name: 'Flickerwisp', additionalTraits: ['wisp'] },
  { name: 'Web Lurker', additionalTraits: ['insect', 'spider'] },
];
export default monsters;
