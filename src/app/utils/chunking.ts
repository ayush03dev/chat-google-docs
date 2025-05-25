import { embedText } from "./embedding";

export interface Chunk {
    id: string;
    text: string;
    semanticVector: number[];
    sourceUrl: string;
}

export function chunkText(text: string, chunkSize = 500, overlap = 100): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize - overlap) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
}

export async function embedChunks(textChunks: string[], sourceUrl: string): Promise<Chunk[]> {
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
