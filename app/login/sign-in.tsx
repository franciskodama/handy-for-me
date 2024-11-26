import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth';

export function SignIn() {
  return (
    <form
      className="flex flex-col gap-2 w-full"
      action={async (formData) => {
        'use server';
        await signIn('credentials', formData);
      }}
    >
      <Input
        name="email"
        type="email"
        placeholder="Name"
        className="border-primary"
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        className="border-primary"
      />
      <Button>Sign In</Button>
    </form>
  );
}
