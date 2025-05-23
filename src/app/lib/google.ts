import { google } from 'googleapis';

export async function getGoogleDocsContent(accessToken: string, documentId: string) {
    const docs = google.docs({ version: 'v1', auth: accessToken });
    const res = await docs.documents.get({ documentId });
    return res.data;
}

export async function getGoogleSheetContent(accessToken: string, spreadsheetId: string, range = 'Sheet1') {
    const sheets = google.sheets({ version: 'v4', auth: accessToken });
    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    return res.data;
}
