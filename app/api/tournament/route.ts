// File: app/api/tournament/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Team from '@/models/Team';
import ScheduledMatch from '@/models/ScheduledMatch';
import FinishedMatch from '@/models/FinishedMatch';
import Player from '@/models/Player'; // MUST HAVE THIS IMPORT

export async function GET() {
    try {
        await dbConnect();

        // 1. Force register the Player model in Next.js memory
        const _forceRegister = Player.modelName;

        // 2. Fetch everything, using EXPLICIT model mapping for the deep paths
        const [allTeams, scheduledMatches, finishedMatches] = await Promise.all([
            Team.find({}).populate('players').lean(),
            ScheduledMatch.find({}).populate('team1 team2').lean(),
            FinishedMatch.find({})
                .sort({ _id: -1 })
                .populate('team1 team2')
                // EXPLICIT DEEP POPULATION (The Bulletproof Method)
                .populate({
                    path: 'innings1.batting.playerId',
                    model: Player, // Force it to look at the Player collection
                    select: 'name'
                })
                .populate({
                    path: 'innings1.bowling.playerId',
                    model: Player,
                    select: 'name'
                })
                .populate({
                    path: 'innings2.batting.playerId',
                    model: Player,
                    select: 'name'
                })
                .populate({
                    path: 'innings2.bowling.playerId',
                    model: Player,
                    select: 'name'
                })
                .lean()
        ]);

        // 3. Initialize tracking dictionary
        const teamStats: Record<string, any> = {};

        allTeams.forEach((team: any) => {
            if (!team || !team._id) return;
            const teamId = team._id.toString();
            teamStats[teamId] = {
                id: teamId,
                team: team.name,
                p: 0, w: 0, l: 0, pts: 0,
            };
        });

        // 4. Calculate points
        finishedMatches.forEach((match: any) => {
            const t1Id = match.team1?._id?.toString();
            const t2Id = match.team2?._id?.toString();

            if (!t1Id || !t2Id || !teamStats[t1Id] || !teamStats[t2Id]) return;

            teamStats[t1Id].p += 1;
            teamStats[t2Id].p += 1;

            const runs1 = parseInt(match.innings1?.total?.split('/')[0] || "0", 10);
            const runs2 = parseInt(match.innings2?.total?.split('/')[0] || "0", 10);

            if (runs1 > runs2) {
                teamStats[t1Id].w += 1;
                teamStats[t1Id].pts += 2;
                teamStats[t2Id].l += 1;
            } else if (runs2 > runs1) {
                teamStats[t2Id].w += 1;
                teamStats[t2Id].pts += 2;
                teamStats[t1Id].l += 1;
            } else {
                teamStats[t1Id].pts += 1;
                teamStats[t2Id].pts += 1;
            }
        });

        // 5. Sort Table
        const pointsTable = Object.values(teamStats)
            .sort((a, b) => b.pts - a.pts)
            .map((team, index) => ({
                pos: index + 1,
                ...team
            }));

        return NextResponse.json({
            pointsTable,
            scheduledMatches,
            completedMatches: finishedMatches,
        });

    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch tournament data" }, { status: 500 });
    }
}