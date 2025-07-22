import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Trophy } from "lucide-react";

interface MatchFixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  status: "upcoming" | "finished";
  prediction?: {
    homeScore: number;
    awayScore: number;
  };
  result?: {
    homeScore: number;
    awayScore: number;
  };
  matchday: number;
}

interface MatchFixturesProps {
  mode: "prediction" | "results";
  fixtures: MatchFixture[];
//   onPredictionChange?: (
//     matchId: string,
//     homeScore: number,
//     awayScore: number,
//   ) => void;
}

const sampleFixtures: MatchFixture[] = [
  {
    id: "1",
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    date: "Jul 20, 2025",
    time: "3:00 PM",
    status: "upcoming",
    matchday: 1,
    prediction: { homeScore: 2, awayScore: 1 },
  },
  {
    id: "2",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    date: "Jul 20, 2025",
    time: "5:30 PM",
    status: "finished",
    matchday: 1,
    prediction: { homeScore: 1, awayScore: 2 },
    result: { homeScore: 0, awayScore: 3 },
  },
  {
    id: "3",
    homeTeam: "Manchester City",
    awayTeam: "Tottenham",
    date: "Jul 21, 2025",
    time: "2:00 PM",
    status: "upcoming",
    matchday: 1,
  },
  {
    id: "4",
    homeTeam: "Newcastle",
    awayTeam: "Brighton",
    date: "Jul 21, 2025",
    time: "4:15 PM",
    status: "finished",
    matchday: 1,
    prediction: { homeScore: 3, awayScore: 1 },
    result: { homeScore: 2, awayScore: 2 },
  },
  {
    id: "5",
    homeTeam: "West Ham",
    awayTeam: "Everton",
    date: "Jul 22, 2025",
    time: "1:00 PM",
    status: "upcoming",
    matchday: 1,
  },
  {
    id: "6",
    homeTeam: "Leicester",
    awayTeam: "Wolves",
    date: "Jul 22, 2025",
    time: "3:30 PM",
    status: "upcoming",
    matchday: 1,
  },
];

