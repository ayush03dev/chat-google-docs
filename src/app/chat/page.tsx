import { useState, useEffect, useRef } from 'react';

type Message = {
    id: number;
    sender: 'user' | 'bot';
    text: string;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll chat to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function handleSend() {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: messages.length,
            sender: 'user',
            text: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // 1. Search relevant docs from Vespa
            const searchRes = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMessage.text })
            });
            const searchData = await searchRes.json();

            // Extract texts from docs
            const contextText = searchData.docs.map((doc: any) => doc.text).join('\n\n');

            // 2. Call LLM API with user query + context
            const genRes = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMessage.text, context: contextText })
            });
            const genData = await genRes.json();

            const botMessage: Message = {
                id: messages.length + 1,
                sender: 'bot',
                text: genData.answer || 'Sorry, I could not find an answer.'
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            console.error(err);
            const errorMessage: Message = {
                id: messages.length + 1,
                sender: 'bot',
                text: 'Oops! Something went wrong.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto', display: 'flex', flexDirection: 'column', height: '80vh', border: '1px solid #ccc', borderRadius: 8 }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                {messages.map(m => (
                    <div key={m.id} style={{ marginBottom: 12, textAlign: m.sender === 'user' ? 'right' : 'left' }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '8px 12px',
                            borderRadius: 16,
                            backgroundColor: m.sender === 'user' ? '#0070f3' : '#eaeaea',
                            color: m.sender === 'user' ? '#fff' : '#000',
                            maxWidth: '80%',
                            whiteSpace: 'pre-wrap',
                        }}>
                            {m.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ borderTop: '1px solid #ccc', padding: 12 }}>
                <textarea
                    rows={2}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    style={{ width: '100%', resize: 'none', padding: 8, borderRadius: 4, fontSize: 16 }}
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    style={{ marginTop: 8, padding: '10px 20px', fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? 'Thinking...' : 'Send'}
                </button>
            </div>
        </div>
    );
}
