"use client";

import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [teams, setTeams] = useState<any[]>([]);
    const [mode, setMode] = useState<'finished' | 'scheduled'>('finished');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    // Match Details
    const [date, setDate] = useState('');
    const [result, setResult] = useState('');
    const [t1Id, setT1Id] = useState('');
    const [t2Id, setT2Id] = useState('');

    // Scores
    const [t1Runs, setT1Runs] = useState('');
    const [t1Wickets, setT1Wickets] = useState('');
    const [t1Overs, setT1Overs] = useState('3.0');
    const [t2Runs, setT2Runs] = useState('');
    const [t2Wickets, setT2Wickets] = useState('');
    const [t2Overs, setT2Overs] = useState('3.0');

    // Stats Dictionaries (Keyed by Player _id)
    const [i1Batting, setI1Batting] = useState<Record<string, any>>({});
    const [i1Bowling, setI1Bowling] = useState<Record<string, any>>({});
    const [i2Batting, setI2Batting] = useState<Record<string, any>>({});
    const [i2Bowling, setI2Bowling] = useState<Record<string, any>>({});

    useEffect(() => {
        // Re-fetch teams to ensure we have the latest linked players
        fetch('/api/admin/teams')
            .then((res) => res.json())
            .then((data) => {
                console.log("Teams Data Loaded:", data); // Check your console (F12) to see if 'players' exists
                if (Array.isArray(data)) setTeams(data);
            });
    }, []);

    // IMPROVED: Robust ID matching
    const getPlayers = (teamId: string) => {
        const team = teams.find(t => String(t._id) === String(teamId));
        if (!team) return [];
        return team.players || [];
    };

    const handleStatChange = (setter: any, playerId: string, field: string, value: string) => {
        setter((prev: any) => ({
            ...prev,
            [playerId]: { ...prev[playerId], [field]: value }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Syncing with database...' });

        const endpoint = `/api/admin/matches/${mode}`;

        // Convert dictionaries to Schema-friendly arrays
        const filterB = (s: any) => Object.entries(s)
            .map(([id, val]: any) => ({ playerId: id, runs: Number(val.runs || 0), balls: Number(val.balls || 0) }))
            .filter(p => p.runs > 0 || p.balls > 0);

        const filterO = (s: any) => Object.entries(s)
            .map(([id, val]: any) => ({ playerId: id, wickets: Number(val.wickets || 0), overs: Number(val.overs || 0), runs: Number(val.runs || 0) }))
            .filter(p => p.overs > 0 || p.wickets > 0);

        const payload = mode === 'finished' ? {
            team1: t1Id, team2: t2Id, date, result,
            innings1: {
                teamName: teams.find(t => String(t._id) === String(t1Id))?.name,
                total: `${t1Runs}/${t1Wickets}`, overs: t1Overs,
                batting: filterB(i1Batting), bowling: filterO(i1Bowling)
            },
            innings2: {
                teamName: teams.find(t => String(t._id) === String(t2Id))?.name,
                total: `${t2Runs}/${t2Wickets}`, overs: t2Overs,
                batting: filterB(i2Batting), bowling: filterO(i2Bowling)
            }
        } : { team1: t1Id, team2: t2Id, date };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${password}` },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error((await res.json()).error || 'Auth failed');
            setStatus({ type: 'success', message: 'Match successfully updated!' });
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">

                {/* Toggle Mode */}
                <div className="flex gap-2 mb-8 bg-slate-900 p-1 rounded-xl w-fit border border-slate-800">
                    <button onClick={() => setMode('finished')} className={`px-6 py-2 rounded-lg text-sm font-bold transition ${mode === 'finished' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>Result</button>
                    <button onClick={() => setMode('scheduled')} className={`px-6 py-2 rounded-lg text-sm font-bold transition ${mode === 'scheduled' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}>Schedule</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Top Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 flex gap-4">
                            <input type="password" placeholder="Admin Secret" required value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" />
                            <input type="text" placeholder="Date (e.g. 20 April)" required value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" />
                        </div>

                        <select required value={t1Id} onChange={(e) => setT1Id(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-white">
                            <option value="">-- Select Team 1 --</option>
                            {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>

                        <select required value={t2Id} onChange={(e) => setT2Id(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-white">
                            <option value="">-- Select Team 2 --</option>
                            {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>

                        {mode === 'finished' && (
                            <input type="text" placeholder="Result Message" required value={result} onChange={(e) => setResult(e.target.value)} className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-lg p-3 text-white" />
                        )}
                    </div>

                    {/* Player Lists (Only shows if mode is 'finished' and teams are selected) */}
                    {mode === 'finished' && t1Id && t2Id && (
                        <div className="space-y-6">

                            {/* INNINGS 1 */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                <h3 className="text-emerald-400 font-bold mb-4 uppercase text-xs tracking-widest">Innings 1 Details</h3>
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <input type="number" placeholder="Total Runs" value={t1Runs} onChange={(e) => setT1Runs(e.target.value)} className="bg-slate-950 border border-slate-800 p-3 rounded text-white" />
                                    <input type="number" placeholder="Wickets" value={t1Wickets} onChange={(e) => setT1Wickets(e.target.value)} className="bg-slate-950 border border-slate-800 p-3 rounded text-white" />
                                    <input type="text" placeholder="Overs" value={t1Overs} onChange={(e) => setT1Overs(e.target.value)} className="bg-slate-950 border border-slate-800 p-3 rounded text-white" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Batting Team 1 */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-slate-500 uppercase">Batters ({teams.find(t => String(t._id) === String(t1Id))?.name})</p>
                                        {getPlayers(t1Id).length === 0 && <p className="text-red-500 text-xs">No players found for this team!</p>}
                                        {getPlayers(t1Id).map((p: any) => (
                                            <div key={p._id} className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                                                <span className="flex-1 text-sm font-medium text-slate-300">{p.name}</span>
                                                <input type="number" placeholder="R" onChange={(e) => handleStatChange(setI1Batting, p._id, 'runs', e.target.value)} className="w-14 bg-slate-900 border border-slate-700 p-1.5 rounded text-center text-white text-sm" />
                                                <input type="number" placeholder="B" onChange={(e) => handleStatChange(setI1Batting, p._id, 'balls', e.target.value)} className="w-14 bg-slate-900 border border-slate-700 p-1.5 rounded text-center text-white text-sm" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bowling Team 2 */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-slate-500 uppercase">Bowlers ({teams.find(t => String(t._id) === String(t2Id))?.name})</p>
                                        {getPlayers(t2Id).map((p: any) => (
                                            <div key={p._id} className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                                                <span className="flex-1 text-sm font-medium text-slate-300">{p.name}</span>
                                                <input type="text" placeholder="O" onChange={(e) => handleStatChange(setI1Bowling, p._id, 'overs', e.target.value)} className="w-12 bg-slate-900 border border-slate-700 p-1.5 rounded text-center text-white text-sm" />
                                                <input type="number" placeholder="W" onChange={(e) => handleStatChange(setI1Bowling, p._id, 'wickets', e.target.value)} className="w-12 bg-slate-900 border border-slate-700 p-1.5 rounded text-center text-white text-sm" />
                                                <input type="number" placeholder="R" onChange={(e) => handleStatChange(setI1Bowling, p._id, 'runs', e.target.value)} className="w-12 bg-slate-900 border border-slate-700 p-1.5 rounded text-center text-white text-sm" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* INNINGS 2 (SIMILAR LOGIC) */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                <h3 className="text-emerald-400 font-bold mb-4 uppercase text-xs tracking-widest">Innings 2 Details</h3>
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <input type="number" placeholder="Total Runs" value={t2Runs} onChange={(e) => setT2Runs(e.target.value)} className="bg-slate-950 border border-slate-800 p-3 rounded text-white" />
                                    <input type="number" placeholder="Wickets" value={t2Wickets} onChange={(e) => setT2Wickets(e.target.value)} className="bg-slate-950 border border-slate-800 p-3 rounded text-white" />
                                    <input type="text" placeholder="Overs" value={t2Overs} onChange={(e) => setT2Overs(e.target.value)} className="bg-slate-950 border border-slate-800 p-3 rounded text-white" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-slate-500 uppercase">Batters ({teams.find(t => String(t._id) === String(t2Id))?.name})</p>
                                        {getPlayers(t2Id).map((p: any) => (
                                            <div key={p._id} className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                                                <span className="flex-1 text-sm font-medium text-slate-300">{p.name}</span>
                                                <input type="number" placeholder="R" onChange={(e) => handleStatChange(setI2Batting, p._id, 'runs', e.target.value)} className="w-14 bg-slate-900 border border-slate-700 p-1.5 rounded text-center text-white text-sm" />
                                                <input type="number" placeholder="B" onChange={(e) => handleStatChange(setI2Batting, p._id, 'balls', e.target.value)} className="w-14 bg-slate-900 border border-slate-700 p-1.5 rounded text-center text-white text-sm" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-slate-500 uppercase">Bowlers ({teams.find(t => String(t._id) === String(t1Id))?.name})</p>
                                        {getPlayers(t1Id).map((p: any) => (
                                            <div key={p._id} className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                                                <span className="flex-1 text-sm font-medium text-slate-300">{p.name}</span>
                                                <input type="text" placeholder="O" onChange={(e) => handleStatChange(setI2Bowling, p._id, 'overs', e.target.value)} className="w-12 bg-slate-900 border border-slate-700 p-1.5 rounded text-center text-white text-sm" />
                                                <input type="number" placeholder="W" onChange={(e) => handleStatChange(setI2Bowling, p._id, 'wickets', e.target.value)} className="w-12 bg-slate-900 border border-slate-700 p-1.5 rounded text-center text-white text-sm" />
                                                <input type="number" placeholder="R" onChange={(e) => handleStatChange(setI2Bowling, p._id, 'runs', e.target.value)} className="w-12 bg-slate-900 border border-slate-700 p-1.5 rounded text-center text-white text-sm" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {status.message && <div className={`p-4 rounded-xl text-center text-sm font-bold ${status.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{status.message}</div>}

                    <button type="submit" className={`w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95 ${mode === 'finished' ? 'bg-emerald-500 text-slate-950' : 'bg-blue-500 text-white'}`}>
                        {mode === 'finished' ? 'COMMIT MATCH TO DATABASE' : 'SCHEDULE UPCOMING MATCH'}
                    </button>
                </form>
            </div>
        </div>
    );
}