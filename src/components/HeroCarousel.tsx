import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Game } from '../types/game';
import { formatDate } from '../utils/format';
import GameCover from './GameCover';

const INTERVAL_MS = 5000;

export default function HeroCarousel({ games }: { games: Game[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (games.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % games.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [games.length, index]);

  if (games.length === 0) return null;

  const game = games[index];
  const step = (delta: number) => setIndex((i) => (i + delta + games.length) % games.length);

  return (
    <section>
      <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-white">
        Featured &amp; Recommended
      </h2>
      <div className="relative">
        <Link
          to={`/games/${game.id}`}
          className="flex overflow-hidden rounded-sm shadow-[0_0_10px_rgba(0,0,0,0.6)] transition-shadow hover:shadow-[0_0_14px_rgba(102,192,244,0.4)]"
        >
          <GameCover
            key={game.id}
            game={game}
            showTitle={false}
            className="aspect-video w-2/3 shrink-0"
          />
          <div className="flex w-1/3 flex-col bg-gradient-to-b from-[#0e1c25] to-[#14202b] p-4">
            <h3 className="text-2xl font-light text-white">{game.name}</h3>
            <p className="mt-3 line-clamp-5 text-sm text-steam-text">{game.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {game.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-sm bg-white/10 px-2 py-0.5 text-xs text-steam-text"
                >
                  {genre}
                </span>
              ))}
            </div>
            <div className="mt-auto space-y-1 text-xs text-steam-muted">
              <p>{game.platforms.join(' · ')}</p>
              <p>Release: {formatDate(game.releaseDate)}</p>
            </div>
          </div>
        </Link>

        <button
          type="button"
          aria-label="Previous"
          onClick={() => step(-1)}
          className="absolute left-0 top-1/2 flex h-24 w-8 -translate-y-1/2 items-center justify-center rounded-r-sm bg-black/40 text-3xl text-white hover:bg-steam-accent/50"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => step(1)}
          className="absolute right-0 top-1/2 flex h-24 w-8 -translate-y-1/2 items-center justify-center rounded-l-sm bg-black/40 text-3xl text-white hover:bg-steam-accent/50"
        >
          ›
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {games.map((g, i) => (
          <button
            key={g.id}
            type="button"
            aria-label={`Show ${g.name}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-4 rounded-sm transition-colors ${
              i === index ? 'bg-steam-text' : 'bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
