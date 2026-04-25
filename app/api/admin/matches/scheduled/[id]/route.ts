import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import ScheduledMatch from '@/models/ScheduledMatch';

// Notice the params are now typed as a Promise
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

        // Overwrite the scheduled match using the awaited ID
        const updatedSchedule = await ScheduledMatch.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json({
            message: "Schedule successfully updated!",
            match: updatedSchedule
        }, { status: 200 });

    } catch (error: any) {
        console.error("Admin PUT Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}