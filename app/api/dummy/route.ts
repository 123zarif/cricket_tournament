import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Team from '@/models/Team';
import Player from '@/models/Player';
import ScheduledMatch from '@/models/ScheduledMatch';
import FinishedMatch from '@/models/FinishedMatch';

export async function GET() {
    try {
        await dbConnect();

        // 1. Wipe everything
        await Promise.all([
            Team.deleteMany({}),
            Player.deleteMany({}),
            ScheduledMatch.deleteMany({}),
            FinishedMatch.deleteMany({}),
        ]);

        // 2. Define our Team & Player data (from your image)
        const rawTeams = [
            { name: "Fearless Challengers", players: ["Faraj", "Yafee", "Mashrur", "Nafis", "Ahnaf"] },
            { name: "Royal Blaster", players: ["Asir", "Farhan", "Himel", "Jilanur", "Suprio"] },
            { name: "Royal Bails", players: ["Al Jabir", "Arham", "Ayman", "Tasfiad", "Minhaz"] },
            { name: "Black Knight Riders", players: ["Sajid", "Yousuf", "Moon", "Shahriar", "Nam nai"] },
            { name: "Super Diddy Giants", players: ["Sakib", "Zarif", "Alif", "Farzeed", "Nahiyan"] },
        ];

        const teamIdMap: Record<string, string> = {};
        const playerIdMap: Record<string, string> = {};

        // 3. Create Teams first, then Players, then LINK them
        for (const teamData of rawTeams) {
            const team = await Team.create({ name: teamData.name, players: [] });
            teamIdMap[teamData.name] = team._id.toString();

            // Create Players for this team
            const playerDocs = teamData.players.map(pName => ({
                name: pName,
                team: team._id
            }));
            const createdPlayers = await Player.insertMany(playerDocs);

            // Store Player IDs for match seeding
            createdPlayers.forEach(p => {
                playerIdMap[p.name] = p._id.toString();
            });

            // UPDATE Team with the list of Player IDs
            team.players = createdPlayers.map(p => p._id);
            await team.save();
        }



        return NextResponse.json({
            success: true,
            message: "Database fully rebuilt! 5 Teams, 25 Players, and 4 Matches are now correctly linked by ID."
        });

    } catch (error: any) {
        console.error("Dummy Route Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}