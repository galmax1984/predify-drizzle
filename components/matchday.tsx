"use client";
import MatchFixtures from "@/components/match-fixtures";
import { predictions } from "@/db/schema";
import { useTournamentStore } from "@/stores/tournamentStore";

interface MatchdayData {
  id: string;
  title: string;
  date: string;
  fixtures: Array<{
    id: string;
    homeTeam: string;
    awayTeam: string;
    homeScore?: number;
    awayScore?: number;
    status: "scheduled" | "live" | "completed";
    scheduledTime: string;
  }>;
}

export default function MatchdayComponent({ matchdayId }: { matchdayId: string }) {
  const selectedMatchday = useTournamentStore((state) => state.selectedMatchday);

  const tournaments = useTournamentStore((state) => state.tournaments);
  console.log("tournaments:", tournaments);
  console.log("matchday id: " + matchdayId)
  const matchday =
    selectedMatchday ||
    tournaments.flatMap(t => t.matchDays).find(md => md.id === matchdayId);

    console.log('flatMap:' + tournaments.flatMap(t => t.matchDays).find(md => md.id === matchdayId));
    console.log('selectedMatchDay:' + selectedMatchday);
  if (!matchday) return <div>No matchday found</div>;

  // if (loading) {
  //   return <div className="p-6">Loading matchday...</div>;
  // }

  // if (!matchday) {
  //   return <div className="p-6">Matchday not found</div>;
  // }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">{matchday.title}</h2>
      <p className="text-gray-600 mb-6">{matchday.title}</p> 
      
      <MatchFixtures
        mode="prediction"
        fixtures={matchday.fixtures.map(fx => ({
          ...fx,
          date: fx.date,        
          time: fx.scheduledTime,
          matchday: Number(matchday.id),
          status: fx.status === "scheduled" || fx.status === "live" ? "upcoming" : "finished",
        }))}
        //onPredictionChange={handlePredictionChange}
      />
    </div>
  );
}