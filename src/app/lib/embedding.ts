import { pipeline } from '@xenova/transformers';

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
