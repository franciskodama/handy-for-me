'use client';

import { Bomb, MessageCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function Explanation({
  setOpenAction
}: {
  setOpenAction: (value: boolean) => void;
}) {
  const handleClickMessageButton = () => {
    const email = process.env.NEXT_PUBLIC_MY_UID;

    if (!email) {
      console.error('Email environment variable not set');
      return;
    }

    const subject = encodeURIComponent(
      '[HANDYFOR.ME] I have something to tell you!'
    );
    const body = encodeURIComponent(`
      Hey Handy For Me Team, 👋
      
      I would like to share something about your app:
      
      


      Cheers! 🍻
      `);

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
      '_blank'
    );
  };

  return (
    <div className="relative">
      <Alert
        style={{
          borderImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2.5px,
              black 3px,
              black 3px,
              transparent 3px,
              transparent 3px
            ) 15 / 0.75rem`,
          borderStyle: 'solid',
          borderWidth: '1em'
        }}
      >
        <AlertDescription className="relative flex flex-wrap items-start justify-between p-2">
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <Bomb size={24} color="black" strokeWidth={1.8} />
              <p className="font-bold text-lg ml-2">Ops...</p>
            </div>
            <p className="text-primary text-xs w-[26ch]">
              Looks like we’re missing
              <br />
            </p>
          </div>

          <div className="flex flex-wrap justify-between">
            <div>
              <p className="font-bold text-lg mb-2">Why?</p>
              <p className="text-xs w-[30ch]">
                Well, Francis is still pinching pennies and hasn’t paid for that
                fancy API to fetch the stock prices automatically!
              </p>
            </div>
            <div>
              <p className="font-bold text-lg mb-2 text-transparent">X</p>
              <p className="text-xs w-[30ch] ml-2">
                But don’t worry, once he manually updates the price in his
                trusty spreadsheet, you’ll see it here.
              </p>
            </div>
          </div>

          <div className="flex flex-col mr-20">
            <p className="text-primary text-xs w-[35ch] mb-4">
              As his friend, give him a quick nudge to add
              <br />
              {`Help Francis Out. :)`}
            </p>
            <Button
              variant={'outline'}
              className="flex items-center border-2 border-primary capitalize"
              onClick={handleClickMessageButton}
            >
              Send a message to our Team!
              <MessageCircle className="ml-2" size={24} strokeWidth={1.8} />
            </Button>
          </div>
          <button
            className="absolute right-2 top-2"
            onClick={() => setOpenAction(false)}
          >
            <X size={24} color="black" strokeWidth={1.8} />
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
