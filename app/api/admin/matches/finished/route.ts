import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import FinishedMatch from '@/models/FinishedMatch';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        const secretKey = process.env.ADMIN_SECRET_KEY;

        if (!secretKey || authHeader !== `Bearer ${secretKey}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // The body should now contain playerIds instead of names
        const newMatch = await FinishedMatch.create(body);

        return NextResponse.json({
            message: "Match results uploaded!",
            id: newMatch._id
        }, { status: 201 });

    } catch (error: any) {
        console.error("Admin POST Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}