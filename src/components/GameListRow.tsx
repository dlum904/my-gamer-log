import { Link } from 'react-router-dom';
import type { Game } from '../types/game';
import { formatDate } from '../utils/format';
import GameCover from './GameCover';

export default function GameListRow({ game }: { game: Game }) {
  return (
    <Link
      to={`/games/${game.id}`}
      className="flex items-center gap-3 rounded-sm bg-steam-panel/70 p-1.5 transition-colors hover:bg-steam-hover/70"
    >
      <GameCover game={game} showTitle={false} className="h-[54px] w-[120px] shrink-0 rounded-sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-white">{game.name}</p>
        <p className="truncate text-xs text-steam-muted">{game.platforms.join(' · ')}</p>
      </div>
      <p className="hidden w-32 text-xs text-steam-muted sm:block">{game.genres.join(', ')}</p>
      <p className="w-24 text-xs text-steam-muted">{formatDate(game.releaseDate)}</p>
      <span className="w-12 pr-2 text-right">
        {game.rating > 0 ? (
          <span className="rounded-sm bg-steam-green px-1.5 py-0.5 text-xs font-bold text-steam-green-light">
            {game.rating}
          </span>
        ) : (
          <span className="text-xs text-steam-muted">TBA</span>
        )}
      </span>
    </Link>
  );
}
