'use client';

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = '/api/auth/initiate';
  };

  return (
    <main
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #60a5fa, #4f46e5)', // blue-400 to indigo-700
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '2.5rem',
          maxWidth: '24rem',
          width: '100%',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1f2937', // gray-800
          }}
        >
          Welcome Back
        </h1>
        <p style={{ marginBottom: '2rem', color: '#4b5563' /* gray-600 */ }}>
          Sign in to your account to continue
        </p>
        <button
          onClick={handleLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            backgroundColor: '#2563eb', // blue-600
            color: 'white',
            padding: '0.75rem 1.5rem',
            fontSize: '1.25rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            border: 'none',
            margin: '0 auto'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8'; // blue-700
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb'; // blue-600
          }}
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
