'use client';

import React, { useEffect, useState } from 'react';

type TopScorer = {
    playerId: string;
    playerName: string;
    totalRuns: number;
    totalBalls: number;
    inningsPlayed: number;
    strikeRate: number;
};

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<TopScorer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/leaderboard/runs/')
            .then((res) => res.json())
            .then((data) => {
                setLeaderboard(data);
                setLoading(false);
            })
            .catch((err) => console.error("Failed to fetch leaderboard", err));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-emerald-500 font-black tracking-widest uppercase text-sm">Loading Stats...</p>
            </div>
        );
    }

    // Separate the top 3 for the podium, and the rest for the table
    const topThree = leaderboard.slice(0, 3);
    const restOfPlayers = leaderboard.slice(3);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black italic text-white tracking-tight">
                        ORANGE CAP <span className="text-emerald-500">RACE</span>
                    </h1>
                    <p className="mt-4 text-slate-400 font-semibold tracking-widest text-sm uppercase">
                        Top Run Scorers of the Tournament
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
                                <p className="text-4xl font-black text-slate-300 mt-2">{topThree[1].totalRuns} <span className="text-sm font-semibold text-slate-500">RUNS</span></p>
                                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs font-bold text-slate-400">
                                    <span>SR: <span className="text-emerald-400">{topThree[1].strikeRate}</span></span>
                                    <span>INN: {topThree[1].inningsPlayed}</span>
                                </div>
                            </div>
                        )}

                        {/* Rank 1 (Gold) */}
                        {topThree[0] && (
                            <div className="w-full md:w-72 bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-yellow-500/50 rounded-t-xl rounded-b-lg p-8 text-center transform transition hover:-translate-y-2 relative order-1 md:order-2 shadow-[0_0_30px_rgba(234,179,8,0.15)] z-10">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-950 font-black px-6 py-1.5 rounded-full border-2 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                                    👑 1ST
                                </div>
                                <h3 className="text-2xl font-black text-white mt-4 truncate">{topThree[0].playerName}</h3>
                                <p className="text-6xl font-black text-yellow-400 mt-2 drop-shadow-md">{topThree[0].totalRuns}</p>
                                <p className="text-sm font-bold text-slate-400 tracking-widest mt-1">TOTAL RUNS</p>
                                <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between text-sm font-bold text-slate-300">
                                    <span>SR: <span className="text-emerald-400">{topThree[0].strikeRate}</span></span>
                                    <span>INN: {topThree[0].inningsPlayed}</span>
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
                                <p className="text-4xl font-black text-amber-600/80 mt-2">{topThree[2].totalRuns} <span className="text-sm font-semibold text-slate-500">RUNS</span></p>
                                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs font-bold text-slate-400">
                                    <span>SR: <span className="text-emerald-400">{topThree[2].strikeRate}</span></span>
                                    <span>INN: {topThree[2].inningsPlayed}</span>
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
                                        <th className="p-4">Batter</th>
                                        <th className="p-4 text-right">Innings</th>
                                        <th className="p-4 text-right">Runs</th>
                                        <th className="p-4 text-right">Balls</th>
                                        <th className="p-4 pr-6 text-right text-emerald-500">SR</th>
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
                                                {player.inningsPlayed}
                                            </td>
                                            <td className="p-4 text-right font-black text-slate-200">
                                                {player.totalRuns}
                                            </td>
                                            <td className="p-4 text-right text-slate-400 font-medium">
                                                {player.totalBalls}
                                            </td>
                                            <td className="p-4 pr-6 text-right font-bold text-emerald-400">
                                                {player.strikeRate}
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
                        <p className="text-slate-400 font-bold tracking-widest uppercase">No batting data available yet.</p>
                    </div>
                )}

            </div>
        </div>
    );
}