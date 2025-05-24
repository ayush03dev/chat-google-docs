'use client';

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = '/api/auth/initiate';
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-700 px-4">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-10 max-w-sm w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome Back</h1>
        <p className="mb-8 text-gray-600">Sign in to your account to continue</p>
        <button
          onClick={handleLogin}
          className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white px-6 py-3 rounded-lg text-xl transition"
        >
          <span className="text-2xl">🟢</span> {/* simple emoji as icon */}
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
