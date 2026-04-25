// File: app/api/tournament/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Team from '@/models/Team';
import ScheduledMatch from '@/models/ScheduledMatch';
import FinishedMatch from '@/models/FinishedMatch';
import Player from '@/models/Player'; // MUST HAVE THIS IMPORT

// --- HELPER: Convert Cricket Overs to Math Decimals (e.g. 2.3 overs = 2.5 math overs) ---
const convertOversToDecimal = (oversStr: string) => {
    if (!oversStr) return 0;
    const parts = oversStr.split('.');
    const overs = parseInt(parts[0] || "0", 10);
    const balls = parseInt(parts[1] || "0", 10);
    return overs + (balls / 6);
};

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
                .populate({ path: 'innings1.batting.playerId', model: Player, select: 'name' })
                .populate({ path: 'innings1.bowling.playerId', model: Player, select: 'name' })
                .populate({ path: 'innings2.batting.playerId', model: Player, select: 'name' })
                .populate({ path: 'innings2.bowling.playerId', model: Player, select: 'name' })
                .lean()
        ]);

        // 3. Initialize tracking dictionary (Added NRR trackers)
        const teamStats: Record<string, any> = {};

        allTeams.forEach((team: any) => {
            if (!team || !team._id) return;
            const teamId = team._id.toString();
            teamStats[teamId] = {
                id: teamId,
                team: team.name,
                p: 0, w: 0, l: 0, pts: 0,
                // NRR Variables
                runsFor: 0, oversFaced: 0,
                runsAgainst: 0, oversBowled: 0,
                nrr: "0.000" // Formatted string for UI
            };
        });

        // 4. Calculate points and accumulate NRR stats
        finishedMatches.forEach((match: any) => {
            const t1Id = match.team1?._id?.toString();
            const t2Id = match.team2?._id?.toString();

            if (!t1Id || !t2Id || !teamStats[t1Id] || !teamStats[t2Id]) return;

            // Increment Matches Played
            teamStats[t1Id].p += 1;
            teamStats[t2Id].p += 1;

            // --- SAFE PARSING: Runs & Wickets ---
            const runs1 = parseInt(match.innings1?.total?.split('/')[0] || "0", 10);
            const wickets1 = parseInt(match.innings1?.total?.split('/')[1] || "0", 10);

            const runs2 = parseInt(match.innings2?.total?.split('/')[0] || "0", 10);
            const wickets2 = parseInt(match.innings2?.total?.split('/')[1] || "0", 10);

            // --- NRR OVERS LOGIC (The 3-Over All-Out Rule) ---
            // If 10 wickets are lost, they are charged the full 3.0 overs. Otherwise, use actual overs.
            // *Note: Change '10' below if your T3 format considers a team "All Out" at fewer wickets.
            const oversFaced1 = wickets1 === 10 ? 3.0 : convertOversToDecimal(match.innings1?.overs || "0");
            const oversFaced2 = wickets2 === 10 ? 3.0 : convertOversToDecimal(match.innings2?.overs || "0");

            // --- UPDATE POINTS ---
            if (runs1 > runs2) {
                teamStats[t1Id].w += 1; teamStats[t1Id].pts += 2; teamStats[t2Id].l += 1;
            } else if (runs2 > runs1) {
                teamStats[t2Id].w += 1; teamStats[t2Id].pts += 2; teamStats[t1Id].l += 1;
            } else {
                teamStats[t1Id].pts += 1; teamStats[t2Id].pts += 1;
            }

            // --- UPDATE CUMULATIVE NRR TOTALS ---
            // Team 1 perspective
            teamStats[t1Id].runsFor += runs1;
            teamStats[t1Id].oversFaced += oversFaced1;
            teamStats[t1Id].runsAgainst += runs2;
            teamStats[t1Id].oversBowled += oversFaced2;

            // Team 2 perspective
            teamStats[t2Id].runsFor += runs2;
            teamStats[t2Id].oversFaced += oversFaced2;
            teamStats[t2Id].runsAgainst += runs1;
            teamStats[t2Id].oversBowled += oversFaced1;
        });

        // 5. Finalize NRR Math, Sort by Points (then NRR), and Assign Ranks
        const pointsTable = Object.values(teamStats)
            .map((team: any) => {
                // Prevent division by zero errors for teams that haven't played yet
                const rateFor = team.oversFaced > 0 ? (team.runsFor / team.oversFaced) : 0;
                const rateAgainst = team.oversBowled > 0 ? (team.runsAgainst / team.oversBowled) : 0;

                // Calculate Raw NRR
                const rawNrr = rateFor - rateAgainst;
                team.rawNrr = rawNrr; // Keep the raw number for accurate sorting

                // Create the beautiful display string (e.g., "+1.333" or "-0.500")
                team.nrr = rawNrr > 0 ? `+${rawNrr.toFixed(3)}` : rawNrr.toFixed(3);
                if (team.nrr === "-0.000") team.nrr = "0.000"; // Clean up negative zeros

                return team;
            })
            .sort((a: any, b: any) => {
                // PRIMARY TIE-BREAKER: Points
                if (b.pts !== a.pts) return b.pts - a.pts;
                // SECONDARY TIE-BREAKER: NRR
                return b.rawNrr - a.rawNrr;
            })
            .map((team, index) => {
                // Strip out the internal variables so we don't send useless data to the frontend
                const { rawNrr, runsFor, oversFaced, runsAgainst, oversBowled, ...cleanTeam } = team;
                return {
                    pos: index + 1,
                    ...cleanTeam
                };
            });

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