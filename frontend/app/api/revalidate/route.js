import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

// Deploy-triggered content refresh: the backend deploy workflow POSTs here
// after Flyway seed migrations land, regenerating every content page at once.
// Pages also carry revalidate: 3600 as the safety net if this ping is missed.
export async function POST(request) {
    const secret = request.headers.get('x-revalidate-secret');
    if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ revalidated: false }, { status: 401 });
    }
    revalidateTag('content');
    return NextResponse.json({ revalidated: true });
}
