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
import { signIn } from '@/lib/auth';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Life’s better when it’s handy – Let’s sign in!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center my-12">
          {/* <SignIn /> */}
          <form
            action={async () => {
              'use server';
              await signIn('google');
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
            <Button className="w-full">Sign in with GitHub</Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm">
          <div>
            <p className="font-semibold">Not a member yet?</p>
            Don’t worry, life gets better from here!
            <span>
              <Button variant={'link'} className="" href={'/login/signup'}>
                Sign up
              </Button>
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
