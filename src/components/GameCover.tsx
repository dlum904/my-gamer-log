import type { Game } from '../types/game';

interface GameCoverProps {
  game: Game;
  className?: string;
  showTitle?: boolean;
}

export default function GameCover({ game, className = '', showTitle = true }: GameCoverProps) {
  if (game.coverUrl) {
    return <img src={game.coverUrl} alt={game.name} className={`object-cover ${className}`} />;
  }

  const hue = (game.id * 47) % 360;
  return (
    <div
      role="img"
      aria-label={game.name}
      className={`relative flex items-end overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 55% 35%) 0%, hsl(${(hue + 40) % 360} 60% 18%) 100%)`,
      }}
    >
      <div
        className="absolute -right-6 -top-6 h-2/3 aspect-square rounded-full opacity-20"
        style={{ background: `hsl(${(hue + 180) % 360} 70% 60%)` }}
      />
      {showTitle && (
        <span className="relative z-10 w-full bg-gradient-to-t from-black/70 to-transparent p-2 text-sm font-bold uppercase tracking-wide text-white drop-shadow">
          {game.name}
        </span>
      )}
    </div>
  );
}
