"use client";

import { useEffect, useState } from 'react';
import { registerUser, loginUser, logoutUser, onAuthChange } from '../../lib/auth';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUserEmail(user ? user.email ?? null : null);
    });
    return () => unsubscribe();
  }, []);

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    try {
      await registerUser(email, password);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginUser(email, password);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setError(null);
    setLoading(true);
    try {
      await logoutUser();
      setEmail('');
      setPassword('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Authentication</h1>

      <div className="mb-4 text-sm">
        <span className="font-medium">Status:</span>{' '}
        {userEmail ? (
          <span className="text-green-700">Signed in as {userEmail}</span>
        ) : (
          <span className="text-gray-600">Not signed in</span>
        )}
      </div>

      <div className="space-y-3">
        <input
          type="email"
          className="w-full rounded border px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full rounded border px-3 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          onClick={handleRegister}
          disabled={loading}
        >
          Register
        </button>
        <button
          className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
          onClick={handleLogin}
          disabled={loading}
        >
          Login
        </button>
        <button
          className="rounded bg-gray-700 px-4 py-2 text-white disabled:opacity-50"
          onClick={handleLogout}
          disabled={loading}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
