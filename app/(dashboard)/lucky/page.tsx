import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { josefin_sans, jost } from 'app/ui/fonts';

export default function LuckyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={`${jost.className} uppercase font-semibold text-3xl`}
        >
          Your Bag is Empty
        </CardTitle>
        <CardDescription>
          A fun, random decision-maker that spins the wheel to pick your next
          adventure!
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
