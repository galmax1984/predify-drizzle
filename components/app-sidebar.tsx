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
  const pathname = usePathname();

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
        <div className="mb-2">
          <Link
            href="/standings"
            className={
              "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors " +
              (pathname === "/standings"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50")
            }
          >
            <BarChart3 className="mr-3 h-4 w-4 flex-shrink-0" />
            Standings
          </Link>
        </div>
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