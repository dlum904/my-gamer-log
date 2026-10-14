import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

export type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
}

const inputClass =
  'w-full rounded-sm bg-[#32353c] px-3 py-2 text-white outline-none focus:ring-1 focus:ring-steam-accent';

export default function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (mode === 'login') login(username, password);
    else signup(username, email, password);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm space-y-4 rounded-sm bg-steam-header p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-light uppercase tracking-wide text-white">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>

        <label className="block space-y-1">
          <span className="text-xs font-bold uppercase text-steam-accent">Username</span>
          <input
            required
            className={inputClass}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>

        {mode === 'signup' && (
          <label className="block space-y-1">
            <span className="text-xs font-bold uppercase text-steam-accent">Email</span>
            <input
              required
              type="email"
              className={inputClass}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        )}

        <label className="block space-y-1">
          <span className="text-xs font-bold uppercase text-steam-muted">Password</span>
          <input
            required
            type="password"
            className={inputClass}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-sm bg-gradient-to-r from-[#06bfff] to-[#2d73ff] py-2.5 font-medium text-white hover:brightness-110"
        >
          {mode === 'login' ? 'Sign in' : 'Sign up'}
        </button>

        <p className="text-center text-sm text-steam-muted">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className="text-white underline hover:text-steam-accent"
            onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </form>
    </div>
  );
}
