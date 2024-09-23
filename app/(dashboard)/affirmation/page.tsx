import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { kumbh_sans } from 'app/ui/fonts';

export default function AffirmationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={`${kumbh_sans.className} uppercase font-bold text-3xl`}
        >
          Your Bag is Empty
        </CardTitle>
        <CardDescription>
          Bla bla bla bla bla bla bla bla bla bla bla bla bla
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
