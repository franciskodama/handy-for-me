import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth';

export function SignUp() {
  return (
    <form
    //   className="flex flex-col gap-4 w-full"
    //   action={async (formData) => {
    //     'use server';
    //     await signIn('credentials', formData);
    //   }}
    >
      {/* <label className="text-sm">
        Email
        <Input name="email" type="email" />
      </label>
      <label className="text-sm">
        Password
        <Input name="password" type="password" />
      </label>
      <Button>Sign In</Button> */}
    </form>
  );
}
