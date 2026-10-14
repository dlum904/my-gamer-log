import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row">
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
        <Sidebar />
      </div>
      <footer className="bg-steam-header py-6 text-center text-xs text-steam-muted">
        My Gamer Log &middot; Game data is placeholder content
      </footer>
    </div>
  );
}
