import { kumbh_sans } from 'app/ui/fonts';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { signIn } from '@/lib/auth';
import Image from 'next/image';

export default async function Login() {
  return (
    <div
      className="min-h-screen flex justify-center items-start md:items-center p-8 bg-[#ffffff] opacity-80"
      style={{
        backgroundSize: '10px 10px',
        backgroundImage:
          'repeating-linear-gradient(45deg, #000000 0, #030303 1px, #ffffff 0, #ffffff 50%)'
      }}
    >
      <div className="flex">
        <div className="flex flex-col p-12 border-red-500bg bg-white mr-12 w-[90ch] border border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Image
            className="mb-12"
            src="/logos/HandyForMe_Square200x200.png"
            alt="HandyFor.Me Logo"
            width={150}
            height={150}
          />
          <div
            className={`flex flex-col text-4xl text-black font-extrabold uppercase`}
          >
            <p className={`${kumbh_sans.className} text-8xl leading-[5.5rem]`}>
              Goodbye 👋 overwhelm!
            </p>
            <div className="opacity-50 leading-10 w-[20ch] mt-12 font-medium">
              <p>
                Your personal hub for organizing daily tasks is just one click
                away!
              </p>
            </div>
          </div>
        </div>

        <Card className="flex flex-col justify-center w-full max-w-sm border border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="text-4xl text-black">Login</CardTitle>
            <CardDescription>
              Life’s better when it’s handy – Let’s sign in!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center my-[6em]">
            <form
              action={async () => {
                'use server';
                await signIn('google', {
                  redirectTo: '/'
                });
              }}
              className="w-full"
            >
              <Button
                size="xl"
                type="submit"
                className="w-full bg-black text-base font-normal"
              >
                Sign in with Google
              </Button>
            </form>
            <p className="my-4 text-sm">or</p>
            <form
              action={async () => {
                'use server';
                await signIn('github', {
                  redirectTo: '/'
                });
              }}
              className="w-full"
            >
              <Button
                size="xl"
                type="submit"
                className="w-full bg-black text-base font-normal"
              >
                Sign in with GitHub
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-sm">
            <div>
              <p className="font-semibold">Not a member yet?</p>
              Don’t worry, life gets better from here!
              <span>
                {/* <Button variant={'link'} className="" href={'/login/signup'}>
                Sign up
              </Button> */}
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
