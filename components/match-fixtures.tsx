import { useState} from "react";
import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
}

const sampleFixtures: MatchFixture[] = [
  {
    id: "1",
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    date: "Jul 25, 2025",
    time: "3:00 PM",
    status: "upcoming",
    matchday: 1,
    prediction: { homeScore: 2, awayScore: 1 },
  },
  {
    id: "2",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    date: "Jul 25, 2025",
    time: "5:30 PM",
    status: "upcoming",
    matchday: 1,
    prediction: { homeScore: 1, awayScore: 2 },
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
      className="w-12 h-8 border-1 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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

    const handleSubmit = () => {
    // To save prediction
        alert(`Prediction submitted for ${fixture.homeTeam} vs ${fixture.awayTeam}`);
        };

    let submitPredictionButton = null;
    if (fixture.status === "upcoming") {
        submitPredictionButton = (
        <Button
            size="sm"
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-light leading-4"
            onClick={handleSubmit}
            disabled={!prediction} // Disable if no prediction entered
        >
            Submit
        </Button>
        );
    }
  return (
    <Card className={`rounded-3xl border-1 border-l-black-100 h-full overflow-hidden bg-gradient-to-tr from-purple-100 to-purple-300`}>
      <CardContent className="p-4 pb-8">
        <div className="space-y-4">
          {/* Header with date and time - full width */}
          <div className="w-full">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-0 rounded-full w-full text-center">
              <span className="text-sm font-light text-gray-900 leading-4">
                {fixture.date} • {fixture.time}
              </span>
            </div>
          </div>

          {/* Teams and Score Row */}
          <div className="flex items-center justify-between w-full mt-4">
            {/* Teams (left) */}
            <div className="flex flex-col text-left">
              <span className="font-light text-lg text-gray-900">{fixture.homeTeam}</span>
              <span className="font-light text-lg text-gray-900">{fixture.awayTeam}</span>
            </div>
            {/* Score (right) */}
            <div className="flex flex-col items-end ml-4">
              {mode !== "prediction" ? (
                <div className="flex flex-col items-end">
                  <span className="text-lg font-extralight">
                    {fixture.result?.homeScore ?? "-"}
                  </span>
                  <span className="text-lg font-extralight">
                    {fixture.result?.awayScore ?? "-"}
                  </span>
                </div>
              ):(<div></div>)}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 bg-black/10 backdrop-blur-sm rounded-full text-xs font-extralight text-gray-800 leading-4">
              Matchday {fixture.matchday}
            </span>
            {fixture.status === "finished" && (
              <span className="px-3 py-1 bg-black/10 backdrop-blur-sm rounded-full text-xs font-extralight text-gray-800 leading-4">
                Final
              </span>
            )}
            {mode === "prediction" && prediction && (
              <span className="px-3 py-1 bg-black/10 backdrop-blur-sm rounded-full text-xs font-extralight text-gray-800 leading-4">
                Predicted
              </span>
            )}
          </div>
        </div>
      </CardContent>

      {/* Bottom stripe section */}
      <div className="bg-white/70 backdrop-blur-sm px-4 py-3 border-t border-white/30">
        <div className="flex items-center justify-between">
          <div>
            {mode === "prediction" ? (
              <div className="flex items-center space-x-2">
                <ScoreInput
                  value={prediction?.homeScore}
                  onChange={(value) =>
                    onPredictionChange?.(value, prediction?.awayScore || 0)
                  }
                  disabled={fixture.status === "finished"}
                />
                <span className="text-gray-800 font-extralight">:</span>
                <ScoreInput
                  value={prediction?.awayScore}
                  onChange={(value) => {
                        onPredictionChange?.(prediction?.homeScore || 0, value)
                    }
                  }
                  disabled={fixture.status === "finished"}
                />
              </div>
            ) : (
              <div>
                {fixture.result ? (
                  <div>
                    <span className="text-lg font-extralight text-gray-900 leading-5">
                      {fixture.result.homeScore}:{fixture.result.awayScore}
                    </span>
                    <div className="text-xs text-gray-600 mt-1 font-extralight leading-3">
                      Final Score
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-base font-extralight text-gray-900 leading-5">{fixture.time}</span>
                    <div className="text-xs text-gray-600 font-extralight leading-3">
                      Kick Off
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className=" px-2 py-1 border-t border-white/30">
            <div className="flex items-center justify-end">
                {submitPredictionButton}
            </div>
          </div>
        </div>

        {/* Accuracy indicator for results mode */}
        {mode === "results" && fixture.status === "finished" && prediction && (
          <div className="flex justify-center mt-2">
            <PredictionAccuracy
              prediction={prediction}
              result={fixture.result}
            />
          </div>
        )}
      </div>
    </Card>
  );
}


export default function MatchFixtures({
  mode,
  fixtures = sampleFixtures
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
  };

  const getPrediction = (fixture: MatchFixture) => {
    return localPredictions[fixture.id] || fixture.prediction;
  };


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    </div>
  );
}
