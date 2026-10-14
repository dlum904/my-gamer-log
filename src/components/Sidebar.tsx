import { Link } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { getPopularGames, getUpcomingGames } from '../services/gameService';
import type { Game } from '../types/game';
import { formatDate } from '../utils/format';
import GameCover from './GameCover';

function SidebarList({
  title,
  games,
  detail,
}: {
  title: string;
  games: Game[];
  detail: (game: Game) => string;
}) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-white">{title}</h3>
      <ol className="space-y-1">
        {games.map((game, index) => (
          <li key={game.id}>
            <Link
              to={`/games/${game.id}`}
              className="flex items-center gap-2 rounded-sm bg-steam-panel/60 p-1.5 transition-colors hover:bg-steam-hover"
            >
              <span className="w-5 text-center text-xs font-bold text-steam-muted">
                {index + 1}
              </span>
              <GameCover game={game} showTitle={false} className="h-8 w-14 shrink-0 rounded-sm" />
              <div className="min-w-0">
                <p className="truncate text-sm text-white">{game.name}</p>
                <p className="text-xs text-steam-muted">{detail(game)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function Sidebar() {
  const { data: popular = [] } = useAsync(() => getPopularGames(10), []);
  const { data: upcoming = [] } = useAsync(() => getUpcomingGames(10), []);

  return (
    <aside className="w-full space-y-6 lg:w-72 lg:shrink-0">
      <SidebarList
        title="Top 10 Popular"
        games={popular}
        detail={(game) => `Rating ${game.rating}`}
      />
      <SidebarList
        title="Top 10 Upcoming"
        games={upcoming}
        detail={(game) => formatDate(game.releaseDate)}
      />
    </aside>
  );
}
