import { Link } from 'react-router-dom';
import type { Game } from '../types/game';
import GameCover from './GameCover';

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link
      to={`/games/${game.id}`}
      className="group block overflow-hidden rounded-sm bg-steam-panel shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_10px_rgba(102,192,244,0.35)]"
    >
      <GameCover game={game} className="aspect-[460/215] w-full" />
      <div className="flex items-center justify-between px-2 py-1.5 text-xs">
        <span className="truncate text-steam-muted group-hover:text-white">
          {game.genres.join(', ')}
        </span>
        {game.rating > 0 && (
          <span className="ml-2 shrink-0 rounded-sm bg-steam-green px-1.5 py-0.5 font-bold text-steam-green-light">
            {game.rating}
          </span>
        )}
      </div>
    </Link>
  );
}
