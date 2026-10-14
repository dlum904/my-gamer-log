import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GENRES, PLATFORMS } from '../data/games';
import { useAsync } from '../hooks/useAsync';
import { getRandomGame, getReleaseYears } from '../services/gameService';
import AuthModal, { type AuthMode } from './AuthModal';

const navLinkClass = (isActive: boolean) =>
  `whitespace-nowrap px-3 py-2 text-sm font-medium uppercase tracking-wider transition-colors hover:text-white ${
    isActive ? 'text-steam-accent' : 'text-steam-text'
  }`;

function DropdownColumn({
  title,
  param,
  options,
}: {
  title: string;
  param: string;
  options: readonly string[];
}) {
  return (
    <div className="min-w-36">
      <h4 className="mb-2 border-b border-white/10 pb-1 text-xs font-bold uppercase text-steam-muted">
        {title}
      </h4>
      <ul className="space-y-0.5">
        {options.map((option) => (
          <li key={option}>
            <Link
              to={`/games?${param}=${encodeURIComponent(option)}`}
              className="block rounded-sm px-2 py-1 text-sm text-steam-text hover:bg-steam-accent/20 hover:text-white"
            >
              {option}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [search, setSearch] = useState('');
  const { data: years = [] } = useAsync(getReleaseYears, []);

  const goToRandomGame = async () => {
    const game = await getRandomGame();
    navigate(`/games/${game.id}`);
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/games?search=${encodeURIComponent(query)}` : '/games');
  };

  return (
    <header className="sticky top-0 z-40 shadow-lg">
      <div className="bg-steam-header">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
          <Link to="/" className="flex items-center gap-2 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-steam-accent to-[#2d73ff] text-sm font-black">
              GL
            </span>
            <span className="hidden whitespace-nowrap text-lg font-bold uppercase tracking-widest lg:inline">
              My Gamer Log
            </span>
          </Link>

          <nav className="flex items-center">
            <div className="group relative">
              <Link
                to="/games"
                className={navLinkClass(location.pathname.startsWith('/games') && !view)}
              >
                Games ▾
              </Link>
              <div className="invisible absolute left-0 top-full flex gap-6 rounded-sm bg-[#3d4450] p-4 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:opacity-100">
                <DropdownColumn title="By Year" param="year" options={years} />
                <DropdownColumn title="By Console" param="platform" options={PLATFORMS} />
                <DropdownColumn title="By Genre" param="genre" options={GENRES} />
              </div>
            </div>
            <Link to="/games?view=collection" className={navLinkClass(view === 'collection')}>
              My Collection
            </Link>
            <Link to="/games?view=favorites" className={navLinkClass(view === 'favorites')}>
              My Favorites
            </Link>
            <button
              type="button"
              onClick={goToRandomGame}
              className="whitespace-nowrap px-3 py-2 text-sm font-medium uppercase tracking-wider text-steam-text hover:text-white"
            >
              Random Game
            </button>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-3 whitespace-nowrap text-xs">
            {user ? (
              <>
                <span className="text-steam-muted">
                  Signed in as <span className="font-bold text-steam-accent">{user.username}</span>
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-steam-text hover:text-white"
                >
                  logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-steam-text hover:text-white"
                >
                  login
                </button>
                <span className="text-steam-muted">|</span>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="rounded-sm bg-steam-green px-3 py-1.5 text-white hover:bg-steam-green-light hover:text-black"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#3e6a8a]/90 via-[#2e5374]/90 to-[#1f3a52]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5">
          <div className="flex gap-4 text-sm">
            <Link to="/" className="hover:text-white">
              Your Store
            </Link>
            <Link to="/games" className="hover:text-white">
              Browse All
            </Link>
            <Link to="/games?view=toPlay" className="hover:text-white">
              To Play
            </Link>
          </div>
          <form onSubmit={handleSearch}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="search"
              className="w-56 rounded-sm bg-[#316282] px-3 py-1 text-sm text-white placeholder:italic placeholder:text-steam-accent/70 outline-none focus:bg-[#3f7aa0]"
            />
          </form>
        </div>
      </div>

      {authMode && (
        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSwitchMode={setAuthMode} />
      )}
    </header>
  );
}