function ScoreInput({
  value,
  onChange,
  disabled = false,
}: {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Only allow digits 1-9
    if (
      !/^[1-9]$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab"
    ) {
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // If empty, set to undefined
    if (inputValue === "") {
      onChange?.(0);
      return;
    }

    // Parse and validate the number
    const num = parseInt(inputValue);
    if (!isNaN(num) && num >= 1 && num <= 9) {
      onChange?.(num);
    }
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      pattern="[1-9]"
      value={value === 0 || value === undefined ? "" : value.toString()}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      disabled={disabled}
      className="w-12 h-8 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      maxLength={1}
    />
  );
}

function PredictionAccuracy({
  prediction,
  result,
}: {
  prediction?: { homeScore: number; awayScore: number };
  result?: { homeScore: number; awayScore: number };
}) {
  if (!prediction || !result) return null;

  const exactMatch =
    prediction.homeScore === result.homeScore &&
    prediction.awayScore === result.awayScore;
  const correctOutcome =
    (prediction.homeScore > prediction.awayScore &&
      result.homeScore > result.awayScore) ||
    (prediction.homeScore < prediction.awayScore &&
      result.homeScore < result.awayScore) ||
    (prediction.homeScore === prediction.awayScore &&
      result.homeScore === result.awayScore);

  if (exactMatch) {
    return (
      <Badge variant="default" className="bg-green-500 text-white text-xs">
        Exact
      </Badge>
    );
  } else if (correctOutcome) {
    return (
      <Badge variant="warning" className="bg-yellow-500 text-white text-xs">
        Outcome
      </Badge>
    );
  } else {
    return (
      <Badge variant="warning" className="text-xs">
        Wrong
      </Badge>
    );
  }
}

function getAccuracyColor(
  prediction?: { homeScore: number; awayScore: number },
  result?: { homeScore: number; awayScore: number },
): string {
  if (!prediction || !result) return "";

  const exactMatch =
    prediction.homeScore === result.homeScore &&
    prediction.awayScore === result.awayScore;
  const correctOutcome =
    (prediction.homeScore > prediction.awayScore &&
      result.homeScore > result.awayScore) ||
    (prediction.homeScore < prediction.awayScore &&
      result.homeScore < result.awayScore) ||
    (prediction.homeScore === prediction.awayScore &&
      result.homeScore === result.awayScore);

  if (exactMatch) return "border-l-green-500";
  if (correctOutcome) return "border-l-yellow-500";
  return "border-l-red-500";
}

function MatchCard({
  fixture,
  mode,
  prediction,
  onPredictionChange,
}: {
  fixture: MatchFixture;
  mode: "prediction" | "results";
  prediction?: { homeScore: number; awayScore: number };
  onPredictionChange?: (homeScore: number, awayScore: number) => void;
}) {
  const accuracyColor =
    fixture.status === "finished" && mode === "results"
      ? getAccuracyColor(prediction, fixture.result)
      : "";

  const cardClasses = `rounded-lg border border-border h-full ${
    accuracyColor ? `border-l-4 ${accuracyColor}` : ""
  }`;

  return (
    <Card className={cardClasses}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Date and Time */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              <span>{fixture.date}</span>
              <Clock className="h-3 w-3" />
              <span>{fixture.time}</span>
            </div>
          </div>

          {/* Teams and Score Layout */}
          <div className="flex items-center justify-between">
            {/* Teams */}
            <div className="flex-1 space-y-1">
              <div className="font-light text-sm">{fixture.homeTeam}</div>
              <div className="font-light text-sm">{fixture.awayTeam}</div>
            </div>

            {/* Score/Prediction Section */}
            <div className="flex-shrink-0 ml-4">
              {mode === "prediction" ? (
                <div className="flex flex-col items-center space-y-1">
                  <ScoreInput
                    value={prediction?.homeScore}
                    onChange={(value) =>
                      onPredictionChange?.(value, prediction?.awayScore || 0)
                    }
                    disabled={fixture.status === "finished"}
                  />
                  <ScoreInput
                    value={prediction?.awayScore}
                    onChange={(value) =>
                      onPredictionChange?.(prediction?.homeScore || 0, value)
                    }
                    disabled={fixture.status === "finished"}
                  />
                </div>
              ) : (
                <div className="text-center">
                  {fixture.result ? (
                    <div className="space-y-1">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-extralight">
                          {fixture.result.homeScore}
                        </span>
                        <span className="text-lg font-extralight">
                          {fixture.result.awayScore}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Badge
                      variant="warning"
                      className="font-extralight text-xs"
                    >
                      {fixture.time}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          {mode === "results" && (
            <div className="flex items-center justify-center">
              {fixture.status === "upcoming" && (
                <Badge variant="warning" className="font-extralight text-xs">
                  {prediction
                    ? `Prediction: ${prediction.homeScore}-${prediction.awayScore}`
                    : "Upcoming"}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


export default function MatchFixtures({
  mode = "prediction",
  fixtures = sampleFixtures
  //onPredictionChange,
}: MatchFixturesProps) {
  const [localPredictions, setLocalPredictions] = useState<
    Record<string, { homeScore: number; awayScore: number }>
  >({});

  const handlePredictionChange = (
    matchId: string,
    homeScore: number,
    awayScore: number,
  ) => {
    setLocalPredictions((prev) => ({
      ...prev,
      [matchId]: { homeScore, awayScore },
    }));
    //onPredictionChange?.(matchId, homeScore, awayScore);
  };

  const getPrediction = (fixture: MatchFixture) => {
    return localPredictions[fixture.id] || fixture.prediction;
  };


  const handleSubmitPredictions = () => {
    // Collect all predictions
    const allPredictions = fixtures
      .map((fixture) => {
        const prediction = getPrediction(fixture);
        return {
          matchId: fixture.id,
          homeTeam: fixture.homeTeam,
          awayTeam: fixture.awayTeam,
          prediction: prediction,
        };
      })
      .filter((p) => p.prediction); // Only include matches with predictions

    console.log("Submitting predictions:", allPredictions);
    // Here you would typically send to an API
    alert(`Submitted ${allPredictions.length} predictions!`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fixtures.map((fixture) => {
          const prediction = getPrediction(fixture);

          return (
            <MatchCard
              key={fixture.id}
              fixture={fixture}
              mode={mode}
              prediction={prediction}
              onPredictionChange={(homeScore, awayScore) =>
                handlePredictionChange(fixture.id, homeScore, awayScore)
              }
            />
          );
        })}
      </div>
      {/* Submit Button for Prediction Mode */}
      {mode === "prediction" && (
        <div className="flex justify-center">
          <Button
            onClick={handleSubmitPredictions}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-2"
            size="lg"
          >
            Submit All Predictions
          </Button>
        </div>
      )}
    </div>
  );
}
