import { create } from "zustand";


type TournamentStore = {
  tournaments: Tournament[];
  setTournaments: (tournaments: Tournament[]) => void;
  selectedMatchday: MatchDay | null;
  setSelectedMatchday: (matchday: MatchDay | null) => void;
};

export const useTournamentStore = create<TournamentStore>((set) => ({
    tournaments: [],
    setTournaments: (tournaments) => set({ tournaments }),
    selectedMatchday: null,
    setSelectedMatchday: (matchday) => set({ selectedMatchday: matchday }),
  }));