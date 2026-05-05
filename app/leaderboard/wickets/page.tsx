'use client';

import React, { useEffect, useState } from 'react';

type TopBowler = {
    playerId: string;
    playerName: string;
    totalWickets: number;
    totalRunsConceded: number;
    totalOvers: number;
    inningsBowled: number;
    economyRate: number;
};

export default function WicketsLeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<TopBowler[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/leaderboard/wickets')
            .then((res) => res.json())
            .then((data) => {
                setLeaderboard(data);
                setLoading(false);
            })
            .catch((err) => console.error("Failed to fetch wickets leaderboard", err));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-purple-500 font-black tracking-widest uppercase text-sm">Loading Stats...</p>
            </div>
        );
    }

    const topThree = leaderboard.slice(0, 3);
    const restOfPlayers = leaderboard.slice(3);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black italic text-white tracking-tight">
                        PURPLE CAP <span className="text-purple-500">RACE</span>
                    </h1>
                    <p className="mt-4 text-slate-400 font-semibold tracking-widest text-sm uppercase">
                        Top Wicket Takers of the Tournament
                    </p>
                </div>

                {/* TOP 3 PODIUM */}
                {topThree.length > 0 && (
                    <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-16 px-4">

                        {/* Rank 2 (Silver) */}
                        {topThree[1] && (
                            <div className="w-full md:w-64 bg-slate-900 border border-slate-700 rounded-t-xl rounded-b-lg p-6 text-center transform transition hover:-translate-y-2 relative order-2 md:order-1 shadow-[0_0_15px_rgba(148,163,184,0.1)]">
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-300 font-black px-4 py-1 rounded-full border border-slate-600 shadow-lg">
                                    🥈 2ND
                                </div>
                                <h3 className="text-xl font-bold text-white mt-4 truncate">{topThree[1].playerName}</h3>
                                <p className="text-4xl font-black text-slate-300 mt-2">{topThree[1].totalWickets} <span className="text-sm font-semibold text-slate-500">WKTS</span></p>
                                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs font-bold text-slate-400">
                                    <span>ECON: <span className="text-purple-400">{topThree[1].economyRate}</span></span>
                                    <span>OVR: {topThree[1].totalOvers}</span>
                                </div>
                            </div>
                        )}

                        {/* Rank 1 (Gold/Purple) */}
                        {topThree[0] && (
                            <div className="w-full md:w-72 bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-purple-500/50 rounded-t-xl rounded-b-lg p-8 text-center transform transition hover:-translate-y-2 relative order-1 md:order-2 shadow-[0_0_30px_rgba(168,85,247,0.15)] z-10">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-600 text-white font-black px-6 py-1.5 rounded-full border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                    👑 1ST
                                </div>
                                <h3 className="text-2xl font-black text-white mt-4 truncate">{topThree[0].playerName}</h3>
                                <p className="text-6xl font-black text-purple-400 mt-2 drop-shadow-md">{topThree[0].totalWickets}</p>
                                <p className="text-sm font-bold text-slate-400 tracking-widest mt-1">TOTAL WICKETS</p>
                                <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between text-sm font-bold text-slate-300">
                                    <span>ECON: <span className="text-purple-400">{topThree[0].economyRate}</span></span>
                                    <span>OVR: {topThree[0].totalOvers}</span>
                                </div>
                            </div>
                        )}

                        {/* Rank 3 (Bronze) */}
                        {topThree[2] && (
                            <div className="w-full md:w-64 bg-slate-900 border border-slate-800 rounded-t-xl rounded-b-lg p-6 text-center transform transition hover:-translate-y-2 relative order-3 md:order-3 shadow-[0_0_15px_rgba(217,119,6,0.1)]">
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-800 text-amber-600 font-black px-4 py-1 rounded-full border border-slate-700 shadow-lg">
                                    🥉 3RD
                                </div>
                                <h3 className="text-xl font-bold text-white mt-4 truncate">{topThree[2].playerName}</h3>
                                <p className="text-4xl font-black text-amber-600/80 mt-2">{topThree[2].totalWickets} <span className="text-sm font-semibold text-slate-500">WKTS</span></p>
                                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs font-bold text-slate-400">
                                    <span>ECON: <span className="text-purple-400">{topThree[2].economyRate}</span></span>
                                    <span>OVR: {topThree[2].totalOvers}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* FULL LEADERBOARD TABLE */}
                {restOfPlayers.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950/50 text-slate-400 text-xs font-black tracking-wider uppercase border-b border-slate-800">
                                        <th className="p-4 pl-6 w-16 text-center">#</th>
                                        <th className="p-4">Bowler</th>
                                        <th className="p-4 text-right">Innings</th>
                                        <th className="p-4 text-right">Overs</th>
                                        <th className="p-4 text-right">Runs</th>
                                        <th className="p-4 text-right text-white">Wickets</th>
                                        <th className="p-4 pr-6 text-right text-purple-400">ECON</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {restOfPlayers.map((player, index) => (
                                        <tr key={player.playerId} className="hover:bg-slate-800/50 transition duration-150">
                                            <td className="p-4 pl-6 text-center font-bold text-slate-500">
                                                {index + 4}
                                            </td>
                                            <td className="p-4 font-bold text-white">
                                                {player.playerName}
                                            </td>
                                            <td className="p-4 text-right text-slate-400 font-medium">
                                                {player.inningsBowled}
                                            </td>
                                            <td className="p-4 text-right text-slate-400 font-medium">
                                                {player.totalOvers}
                                            </td>
                                            <td className="p-4 text-right text-slate-400 font-medium">
                                                {player.totalRunsConceded}
                                            </td>
                                            <td className="p-4 text-right font-black text-slate-200">
                                                {player.totalWickets}
                                            </td>
                                            <td className="p-4 pr-6 text-right font-bold text-purple-400">
                                                {player.economyRate}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {leaderboard.length === 0 && (
                    <div className="text-center bg-slate-900 border border-slate-800 rounded-xl p-12">
                        <p className="text-slate-400 font-bold tracking-widest uppercase">No bowling data available yet.</p>
                    </div>
                )}

            </div>
        </div>
    );
}