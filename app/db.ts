import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, inArray } from 'drizzle-orm';

import { tournaments, participants, tournamentParticipants, matchDays, fixtures } from "../db/schema";
import { genSaltSync, hashSync } from "bcrypt-ts";

const connectionString = `${process.env.POSTGRES_URL || "postgresql://predify_user:predify_password@localhost:5432/predify"}?sslmode=disable`;
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool);

export async function getUser(email: string) {
	return await db.select().from(users).where(eq(users.email, email));
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return await db.insert(users).values({ email: email, password: hash });
}

export async function getParticipantTournaments(userId: string) {
  // Find participant by userId
  const participant = await db.select().from(participants).where(eq(participants.userId, userId));
  if (!participant.length) {
    // fallback: return hardcoded tournaments
    return [
      {
        title: "LaLiga Forecast 2025",
        code: "es",
        url: "#",
        isActive: true,
        matchDays: [
          { title: "Matchday 25", url: "#" },
          { title: "Matchday 26", url: "#" },
        ],
      },
      // ...more tournaments
    ];
  }
  // Find tournaments for this participant
  const participantId = participant[0].id;
  const tps = await db.select().from(tournamentParticipants).where(eq(tournamentParticipants.participantId, participantId));
  if (!tps.length) {
    // fallback: return hardcoded tournaments
    return [
      {
        title: "LaLiga Forecast 2025",
        code: "es",
        url: "#",
        isActive: true,
        matchDays: [
          { title: "Matchday 25", url: "#" },
          { title: "Matchday 26", url: "#" },
        ],
      },
      // ...more tournaments
    ];
  }
  const tournamentIds = tps.map(tp => tp.tournamentId);
  const userTournaments = await db.select().from(tournaments).where(inArray(tournaments.id, tournamentIds));

  const leagueIds = userTournaments.map(t => t.leagueId);
  const allMatchDays = await db.select().from(matchDays).where(inArray(matchDays.leagueId, leagueIds));


  const matchDaysByLeague: Record<string, any[]> = {};
  for (const md of allMatchDays) {
    if (!matchDaysByLeague[md.leagueId]) matchDaysByLeague[md.leagueId] = [];
    const fixturesOfMatchday = await db.select().from(fixtures).where(eq(fixtures.matchDayId, md.id));
    matchDaysByLeague[md.leagueId].push({
      id: md.id, 
      title: md.name,
      url: "", // or build a real URL if you have one
      fixtures: (!fixturesOfMatchday) ? [] : fixturesOfMatchday
    });
  }
  console.log('matchdays:', matchDaysByLeague);
  // Map tournaments to include their matchdays
  return userTournaments.map(t => ({
    title: t.name,
    code: "es", // fill as needed
    url: "#",
    isActive: t.isActive,
    matchDays: matchDaysByLeague[t.leagueId] || [],
  }));
}