import { db } from '../db/schema';
import { users, leagues, matchDays, fixtures, tournaments, participants, tournamentParticipants, tournamentFixtures, predictions } from '../db/schema';
import { sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { genSaltSync, hashSync } from 'bcrypt-ts';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

async function main() {
  console.log('Starting seed...');
  
  // Clear existing data (in reverse order of dependencies)
  console.log('Clearing existing data...');
  await db.delete(predictions);
  await db.delete(tournamentFixtures);
  await db.delete(tournamentParticipants);
  await db.delete(participants);
  await db.delete(tournaments);
  await db.delete(fixtures);
  await db.delete(matchDays);
  await db.delete(leagues);
  await db.delete(users);
  
  console.log('Creating seed data...');

  // 0. Create some users first (required for participants)
  const password = 'password123'; // Test password for all users
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(password, salt);
  
  const userData = Array.from({ length: 5 }, (_, i) => ({
    id: randomUUID(),
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    password: hashedPassword,
  }));
  await db.insert(users).values(userData);
  console.log('✓ Created users');

  // 1. Leagues
  const leagueData = [
    { id: randomUUID(), name: 'Premier League', country: 'England', logo: 'premier.png' },
    { id: randomUUID(), name: 'La Liga', country: 'Spain', logo: 'laliga.png' },
  ];
  await db.insert(leagues).values(leagueData);
  console.log('✓ Created leagues');

  // 2. MatchDays (3 per league)
  const matchDayData = leagueData.flatMap(league =>
    Array.from({ length: 3 }, (_, i) => ({
      id: randomUUID(),
      leagueId: league.id,
      name: `Matchday ${i + 1}`,
      round: i + 1,
      date: isoDate(new Date(Date.now() + i * 86400000)),
    }))
  );
  await db.insert(matchDays).values(matchDayData);
  console.log('✓ Created matchdays');

  // 3. Fixtures (4 per matchday)
  const fixtureData = matchDayData.flatMap(md =>
    Array.from({ length: 4 }, (_, i) => ({
      id: randomUUID(),
      matchDayId: md.id,
      homeTeam: `Team ${randomInt(1, 10)}`,
      awayTeam: `Team ${randomInt(11, 20)}`,
      scheduledDate: md.date,
      scheduledTime: '18:00:00',
    }))
  );
  await db.insert(fixtures).values(fixtureData);
  console.log('✓ Created fixtures');

  // 4. Tournaments (1 per league)
  const tournamentData = leagueData.map(league => ({
    id: randomUUID(),
    name: `${league.name} Tournament`,
    leagueId: league.id,
    startDate: isoDate(new Date()),
    endDate: isoDate(new Date(Date.now() + 7 * 86400000)),
  }));
  await db.insert(tournaments).values(tournamentData);
  console.log('✓ Created tournaments');

  // 5. Participants (linked to the users we created)
  const participantData = userData.map((user, i) => ({
    id: randomUUID(),
    userId: user.id, // Link to actual users
    displayName: `Participant ${i + 1}`,
  }));
  await db.insert(participants).values(participantData);
  console.log('✓ Created participants');

  // 6. Tournament Participants (each participant in each tournament)
  const tournamentParticipantData = tournamentData.flatMap(tournament =>
    participantData.map(participant => ({
      tournamentId: tournament.id,
      participantId: participant.id,
    }))
  );
  await db.insert(tournamentParticipants).values(tournamentParticipantData);
  console.log('✓ Created tournament participants');

  // 7. Tournament Fixtures (add all fixtures from first matchday of each league to the tournament)
  const tournamentFixtureData = tournamentData.flatMap(tournament => {
    const leagueMatchDays = matchDayData.filter(md => md.leagueId === tournament.leagueId);
    const firstMatchDay = leagueMatchDays[0];
    const fixturesForDay = fixtureData.filter(f => f.matchDayId === firstMatchDay.id);
    return fixturesForDay.map(fixture => ({
      tournamentId: tournament.id,
      matchDayId: firstMatchDay.id,
      fixtureId: fixture.id,
    }));
  });
  await db.insert(tournamentFixtures).values(tournamentFixtureData);
  console.log('✓ Created tournament fixtures');

  // 8. Predictions (each participant predicts each tournament fixture)
  const predictionData = tournamentFixtureData.flatMap(tf =>
    participantData.map(participant => ({
      id: randomUUID(),
      tournamentId: tf.tournamentId,
      fixtureId: tf.fixtureId,
      participantId: participant.id,
      homeScore: randomInt(0, 5),
      awayScore: randomInt(0, 5),
      score: randomInt(0, 3),
    }))
  );
  await db.insert(predictions).values(predictionData);
  console.log('✓ Created predictions');

  console.log('🎉 Seed complete!');
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
}); 