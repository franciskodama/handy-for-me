import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function AIPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Artificial Inteligence </CardTitle>
        <CardDescription>Thanks god we have a Testing Page </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-12 w-[14em] justify-center">
          <Button>Normal</Button>
          <Button variant={'outline'}>Outline</Button>
          <Button variant={'secondary'}>Secondary</Button>
          <Button variant={'ghost'}>Ghost</Button>
          <Button variant={'link'}>Link</Button>

          <button className="bg-black shadow-[4px_4px_0_0_#ffffff] text-white font-bold uppercase py-4 px-6 w-full sm:w-auto flex items-center justify-between">
            Checkout
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center text-primary h-24 w-48 bg-accent my-8 p-8">
          Accent Color
        </div>
      </CardContent>
    </Card>
  );
}
