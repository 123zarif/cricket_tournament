import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import FinishedMatch from '@/models/FinishedMatch';

export async function GET() {
    try {
        await dbConnect();

        const topWicketTakers = await FinishedMatch.aggregate([
            {
                $project: {
                    allBowling: {
                        $concatArrays: [
                            { $ifNull: ["$innings1.bowling", []] },
                            { $ifNull: ["$innings2.bowling", []] }
                        ]
                    }
                }
            },
            {
                $unwind: "$allBowling"
            },
            {
                $group: {
                    _id: "$allBowling.playerId",
                    totalWickets: { $sum: "$allBowling.wickets" },
                    totalRunsConceded: { $sum: "$allBowling.runs" },
                    inningsBowled: { $sum: 1 },
                    // THE FIX: Convert overs (e.g., 2.3) into total balls (15) so we can add them safely
                    totalBalls: {
                        $sum: {
                            $add: [
                                { $multiply: [{ $trunc: "$allBowling.overs" }, 6] }, // Get full overs and multiply by 6
                                { $round: [{ $multiply: [{ $subtract: ["$allBowling.overs", { $trunc: "$allBowling.overs" }] }, 10] }, 0] } // Get decimal balls
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "players",
                    localField: "_id",
                    foreignField: "_id",
                    as: "playerInfo"
                }
            },
            {
                $unwind: "$playerInfo"
            },
            {
                $project: {
                    _id: 0,
                    playerId: "$_id",
                    playerName: "$playerInfo.name",
                    totalWickets: 1,
                    totalRunsConceded: 1,
                    inningsBowled: 1,
                    // Convert total balls back into real cricket overs (e.g., 16 balls -> 2.4 overs)
                    totalOvers: {
                        $add: [
                            { $trunc: { $divide: ["$totalBalls", 6] } },
                            { $divide: [{ $mod: ["$totalBalls", 6] }, 10] }
                        ]
                    },
                    // Calculate real Economy Rate: (Runs / Balls) * 6
                    economyRate: {
                        $round: [
                            {
                                $cond: [
                                    { $eq: ["$totalBalls", 0] },
                                    0,
                                    { $multiply: [{ $divide: ["$totalRunsConceded", "$totalBalls"] }, 6] }
                                ]
                            },
                            2
                        ]
                    }
                }
            },
            {
                $sort: { totalWickets: -1, economyRate: 1 }
            }
        ]);

        return NextResponse.json(topWicketTakers);

    } catch (error: any) {
        console.error("Aggregation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}