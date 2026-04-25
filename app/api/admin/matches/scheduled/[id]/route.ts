import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import ScheduledMatch from '@/models/ScheduledMatch';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const authHeader = req.headers.get('authorization');
        const secretKey = process.env.ADMIN_SECRET_KEY;

        if (!secretKey || authHeader !== `Bearer ${secretKey}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // Overwrite the scheduled match with the new teams/date
        const updatedSchedule = await ScheduledMatch.findByIdAndUpdate(params.id, body, { new: true });

        return NextResponse.json({
            message: "Schedule successfully updated!",
            match: updatedSchedule
        }, { status: 200 });

    } catch (error: any) {
        console.error("Admin PUT Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}