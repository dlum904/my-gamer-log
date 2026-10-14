import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import HeroCarousel from '../components/HeroCarousel';
import { PLATFORMS } from '../data/games';
import { useAsync } from '../hooks/useAsync';
import { getPopularGames, getRandomGames } from '../services/gameService';

function PopularOnPlatform({ platform }: { platform: string }) {
  const { data: games = [] } = useAsync(() => getPopularGames(4, platform), [platform]);

  return (
    <section>
      <div className="mb-2 flex items-end justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wider text-white">
          Popular on {platform}
        </h2>
        <Link
          to={`/games?platform=${encodeURIComponent(platform)}`}
          className="rounded-sm border border-white/20 px-3 py-0.5 text-xs text-white hover:border-steam-accent hover:text-steam-accent"
        >
          See more
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { data: featured = [] } = useAsync(() => getRandomGames(6), []);

  return (
    <div className="space-y-8">
      <HeroCarousel games={featured} />
      {PLATFORMS.map((platform) => (
        <PopularOnPlatform key={platform} platform={platform} />
      ))}
    </div>
  );
}
