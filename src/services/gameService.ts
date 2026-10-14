import { games } from '../data/games';
import type { Game } from '../types/game';

// Every function is async so the hardcoded data can be swapped for
// IGDB / Django API calls without changing any callers.

const today = () => new Date().toISOString().slice(0, 10);

const isReleased = (game: Game) => game.releaseDate <= today();

export interface GameFilters {
  year?: string;
  platform?: string;
  genre?: string;
  search?: string;
  ids?: number[];
}

export async function getGames(filters: GameFilters = {}): Promise<Game[]> {
  const search = filters.search?.toLowerCase();
  return games.filter(
    (game) =>
      (!filters.year || game.releaseDate.startsWith(filters.year)) &&
      (!filters.platform || game.platforms.includes(filters.platform)) &&
      (!filters.genre || game.genres.includes(filters.genre)) &&
      (!search || game.name.toLowerCase().includes(search)) &&
      (!filters.ids || filters.ids.includes(game.id)),
  );
}

export async function getGameById(id: number): Promise<Game | undefined> {
  return games.find((game) => game.id === id);
}

export async function getPopularGames(limit = 10, platform?: string): Promise<Game[]> {
  return games
    .filter((game) => isReleased(game) && (!platform || game.platforms.includes(platform)))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export async function getUpcomingGames(limit = 10): Promise<Game[]> {
  return games
    .filter((game) => !isReleased(game))
    .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))
    .slice(0, limit);
}

export async function getRandomGames(count: number): Promise<Game[]> {
  return [...games].sort(() => Math.random() - 0.5).slice(0, count);
}

export async function getRandomGame(): Promise<Game> {
  return games[Math.floor(Math.random() * games.length)];
}

export async function getReleaseYears(): Promise<string[]> {
  const years = new Set(games.map((game) => game.releaseDate.slice(0, 4)));
  return [...years].sort((a, b) => b.localeCompare(a));
}
