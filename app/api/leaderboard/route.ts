import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import FinishedMatch from '@/models/FinishedMatch';

export async function GET() {
    try {
        await dbConnect();

        const topScorers = await FinishedMatch.aggregate([
            // 1. Combine innings1 and innings2 batting arrays into one massive array per match
            {
                $project: {
                    allBatting: {
                        $concatArrays: [
                            { $ifNull: ["$innings1.batting", []] },
                            { $ifNull: ["$innings2.batting", []] }
                        ]
                    }
                }
            },
            // 2. Break that array apart so every single batting performance is its own row
            {
                $unwind: "$allBatting"
            },
            // 3. Group by the Player ID, and sum up their total runs and balls faced!
            {
                $group: {
                    _id: "$allBatting.playerId",
                    totalRuns: { $sum: "$allBatting.runs" },
                    totalBalls: { $sum: "$allBatting.balls" },
                    inningsPlayed: { $sum: 1 }
                }
            },
            // 4. Join with the "players" collection to get their actual name instead of just an ID
            {
                $lookup: {
                    from: "players", // This must match your MongoDB collection name (usually lowercase plural)
                    localField: "_id",
                    foreignField: "_id",
                    as: "playerInfo"
                }
            },
            // 5. Unwind the joined player info
            {
                $unwind: "$playerInfo"
            },
            // 6. Format the final output cleanly and calculate Strike Rate
            {
                $project: {
                    _id: 0,
                    playerId: "$_id",
                    playerName: "$playerInfo.name",
                    totalRuns: 1,
                    totalBalls: 1,
                    inningsPlayed: 1,
                    strikeRate: {
                        $round: [
                            {
                                $cond: [
                                    { $eq: ["$totalBalls", 0] },
                                    0,
                                    { $multiply: [{ $divide: ["$totalRuns", "$totalBalls"] }, 100] }
                                ]
                            },
                            2 // Round to 2 decimal places
                        ]
                    }
                }
            },
            // 7. Sort by highest total runs descending!
            {
                $sort: { totalRuns: -1 }
            }
        ]);

        return NextResponse.json(topScorers);

    } catch (error: any) {
        console.error("Aggregation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}