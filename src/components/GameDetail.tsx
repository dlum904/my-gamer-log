import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserLists } from '../context/UserListsContext';
import type { Game, GameListKey } from '../types/game';
import { formatDate } from '../utils/format';
import CommentSection from './CommentSection';
import GameCover from './GameCover';

const LIST_ACTIONS: { list: GameListKey; add: string; remove: string }[] = [
  { list: 'favorites', add: '♡ Favorite', remove: '♥ Favorited' },
  { list: 'collection', add: '+ Add to Collection', remove: '✓ In Collection' },
  { list: 'toPlay', add: '+ Add to To Play', remove: '✓ On To Play List' },
];

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-2 text-xs">
      <span className="w-28 shrink-0 uppercase text-steam-muted">{label}</span>
      <span className="text-steam-accent">{children}</span>
    </div>
  );
}

export default function GameDetail({ game }: { game: Game }) {
  const { user } = useAuth();
  const { isInList, toggleInList } = useUserLists();

  return (
    <article className="space-y-6">
      <div>
        <p className="text-xs text-steam-muted">
          <Link to="/games" className="hover:text-white">
            All Games
          </Link>{' '}
          &gt;{' '}
          <Link
            to={`/games?genre=${encodeURIComponent(game.genres[0])}`}
            className="hover:text-white"
          >
            {game.genres[0]}
          </Link>{' '}
          &gt; {game.name}
        </p>
        <h1 className="mt-1 text-3xl font-light text-white">{game.name}</h1>
      </div>

      <div className="flex flex-col gap-4 bg-black/20 p-4 md:flex-row">
        <GameCover game={game} showTitle={false} className="aspect-video w-full rounded-sm md:w-3/5" />
        <div className="space-y-3 md:w-2/5">
          <GameCover game={game} className="aspect-[460/215] w-full rounded-sm" />
          <p className="text-sm text-steam-text">{game.summary}</p>
          <div className="space-y-1.5">
            <InfoRow label="Rating">{game.rating > 0 ? `${game.rating} / 100` : 'Not yet rated'}</InfoRow>
            <InfoRow label="Release Date">{formatDate(game.releaseDate)}</InfoRow>
            <InfoRow label="Developer">{game.developer}</InfoRow>
            <InfoRow label="Publisher">{game.publisher}</InfoRow>
          </div>
          <div className="flex flex-wrap gap-1">
            {game.genres.map((genre) => (
              <Link
                key={genre}
                to={`/games?genre=${encodeURIComponent(genre)}`}
                className="rounded-sm bg-steam-accent/20 px-2 py-0.5 text-xs text-steam-accent hover:bg-steam-accent hover:text-white"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm bg-gradient-to-r from-[#3d6c8d]/60 to-[#2a475e]/40 p-4">
        <div className="text-sm">
          <p className="text-white">Available on</p>
          <p className="text-xs text-steam-muted">{game.platforms.join(' · ')}</p>
        </div>
        {user ? (
          <div className="flex flex-wrap gap-2">
            {LIST_ACTIONS.map(({ list, add, remove }) => {
              const active = isInList(list, game.id);
              return (
                <button
                  key={list}
                  type="button"
                  onClick={() => toggleInList(list, game.id)}
                  className={`rounded-sm px-3 py-1.5 text-sm transition ${
                    active
                      ? 'bg-gradient-to-r from-[#75b022] to-[#588a1b] text-white'
                      : 'bg-steam-accent/20 text-steam-accent hover:bg-steam-accent hover:text-white'
                  }`}
                >
                  {active ? remove : add}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-steam-muted">
            Log in to add this game to your favorites, collection or to-play list.
          </p>
        )}
      </div>

      <CommentSection gameId={game.id} />
    </article>
  );
}
