import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { SignIn } from './sign-in';
import { auth, signIn } from '@/lib/auth';

export default async function LoginPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div
      className="min-h-screen flex justify-center items-start md:items-center p-8 bg-[#ffffff] opacity-80"
      style={{
        backgroundSize: '10px 10px',
        backgroundImage:
          'repeating-linear-gradient(45deg, #000000 0, #030303 1px, #ffffff 0, #ffffff 50%)'
      }}
    >
      <Card className="w-full max-w-sm border border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardTitle className="text-4xl">Login</CardTitle>
          <CardDescription>
            Life’s better when it’s handy – Let’s sign in!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center my-12">
          <form
            action={async () => {
              'use server';
              await signIn('google', {
                redirectTo: '/'
              });
            }}
            className="w-full"
          >
            <Button type="submit" className="w-full">
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
            <Button type="submit" className="w-full">
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
  );
}
