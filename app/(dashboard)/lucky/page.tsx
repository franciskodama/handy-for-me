import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function LuckyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lucky</CardTitle>
        <CardDescription>
          LuckySpinny: A fun, random decision-maker that spins the wheel to pick
          your next adventure!
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
