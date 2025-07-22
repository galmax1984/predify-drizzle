type Fixture = {
    id: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    homeScore?: number;
    awayScore?: number;
    scheduledDate: string;
    scheduledTime: string;
    status: "scheduled" | "live" | "completed";
  };
  
  type MatchDay = {
    id: string;
    title: string;
    fixtures: Fixture[];
  };
  
  type Tournament = {
    id: string;
    title: string;
    isActive?: boolean;
    matchDays: MatchDay[];
  };