import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import FinishedMatch from '@/models/FinishedMatch';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const authHeader = req.headers.get('authorization');
        const secretKey = process.env.ADMIN_SECRET_KEY;

        if (!secretKey || authHeader !== `Bearer ${secretKey}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // Find the match by ID and completely overwrite it with the new form data
        const updatedMatch = await FinishedMatch.findByIdAndUpdate(params.id, body, { new: true });

        return NextResponse.json({
            message: "Match successfully updated!",
            match: updatedMatch
        }, { status: 200 });

    } catch (error: any) {
        console.error("Admin PUT Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}