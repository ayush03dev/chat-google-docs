'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
    const [name, setName] = useState('User');
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false); // spinner state
    const router = useRouter();

    useEffect(() => {
        const cookieName = document.cookie
            .split('; ')
            .find(row => row.startsWith('user_name='))
            ?.split('=')[1];

        if (cookieName) {
            setName(decodeURIComponent(decodeURIComponent(cookieName)));
        }
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); // start spinner
        try {
            const res = await fetch('/api/resolve-doc-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ link }),
            });
            const data = await res.json();
            console.log(data);
            sessionStorage.setItem('sourceUrl', link);
            router.push('/chat');
        } catch (error) {
            console.error('Error resolving link:', error);
        } finally {
            setLoading(false); // stop spinner
        }
    }

    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                background: 'linear-gradient(to bottom right, #60a5fa, #4338ca)',
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                    padding: '2.5rem',
                    maxWidth: '400px',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                    Welcome, {name}!
                </h1>
                <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>
                    Paste your Google Doc or Sheet link to get started
                </p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Paste link here"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            outline: 'none',
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            backgroundColor: loading ? '#9ca3af' : '#16a34a',
                            color: 'white',
                            padding: '0.75rem',
                            fontSize: '1.125rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s ease',
                        }}
                        onMouseOver={e => {
                            if (!loading) e.currentTarget.style.backgroundColor = '#15803d';
                        }}
                        onMouseOut={e => {
                            if (!loading) e.currentTarget.style.backgroundColor = '#16a34a';
                        }}
                    >
                        {loading ? '⏳ Resolving...' : '🚀 Proceed to Chat'}
                    </button>
                </form>
            </div>
        </main>
    );
}
