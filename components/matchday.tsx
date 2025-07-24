"use client";
import MatchFixtures from "@/components/match-fixtures";
import { useTournamentStore } from "@/stores/tournamentStore";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        setTimeLeft(`${hours}h:${minutes.toString().padStart(2, "0")}m`);
      } else {
        setTimeLeft("0h:00m");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function MatchdayComponent({ matchdayId }: { matchdayId: string }) {
  const selectedMatchday = useTournamentStore((state) => state.selectedMatchday);

  const getMatchdayDeadline = () => {
    const deadline = new Date(2025, 6, 21, 17, 0, 0); // July 21st, 2025 at 17:00 (5:00 PM)
    return deadline;
  };
  const countdown = useCountdown(getMatchdayDeadline());
  const tournaments = useTournamentStore((state) => state.tournaments);
  const matchday =
    selectedMatchday ||
    tournaments.flatMap(t => t.matchDays).find(md => md.id === matchdayId);
  if (!matchday) return <div>No matchday found</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-foreground">
            Matchday Fixtures
          </h2>
            <Badge
              variant="warning"
              className="font-extralight text-red-600 border-red-600"
            >
              Time left to predict: {countdown}
            </Badge>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>Matchday 1</span>
        </div>
      </div>
      
      <MatchFixtures
        mode="prediction"
        fixtures={matchday.fixtures.map(fx => ({
          ...fx,
          date: fx.date,        
          time: fx.scheduledTime,
          matchday: Number(matchday.id),
          status: fx.status === "scheduled" || fx.status === "live" ? "upcoming" : "finished",
        }))}
      />
    </div>
  );
}