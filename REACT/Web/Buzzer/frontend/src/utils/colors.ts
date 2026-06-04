export const PLAYER_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-cyan-500',
  'bg-teal-500',
  'bg-lime-500',
  'bg-orange-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-fuchsia-500',
];

export const MASTER_COLOR = 'bg-master-badge'; // amber-400 from theme

export function getPlayerColor(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

export function getRandomColor(): string {
  return PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
}
