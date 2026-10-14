export interface Game {
  id: number;
  name: string;
  summary: string;
  coverUrl?: string;
  releaseDate: string;
  platforms: string[];
  genres: string[];
  rating: number;
  developer: string;
  publisher: string;
}

export interface Comment {
  id: string;
  gameId: number;
  username: string;
  text: string;
  createdAt: string;
}

export interface User {
  username: string;
  email: string;
}

export type GameListKey = 'favorites' | 'collection' | 'toPlay';
