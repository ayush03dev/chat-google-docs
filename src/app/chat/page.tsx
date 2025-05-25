'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatPage() {
    const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedUrl = sessionStorage.getItem('sourceUrl');
        if (savedUrl) setSourceUrl(savedUrl);
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        const botReply = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input, sourceUrl }),
        })
            .then(res => res.json())
            .then(data => data.reply || 'Sorry, something went wrong.')
            .catch(() => 'Error reaching the LLM.');

        setMessages(prev => [...prev, { role: 'bot', content: botReply }]);
        setLoading(false);
    };

    // Auto-scroll to bottom when new message arrives or loading changes
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, loading]);

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
                    padding: '2rem',
                    maxWidth: '500px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }}>
                    💬 Chat Assistant
                </h1>

                {sourceUrl && (
                    <>
                        <a
                            href={sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'block',
                                textAlign: 'center',
                                marginBottom: '0.5rem',
                                color: '#2563eb',
                                textDecoration: 'underline',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                userSelect: 'none',
                                transition: 'color 0.2s ease',
                            }}
                            onMouseOver={e => (e.currentTarget.style.color = '#1d4ed8')}
                            onMouseOut={e => (e.currentTarget.style.color = '#2563eb')}
                        >
                            Click Here to Open Source Document
                        </a>

                        <a
                            onClick={() => (window.location.href = '/welcome')}
                            style={{
                                display: 'block',
                                textAlign: 'center',
                                marginBottom: '0.5rem',
                                color: '#2563eb',
                                textDecoration: 'underline',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                userSelect: 'none',
                                transition: 'color 0.2s ease',
                            }}
                            disabled={loading}
                        >
                            Use Different Google Doc
                        </a>
                    </>
                )}

                <div
                    ref={scrollRef}
                    style={{
                        height: '300px',
                        overflowY: 'auto',
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        fontSize: '1rem',
                    }}
                >
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.role === 'user' ? '#3b82f6' : '#e5e7eb',
                                color: msg.role === 'user' ? '#fff' : '#111827',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.75rem',
                                maxWidth: '80%',
                                fontStyle: msg.role === 'bot' && loading && index === messages.length - 1 ? 'italic' : 'normal',
                                opacity: msg.role === 'bot' && loading && index === messages.length - 1 ? 0.7 : 1,
                            }}
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                    ))}
                    {loading && (
                        <div
                            style={{
                                alignSelf: 'flex-start',
                                backgroundColor: '#e5e7eb',
                                color: '#111827',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.75rem',
                                maxWidth: '80%',
                                fontStyle: 'italic',
                                opacity: 0.7,
                            }}
                        >
                            Waiting for response...
                        </div>
                    )}
                </div>

                <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={loading}
                        style={{
                            flex: '1',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #d1d5db',
                            fontSize: '1rem',
                            outline: 'none',
                            backgroundColor: loading ? '#f3f4f6' : 'white',
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? '#4ade80' : '#16a34a',
                            color: '#fff',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={e => !loading && (e.currentTarget.style.backgroundColor = '#15803d')}
                        onMouseOut={e => !loading && (e.currentTarget.style.backgroundColor = '#16a34a')}
                    >
                        Send
                    </button>
                </form>
            </div>
        </main>
    );
}
