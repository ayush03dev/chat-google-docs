import { callAI } from '@/app/lib/llm';
import { hybridSearch } from '@/app/lib/vespa';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { message, sourceUrl } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { reply: 'Invalid or missing message' },
                { status: 400 }
            );
        }
        const context = await hybridSearch(message, sourceUrl);
        const aiResponse = await callAI(context, message);

        return NextResponse.json({ reply: aiResponse }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { reply: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
