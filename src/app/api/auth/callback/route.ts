// app/api/auth/callback/route.ts
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.NEXTAUTH_URL}/api/auth/callback`
    );

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const idPayload = tokens.id_token
            ? JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString())
            : { name: 'User' };

        const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/welcome`);

        response.cookies.set('access_token', tokens.access_token || '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        response.cookies.set('user_name', encodeURIComponent(idPayload.name || 'User'), {
            httpOnly: false,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('OAuth Callback Error:', error);
        return NextResponse.json({ error: 'OAuth failed' }, { status: 500 });
    }
}
