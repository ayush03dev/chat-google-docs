'use client';

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = '/api/auth/initiate';
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded text-xl"
      >
        Sign in with Google
      </button>
    </main>
  );
}
