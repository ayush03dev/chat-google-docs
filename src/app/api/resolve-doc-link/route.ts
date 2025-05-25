import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { chunkText, embedChunks } from '@/app/utils/chunking';
import { indexChunk } from '@/app/utils/vespa';
import pLimit from 'p-limit';

export async function POST(req: NextRequest) {
    const { link } = await req.json();
    const accessToken = req.cookies.get('access_token')?.value;

    if (!accessToken || !link) {
        return NextResponse.json({ error: 'Missing token or link' }, { status: 400 });
    }

    try {
        let content = '';
        let meta = '';

        if (link.includes('docs.google.com/document')) {
            const docId = extractId(link);
            const doc = await getGoogleDocsContent(accessToken, docId);
            content = doc.body?.content?.map(part =>
                part.paragraph?.elements?.map(el => el.textRun?.content || '').join('')
            ).join('') || '';
            meta = doc.title || '';
        } else if (link.includes('docs.google.com/spreadsheets')) {
            const sheetId = extractId(link);
            const sheet = await getGoogleSheetContent(accessToken, sheetId);
            content = JSON.stringify(sheet.values);
            meta = sheet.range || '';
        } else {
            return NextResponse.json({ error: 'Unrecognized link format' }, { status: 400 });
        }

        const chunks = chunkText(content);
        const processed = await embedChunks(chunks, link);
        const limit = pLimit(5); // max 5 concurrent requests
        await Promise.all(processed.map(chunk => limit(() => indexChunk(chunk))));
        // await Promise.all(processed.map(indexChunk));
        return NextResponse.json({ content, meta });
    } catch (error) {
        console.error('Failed to resolve link:', error);
        return NextResponse.json({ error: 'Failed to resolve link' }, { status: 500 });
    }
}

function extractId(link: string) {
    const match = link.match(/[-\w]{25,}/);
    return match ? match[0] : '';
}

async function getGoogleDocsContent(accessToken: string, documentId: string) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const docs = google.docs({ version: 'v1', auth: oauth2Client });
    const res = await docs.documents.get({ documentId });
    return res.data;
}

async function getGoogleSheetContent(accessToken: string, spreadsheetId: string) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1',
    });
    return res.data;
}
