"use client"
import { useTournamentStore } from "@/stores/tournamentStore";

import { BarChart3, ChevronRight, Trophy, Volleyball} from "lucide-react"
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
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  return (
    <SidebarGroup>
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
                  <CircleFlag countryCode="es" height={20} width={20} />
                  <span className="px-1 py-1 text-sm font-medium rounded-md ">{tournament.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                <div className="mb-1">
                  <Link
                    href="/standings"
                    className={
                      "group flex items-center px-1 py-1 text-sm font-medium rounded-md transition-colors " +
                      (pathname === "/standings"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50")
                    }
                  >
                    <Trophy className="mr-3 h-5 w-5 flex-shrink-0" />
                    Standings
                  </Link>
                </div>
                </SidebarMenuSub>
                <SidebarMenuSub>
                  {tournament.matchDays?.map((matchDay) => (
                    <SidebarMenuSubItem key={matchDay.id}>
                    <SidebarMenuSubButton asChild>
                      <Link className={
                      "group flex items-center px-1 py-1 text-sm font-medium rounded-md transition-colors " +
                          (pathname === `/matchday/${matchDay.id}`
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50")
                          }
                            href={`/matchday/${matchDay.id}`} // or use router.push if using client navigation
                          onClick={() =>
                            setSelectedMatchday({
                              ...matchDay,
                              fixtures: matchDay.fixtures.map(fx => ({
                                ...fx,
                                date: fx.scheduledDate, 
                              })),
                            })
                          }>
                        <Volleyball className="mr-3 h-3 w-3 flex-shrink-0"/>    
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