"use client";
import MatchFixtures from "@/components/match-fixtures";
import { useTournamentStore } from "@/stores/tournamentStore";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import useCountdown from "@/hooks/use-countdown";

function getMatchdayDeadline(matchday: any): Date {
    let earliest = matchday.fixtures[0];
    let earliestDate = new Date(`${earliest.scheduledDate}T${earliest.scheduledTime}`);

    for (let i = 1; i < matchday.fixtures.length; i++) {
      const current = matchday.fixtures[i];
      const currentDate = new Date(`${current.scheduledDate}T${current.scheduledTime}`);
      if (currentDate < earliestDate) {
        earliest = current;
        earliestDate = currentDate;
      }
    }

    return earliestDate;
  };

export default function MatchdayComponent({ matchdayId }: { matchdayId: string }) {
  const selectedMatchday = useTournamentStore((state) => state.selectedMatchday);
  const tournaments = useTournamentStore((state) => state.tournaments);

  const matchday =
    selectedMatchday ||
    tournaments.flatMap(t => t.matchDays).find(md => md.id === matchdayId);

  if (!matchday) return <div>No matchday found</div>;

  const deadline = matchday ? getMatchdayDeadline(matchday) : new Date();
  const countdown = useCountdown(deadline);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-foreground">Matchday Fixtures</h2>
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
        fixtures={matchday.fixtures.map(fx => ({
          ...fx,
          date: fx.date,
          time: fx.scheduledTime,
          matchday: Number(matchday.id),
          status: fx.status === "scheduled" || fx.status === "live" ? "upcoming" : "finished",
        }))}
        mode={deadline > new Date() ? 'prediction' : 'results'}
      />
    </div>
  );
}

