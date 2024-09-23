import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { lexend } from 'app/ui/fonts';

export default function AIPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={`${lexend.className} uppercase font-semibold text-3xl`}
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
