"use client";

import React, { useState, useEffect } from 'react';

// --- SUB-COMPONENT FOR ACCORDION LOGIC ---
function MatchResultCard({ match }: { match: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
      {/* Match Summary (Always Visible) */}
      <div className="p-5 bg-slate-800/20 text-center border-b border-slate-800/50">
        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">{match.date}</div>
        <div className="text-emerald-400 text-sm font-bold bg-emerald-400/10 inline-block px-4 py-1.5 rounded-full mb-4">
          🏆 {match.result}
        </div>
        <div className="flex justify-around items-center mb-4">
          <div className="flex-1">
            <div className="text-xl font-black text-white truncate">{match.innings1.teamName}</div>
            <div className="text-emerald-400 font-mono text-2xl font-bold">
              {match.innings1.total} <span className="text-xs text-slate-500 font-sans">({match.innings1.overs} ov)</span>
            </div>
          </div>
          <div className="text-slate-700 font-black text-lg italic px-4">VS</div>
          <div className="flex-1">
            <div className="text-xl font-black text-white truncate">{match.innings2.teamName}</div>
            <div className="text-emerald-400 font-mono text-2xl font-bold">
              {match.innings2.total} <span className="text-xs text-slate-500 font-sans">({match.innings2.overs} ov)</span>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-2.5 mt-2 text-xs font-black tracking-widest text-slate-500 uppercase hover:text-emerald-400 bg-slate-950/30 hover:bg-slate-950/50 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isOpen ? 'Close Full Scorecard ▲' : 'View Full Scorecard ▼'}
        </button>
      </div>

      {/* Detailed Scorecards (Hidden by default) */}
      {isOpen && (
        <div className="p-0 animate-in slide-in-from-top-2 fade-in duration-200 bg-slate-950/50">
          {/* Innings 1 */}
          <div className="border-b border-slate-800 p-6">
            <h3 className="text-white font-black uppercase tracking-tight mb-4 bg-slate-800 inline-block px-3 py-1.5 rounded-md text-xs">
              1st Innings: {match.innings1.teamName}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Batting */}
              <div>
                <div className="grid grid-cols-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 px-2">
                  <div className="col-span-2">Batter</div>
                  <div className="text-right">R</div>
                  <div className="text-right">B</div>
                </div>
                <ul className="space-y-1.5">
                  {match.innings1.batting.map((player: any, idx: number) => (
                    <li key={idx} className="grid grid-cols-4 text-sm border-b border-slate-800/30 py-1.5 px-2 items-center hover:bg-slate-800/10">
                      {/* DYNAMIC PLAYER ID FIX HERE */}
                      <span className="col-span-2 font-medium text-slate-300">{player.playerId?.name || 'Unknown'}</span>
                      <span className="text-right font-mono font-bold text-white">{player.runs}</span>
                      <span className="text-right font-mono text-slate-500">{player.balls}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Bowling */}
              <div>
                <div className="grid grid-cols-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 px-2">
                  <div className="col-span-2">Bowler</div>
                  <div className="text-right">O</div>
                  <div className="text-right">W</div>
                </div>
                <ul className="space-y-1.5">
                  {match.innings1.bowling.map((player: any, idx: number) => (
                    <li key={idx} className="grid grid-cols-4 text-sm border-b border-slate-800/30 py-1.5 px-2 items-center hover:bg-slate-800/10">
                      {/* DYNAMIC PLAYER ID FIX HERE */}
                      <span className="col-span-2 font-medium text-slate-300">{player.playerId?.name || 'Unknown'}</span>
                      <span className="text-right font-mono text-slate-500">{player.overs}</span>
                      <span className="text-right font-mono font-bold text-emerald-400">{player.wickets}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Innings 2 */}
          <div className="p-6">
            <h3 className="text-white font-black uppercase tracking-tight mb-4 bg-slate-800 inline-block px-3 py-1.5 rounded-md text-xs">
              2nd Innings: {match.innings2.teamName}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Batting */}
              <div>
                <div className="grid grid-cols-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 px-2">
                  <div className="col-span-2">Batter</div>
                  <div className="text-right">R</div>
                  <div className="text-right">B</div>
                </div>
                <ul className="space-y-1.5">
                  {match.innings2.batting.map((player: any, idx: number) => (
                    <li key={idx} className="grid grid-cols-4 text-sm border-b border-slate-800/30 py-1.5 px-2 items-center hover:bg-slate-800/10">
                      {/* DYNAMIC PLAYER ID FIX HERE */}
                      <span className="col-span-2 font-medium text-slate-300">{player.playerId?.name || 'Unknown'}</span>
                      <span className="text-right font-mono font-bold text-white">{player.runs}</span>
                      <span className="text-right font-mono text-slate-500">{player.balls}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Bowling */}
              <div>
                <div className="grid grid-cols-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 px-2">
                  <div className="col-span-2">Bowler</div>
                  <div className="text-right">O</div>
                  <div className="text-right">W</div>
                </div>
                <ul className="space-y-1.5">
                  {match.innings2.bowling.map((player: any, idx: number) => (
                    <li key={idx} className="grid grid-cols-4 text-sm border-b border-slate-800/30 py-1.5 px-2 items-center hover:bg-slate-800/10">
                      {/* DYNAMIC PLAYER ID FIX HERE */}
                      <span className="col-span-2 font-medium text-slate-300">{player.playerId?.name || 'Unknown'}</span>
                      <span className="text-right font-mono text-slate-500">{player.overs}</span>
                      <span className="text-right font-mono font-bold text-emerald-400">{player.wickets}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function CricketDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic Mongoose data when the page loads
  useEffect(() => {
    // NOTE: Changed from /api/table to /api/tournament based on your backend setup. 
    // Change it back if you created a separate table route!
    fetch('/api/tournament')
      .then((res) => res.json())
      .then((fetchedData) => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch tournament data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-emerald-400 font-black uppercase tracking-widest text-lg animate-pulse">
          Loading Live Data...
        </div>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400 font-bold">
        Error loading data. Check your database connection.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 selection:bg-emerald-500 selection:text-white">

      {/* Header */}
      <header className="max-w-4xl mx-auto mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic mb-2">
          CHAMPIONS <span className="text-emerald-500">TROPHY</span> <span className="text-slate-600">2026</span>
        </h1>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Session-2 | Live stats, schedules, and points table</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-14">

        {/* POINTS TABLE SECTION */}
        <section>
          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-yellow-500"></span>
            Tournament Standings
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-xl">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-5">Team</th>
                  <th scope="col" className="px-4 py-5 text-center">P</th>
                  <th scope="col" className="px-4 py-5 text-center">W</th>
                  <th scope="col" className="px-4 py-5 text-center">L</th>
                  <th scope="col" className="px-6 py-5 text-right text-emerald-400">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.pointsTable.map((row: any, idx: number) => (
                  <tr key={row.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-5 font-bold text-white flex items-center gap-4 text-base">
                      <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-black ${idx === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'bg-slate-800 text-slate-400'}`}>
                        {row.pos}
                      </span>
                      {row.team}
                    </td>
                    <td className="px-4 py-5 text-center text-slate-400 font-mono text-base">{row.p}</td>
                    <td className="px-4 py-5 text-center text-slate-300 font-mono text-base">{row.w}</td>
                    <td className="px-4 py-5 text-center text-slate-500 font-mono text-base">{row.l}</td>
                    <td className="px-6 py-5 text-right font-black text-white text-xl font-mono">{row.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SCHEDULED MATCHES SECTION */}
        <section>
          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-blue-500"></span>
            Upcoming Matches
          </h2>
          {data.scheduledMatches.length === 0 ? (
            <p className="text-slate-500 text-sm font-medium bg-slate-900/50 p-6 rounded-2xl border border-slate-800 text-center">No upcoming matches scheduled.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.scheduledMatches.map((match: any) => (
                <div key={match._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-colors shadow-lg">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                    <span>{match.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    {/* Access populated .name property from Mongoose */}
                    <span className="font-black text-xl text-white truncate">{match.team1?.name}</span>
                    <span className="text-slate-700 font-black text-lg italic mx-3">VS</span>
                    <span className="font-black text-xl text-white truncate text-right">{match.team2?.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* COMPLETED MATCHES SECTION */}
        <section>
          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-emerald-500"></span>
            Recent Results
          </h2>
          {data.completedMatches.length === 0 ? (
            <p className="text-slate-500 text-sm font-medium bg-slate-900/50 p-6 rounded-2xl border border-slate-800 text-center">No matches played yet.</p>
          ) : (
            <div className="space-y-6">
              {data.completedMatches.map((match: any) => (
                <MatchResultCard key={match._id} match={match} />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}