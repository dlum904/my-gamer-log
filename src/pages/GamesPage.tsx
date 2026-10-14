import { Link, useParams, useSearchParams } from 'react-router-dom';
import GameDetail from '../components/GameDetail';
import GameListRow from '../components/GameListRow';
import { useAuth } from '../context/AuthContext';
import { useUserLists } from '../context/UserListsContext';
import { GENRES, PLATFORMS } from '../data/games';
import { useAsync } from '../hooks/useAsync';
import { getGameById, getGames, getReleaseYears } from '../services/gameService';
import type { GameListKey } from '../types/game';

const USER_VIEWS: Record<GameListKey, string> = {
  collection: 'My Collection',
  favorites: 'My Favorites',
  toPlay: 'To Play',
};

const isUserView = (view: string | null): view is GameListKey =>
  view !== null && view in USER_VIEWS;

function GameDetailView({ id }: { id: number }) {
  const { data: game, loading } = useAsync(() => getGameById(id), [id]);

  if (loading) return <p className="text-steam-muted">Loading...</p>;
  if (!game) {
    return (
      <p className="text-steam-muted">
        Game not found.{' '}
        <Link to="/games" className="text-steam-accent hover:underline">
          Browse all games
        </Link>
      </p>
    );
  }
  return <GameDetail game={game} />;
}

function FilterSelect({
  label,
  param,
  options,
}: {
  label: string;
  param: string;
  options: readonly string[];
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(param, value);
    else next.delete(param);
    setSearchParams(next);
  };

  return (
    <label className="flex items-center gap-2 text-xs uppercase text-steam-muted">
      {label}
      <select
        value={searchParams.get(param) ?? ''}
        onChange={(event) => handleChange(event.target.value)}
        className="rounded-sm bg-[#316282] px-2 py-1 text-sm normal-case text-white outline-none"
      >
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function GameListView() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { getList } = useUserLists();
  const { data: years = [] } = useAsync(getReleaseYears, []);

  const view = searchParams.get('view');
  const year = searchParams.get('year') ?? undefined;
  const platform = searchParams.get('platform') ?? undefined;
  const genre = searchParams.get('genre') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const ids = isUserView(view) ? getList(view) : undefined;

  const { data: games = [], loading } = useAsync(
    () => getGames({ year, platform, genre, search, ids }),
    [year, platform, genre, search, ids?.join(',')],
  );

  const title = isUserView(view)
    ? USER_VIEWS[view]
    : search
      ? `Results for "${search}"`
      : [year, platform, genre].filter(Boolean).join(' · ') || 'All Games';

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-light text-white">{title}</h1>

      {isUserView(view) && (
        <div className="flex gap-1 border-b border-white/10">
          {(Object.keys(USER_VIEWS) as GameListKey[]).map((key) => (
            <Link
              key={key}
              to={`/games?view=${key}`}
              className={`rounded-t-sm px-4 py-1.5 text-sm ${
                key === view
                  ? 'bg-steam-card text-white'
                  : 'text-steam-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              {USER_VIEWS[key]} ({getList(key).length})
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4 rounded-sm bg-black/20 p-3">
        <FilterSelect label="Year" param="year" options={years} />
        <FilterSelect label="Console" param="platform" options={PLATFORMS} />
        <FilterSelect label="Genre" param="genre" options={GENRES} />
      </div>

      {isUserView(view) && !user ? (
        <p className="rounded-sm bg-steam-panel/80 p-4 text-steam-muted">
          Log in to see your {USER_VIEWS[view].toLowerCase()}.
        </p>
      ) : loading ? (
        <p className="text-steam-muted">Loading...</p>
      ) : games.length === 0 ? (
        <p className="rounded-sm bg-steam-panel/80 p-4 text-steam-muted">
          {isUserView(view)
            ? 'No games here yet. Open a game page to add it to this list.'
            : 'No games match these filters.'}
        </p>
      ) : (
        <>
          <p className="text-xs text-steam-muted">{games.length} results</p>
          <div className="space-y-1">
            {games.map((game) => (
              <GameListRow key={game.id} game={game} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function GamesPage() {
  const { id } = useParams();
  return id ? <GameDetailView id={Number(id)} /> : <GameListView />;
}
