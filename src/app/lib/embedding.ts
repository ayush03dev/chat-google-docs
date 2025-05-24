// lib/embedding.ts
import { pipeline } from '@xenova/transformers';

// Load only once
let embedder: any;
async function loadEmbedder() {
    if (!embedder) {
        embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return embedder;
}

export async function embedText(text: string): Promise<number[]> {
    const embedder = await loadEmbedder();
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

export interface Chunk {
    id: string;
    text: string;
    semanticVector: number[];
    sourceUrl: string;
}

export async function processChunks(textChunks: string[], sourceUrl: string): Promise<Chunk[]> {
    const processedChunks: Chunk[] = [];

    for (let i = 0; i < textChunks.length; i++) {
        const chunkText = textChunks[i];
        const semanticVector = await embedText(chunkText);

        processedChunks.push({
            id: `chunk-${i}`,
            text: chunkText,
            semanticVector,
            sourceUrl
        });
    }

    return processedChunks;
}