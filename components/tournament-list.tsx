"use client"

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

export function TournamentList({
  tournaments,
}: {
  tournaments: {
    title: string
    url: string
    isActive?: boolean
    matchDays?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>My Tournaments</SidebarGroupLabel>
      <SidebarMenu>
        {Array.isArray(tournaments) && tournaments.map((tournament) => (
          <Collapsible
            key={tournament.title}
            asChild
            defaultOpen={tournament.isActive}
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
                      <a
                        href={`/matchday/${matchDay.id}`} // or use router.push if using client navigation
                        onClick={(e) => {
                          e.preventDefault();
                          // Your logic to display matchday content, e.g.:
                          // setSelectedMatchDay(matchDay.id);
                        }}
                      >
                        <span>{matchDay.title}</span>
                      </a>
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