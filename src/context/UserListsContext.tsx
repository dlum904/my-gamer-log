import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Comment, GameListKey } from '../types/game';
import { useAuth } from './AuthContext';

// Placeholder persistence: lists and comments live in localStorage until
// the Django REST endpoints exist.

type ListsByUser = Record<string, Record<GameListKey, number[]>>;

const emptyLists = (): Record<GameListKey, number[]> => ({
  favorites: [],
  collection: [],
  toPlay: [],
});

interface UserListsContextValue {
  getList: (list: GameListKey) => number[];
  isInList: (list: GameListKey, gameId: number) => boolean;
  toggleInList: (list: GameListKey, gameId: number) => void;
  getComments: (gameId: number) => Comment[];
  addComment: (gameId: number, text: string) => void;
  deleteComment: (commentId: string) => void;
}

const UserListsContext = createContext<UserListsContextValue | null>(null);

export function UserListsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [lists, setLists] = useLocalStorage<ListsByUser>('mgl:lists', {});
  const [comments, setComments] = useLocalStorage<Comment[]>('mgl:comments', []);

  const userLists = (user && lists[user.username]) || emptyLists();

  const getList = (list: GameListKey) => userLists[list];

  const isInList = (list: GameListKey, gameId: number) => userLists[list].includes(gameId);

  const toggleInList = (list: GameListKey, gameId: number) => {
    if (!user) return;
    const current = userLists[list];
    const updated = current.includes(gameId)
      ? current.filter((id) => id !== gameId)
      : [...current, gameId];
    setLists({ ...lists, [user.username]: { ...userLists, [list]: updated } });
  };

  const getComments = (gameId: number) =>
    comments
      .filter((comment) => comment.gameId === gameId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const addComment = (gameId: number, text: string) => {
    if (!user) return;
    setComments([
      ...comments,
      {
        id: crypto.randomUUID(),
        gameId,
        username: user.username,
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const deleteComment = (commentId: string) =>
    setComments(comments.filter((comment) => comment.id !== commentId));

  return (
    <UserListsContext.Provider
      value={{ getList, isInList, toggleInList, getComments, addComment, deleteComment }}
    >
      {children}
    </UserListsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUserLists() {
  const context = useContext(UserListsContext);
  if (!context) throw new Error('useUserLists must be used within UserListsProvider');
  return context;
}
