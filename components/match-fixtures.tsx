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
    // <Card className={`rounded-2xl border-0 h-full overflow-hidden bg-gradient-to-tr from-purple-100 to-purple-300`}>
    //   {/* Black Header */}
    //   <div className="bg-black text-white px-6 py-4">
    //     <div className="flex items-center justify-between">
    //       <span className="text-sm font-medium">{fixture.date}</span>
    //       <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
    //         <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    //           <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
    //         </svg>
    //       </div>
    //     </div>
    //   </div>

    //   <CardContent className="p-6">
    //     <div className="space-y-4">

    //       {/* League/Competition */}
    //       <div className="text-sm font-medium text-gray-700">
    //         Premier League
    //       </div>

    //       {/* Match Title */}
    //       <div className="space-y-1">
    //         <h3 className="font-semibold text-lg text-gray-900 leading-tight">
    //           {fixture.homeTeam}
    //         </h3>
    //         <div className="text-sm text-gray-600">vs</div>
    //         <h4 className="font-semibold text-lg text-gray-900 leading-tight">
    //           {fixture.awayTeam}
    //         </h4>
    //       </div>

    //       {/* Logo/Icon */}
    //       <div className="flex justify-end">
    //         <div className={`w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center`}>
    //           <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
    //             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    //           </svg>
    //         </div>
    //       </div>

    //       {/* Tags */}
    //       <div className="flex flex-wrap gap-2">
    //         <span className="px-2 py-1 bg-white/50 rounded-full text-xs font-medium text-gray-700">
    //           {fixture.time}
    //         </span>
    //         <span className="px-2 py-1 bg-white/50 rounded-full text-xs font-medium text-gray-700">
    //           Matchday {fixture.matchday}
    //         </span>
    //         {fixture.status === "finished" && (
    //           <span className="px-2 py-1 bg-white/50 rounded-full text-xs font-medium text-gray-700">
    //             Finished
    //           </span>
    //         )}
    //       </div>

    //       {/* Bottom section with prediction/result and action */}
    //       <div className="flex items-center justify-between pt-2">
    //         <div>
    //           {mode === "prediction" ? (
    //             <div className="flex items-center space-x-2">
    //               <ScoreInput
    //                 value={prediction?.homeScore}
    //                 onChange={(value) =>
    //                   onPredictionChange?.(value, prediction?.awayScore || 0)
    //                 }
    //                 disabled={fixture.status === "finished"}
    //               />
    //               <span className="text-gray-600">:</span>
    //               <ScoreInput
    //                 value={prediction?.awayScore}
    //                 onChange={(value) =>
    //                   onPredictionChange?.(prediction?.homeScore || 0, value)
    //                 }
    //                 disabled={fixture.status === "finished"}
    //               />
    //             </div>
    //           ) : (
    //             <div className="text-sm text-gray-600">
    //               {fixture.result ? (
    //                 <span className="font-bold text-gray-900">
    //                   {fixture.result.homeScore}:{fixture.result.awayScore}
    //                 </span>
    //               ) : (
    //                 <span>{fixture.time}</span>
    //               )}
    //             </div>
    //           )}
    //         </div>
    //         <Button
    //           size="sm"
    //           className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium"
    //         >
    //           {mode === "prediction" ? "Predict" : "Details"}
    //         </Button>
    //       </div>

    //       {/* Accuracy indicator for results mode */}
    //       {mode === "results" && fixture.status === "finished" && prediction && (
    //         <div className="flex justify-center">
    //           <PredictionAccuracy
    //             prediction={prediction}
    //             result={fixture.result}
    //           />
    //         </div>
    //       )}
    //     </div>
    //   </CardContent>
    // </Card>


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

          {/* Match Title */}
          <div className="text-left space-y-1">
            <h3 className="font-light text-lg text-gray-900 leading-5">
              {fixture.homeTeam}
            </h3>
            <h4 className="font-light text-lg text-gray-900 leading-5">
              {fixture.awayTeam}
            </h4>
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
                  onChange={(value) =>
                    onPredictionChange?.(prediction?.homeScore || 0, value)
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
          <Button
            size="sm"
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-light leading-4"
          >
            Submit
          </Button>
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
