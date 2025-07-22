"use client"
import { useTournamentStore } from "@/stores/tournamentStore";

import { ChevronRight} from "lucide-react"
import { CircleFlag } from 'react-circle-flags'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar"
import Link from "next/link"

export function TournamentList({
  tournaments,
}: {
  tournaments: {
    id: string
    title: string
    matchDays?: {
      id: string
      title: string
      fixtures: {
        id: string;
        homeTeam: string
        awayTeam: string
        homeScore?: number
        awayScore?: number
        scheduledDate: string
        scheduledTime: string
        status: "scheduled" | "live" | "completed"
      }[]
    }[]
  }[]
}) {
  const setSelectedMatchday = useTournamentStore((state) => state.setSelectedMatchday);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>My Tournaments</SidebarGroupLabel>
      <SidebarMenu>
        {Array.isArray(tournaments) && tournaments.map((tournament) => (
          <Collapsible
            key={tournament.title}
            asChild
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={tournament.title}>
                  <CircleFlag countryCode="eu" height={15} width={15} />
                  <span>{tournament.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {tournament.matchDays?.map((matchDay) => (
                    <SidebarMenuSubItem key={matchDay.id}>
                    <SidebarMenuSubButton asChild>
                      <Link href={`/matchday/${matchDay.id}`} // or use router.push if using client navigation
                          onClick={() => setSelectedMatchday(matchDay)}>
                        <span>{matchDay.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}