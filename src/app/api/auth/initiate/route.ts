// app/api/auth/initiate/route.ts
import { NextRequest } from 'next/server';
import { google } from 'googleapis';

export async function GET(req: NextRequest) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.NEXTAUTH_URL}/api/auth/callback`
    );

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: (process.env.GOOGLE_SCOPES || '').split(','),
        prompt: 'consent'
    });

    return Response.redirect(url);
}
