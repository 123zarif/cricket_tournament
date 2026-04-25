import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import FinishedMatch from '@/models/FinishedMatch';

// Note the change in the type signature: params is now a Promise
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authHeader = req.headers.get('authorization');
        const secretKey = process.env.ADMIN_SECRET_KEY;

        if (!secretKey || authHeader !== `Bearer ${secretKey}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // We must await the params before extracting the ID
        const { id } = await params;

        await dbConnect();
        const body = await req.json();

        // Overwrite the match using the awaited ID
        const updatedMatch = await FinishedMatch.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json({
            message: "Match successfully updated!",
            match: updatedMatch
        }, { status: 200 });

    } catch (error: any) {
        console.error("Admin PUT Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}