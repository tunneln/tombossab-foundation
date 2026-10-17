import { createHash, timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

// Hashing first gives timingSafeEqual the equal-length buffers it requires,
// so the comparison takes the same time however much of the secret matches.
const digest = (value) => createHash('sha256').update(value).digest();

// Deploy-triggered content refresh: the backend deploy workflow POSTs here
// after Flyway seed migrations land, regenerating every content page at once.
// Pages also carry revalidate: 3600 as the safety net if this ping is missed.
export async function POST(request) {
    const expected = process.env.REVALIDATE_SECRET;
    const secret = request.headers.get('x-revalidate-secret') ?? '';
    if (!expected || !timingSafeEqual(digest(secret), digest(expected))) {
        return NextResponse.json({ revalidated: false }, { status: 401 });
    }
    revalidateTag('content');
    return NextResponse.json({ revalidated: true });
}
