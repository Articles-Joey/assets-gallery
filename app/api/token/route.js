import { cookies } from 'next/headers';
import { NextResponse, connection } from 'next/server';

export async function GET() {

    await connection();

    try {

        const cookieStore = await cookies();
        const session_token = cookieStore.get('sess')?.value;

        if (!session_token) {
            return NextResponse.json({ error: 'No session token found' }, { status: 400 });
        }

        return NextResponse.json(session_token, { status: 200 });
        
    } catch (error) {

        console.error("Error in GET /api/token:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

}