// app/api/tournaments/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { getParticipantTournaments } from "../../db";

export async function GET(req: Request) {
  const session = await auth();
  console.log("SESSION:", session);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tournaments = await getParticipantTournaments(session.user.id);
  return NextResponse.json(tournaments);
}