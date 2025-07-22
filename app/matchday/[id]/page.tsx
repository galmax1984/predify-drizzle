// app/matchday/[id]/page.tsx
import MatchdayComponent from "@/components/matchday";

interface MatchdayPageProps {
  params: {
    id: string;
  };
}

export default function MatchdayPage({ params }: MatchdayPageProps) {
  return <MatchdayComponent matchdayId={params.id} />;
}