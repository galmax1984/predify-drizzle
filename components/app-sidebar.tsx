"use client"

import { useTournamentStore } from "@/stores/tournamentStore";
import React, { useEffect, useState } from "react";
import { Switcher } from "./switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "./ui/sidebar"
import { TournamentList } from "./tournament-list"
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const setTournaments = useTournamentStore((state) => state.setTournaments);
  const tournaments = useTournamentStore((state) => state.tournaments);

  useEffect(() => {
    fetch("/api/tournaments")
      .then((res) => res.json())
      .then((data: Tournament[]) => setTournaments(data));
  }, []);
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Switcher/>
      </SidebarHeader>
      <SidebarContent>
        {Array.isArray(tournaments) && <TournamentList tournaments={tournaments} />}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}