'use client';
import { useEffect, useState } from 'react';

export default function WelcomePage() {
    const [name, setName] = useState('User');
    const [link, setLink] = useState('');

    useEffect(() => {
        const cookieName = document.cookie
            .split('; ')
            .find(row => row.startsWith('user_name='))
            ?.split('=')[1];

        if (cookieName) {
            setName(decodeURIComponent(decodeURIComponent(cookieName)));
        }
    }, []);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        fetch('/api/resolve-doc-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ link }),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            });
    }

    return (
        <main className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Welcome, {name}!</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Paste Google Doc/Sheet link"
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
                    Proceed to Chat
                </button>
            </form>
        </main>
    );
}
