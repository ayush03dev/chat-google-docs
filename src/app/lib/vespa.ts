import { embedText } from "./embedding";
import { Chunk } from "./chunking";

const VESPA_ENDPOINT = `${process.env.VESPA_URL}/document/v1/doc/doc/docid/`;

export async function indexChunk(chunk: Chunk): Promise<void> {
    await fetch(`${VESPA_ENDPOINT}${chunk.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fields: {
                id: chunk.id,
                text: chunk.text,
                semanticVector: chunk.semanticVector,
                keywords: chunk.text.split(/\s+/).slice(0, 5),
                sourceUrl: chunk.sourceUrl
            }
        })
    });
}

export async function hybridSearch(query: string, sourceUrl: string): Promise<string> {
    const queryVector = await embedText(query);
    const keywords = query.toLowerCase().split(/\s+/).slice(0, 5);
    const res = await fetch(`${process.env.VESPA_URL}/search/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            yql: `select * from sources * where sourceUrl contains ("${sourceUrl}") and ({"targetNumHits":5}nearestNeighbor(semanticVector, queryVector) or (keywords contains "${keywords.join(' ')}"))`,
            ranking: {
                profile: 'hybrid',
                features: {
                    'query(queryVector)': {
                        values: queryVector
                    }
                }
            },
            input: {
                'query(queryVector)': {
                    values: queryVector
                }
            },
            hits: 5
        })
    });

    const result = await res.json();
    const combinedText = result.root.children
        .map(child => child.fields?.text || "")
        .filter(text => text.length > 0)
        .join(" ");
    return combinedText || "";
}
