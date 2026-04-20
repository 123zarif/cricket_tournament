import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import ScheduledMatch from '@/models/ScheduledMatch';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        const secretKey = process.env.ADMIN_SECRET_KEY;

        if (!secretKey || authHeader !== `Bearer ${secretKey}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { team1, team2, date } = await req.json();

        const newSchedule = await ScheduledMatch.create({ team1, team2, date });

        return NextResponse.json({
            message: "Match scheduled!",
            id: newSchedule._id
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}