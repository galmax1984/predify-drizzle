"use client"

import React, { useEffect, useState } from "react";
import { Switcher } from "./switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "./ui/sidebar"
import { TournamentList } from "./tournament-list"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    fetch("/api/tournaments")
      .then((res) => res.json())
      .then(setTournaments);
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