import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import FinishedMatch from '@/models/FinishedMatch';

export async function GET() {
    try {
        await dbConnect();

        const topWicketTakers = await FinishedMatch.aggregate([
            // 1. Combine both bowling innings into one array
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
            // 2. Unwind to process every bowling spell individually
            {
                $unwind: "$allBowling"
            },
            // 3. Group by bowler and sum up their stats
            {
                $group: {
                    _id: "$allBowling.playerId",
                    totalWickets: { $sum: "$allBowling.wickets" },
                    totalRunsConceded: { $sum: "$allBowling.runs" },
                    totalOvers: { $sum: "$allBowling.overs" },
                    inningsBowled: { $sum: 1 }
                }
            },
            // 4. Lookup their real name from the players collection
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
            // 5. Calculate Economy Rate and format output
            {
                $project: {
                    _id: 0,
                    playerId: "$_id",
                    playerName: "$playerInfo.name",
                    totalWickets: 1,
                    totalRunsConceded: 1,
                    totalOvers: 1,
                    inningsBowled: 1,
                    economyRate: {
                        $round: [
                            {
                                $cond: [
                                    { $eq: ["$totalOvers", 0] },
                                    0,
                                    { $divide: ["$totalRunsConceded", "$totalOvers"] }
                                ]
                            },
                            2 // Round economy to 2 decimal places
                        ]
                    }
                }
            },
            // 6. Sort by Wickets (High to Low), then Economy (Low to High)
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