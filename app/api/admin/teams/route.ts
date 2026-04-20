import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Team from '@/models/Team';
import Player from '@/models/Player'; // This registers the 'Player' name in Mongoose

export async function GET() {
    try {
        await dbConnect();

        // Force Mongoose to acknowledge the Player model exists
        // (This is a trick to fix the "only returning IDs" bug in Next.js)
        const _forceRegister = Player.modelName;

        const teams = await Team.find({})
            .populate({
                path: 'players',
                model: Player, // We explicitly pass the model here
                select: 'name'   // We only want the name
            })
            .lean();

        console.log("Sample Team from DB:", teams[0]); // Look at your terminal!

        return NextResponse.json(teams);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}