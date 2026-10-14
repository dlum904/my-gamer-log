import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { UserListsProvider } from './context/UserListsContext';
import GamesPage from './pages/GamesPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <AuthProvider>
      <UserListsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/:id" element={<GamesPage />} />
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserListsProvider>
    </AuthProvider>
  );
}
