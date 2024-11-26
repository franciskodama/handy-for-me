import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createUser } from '@/lib/actions';

export function SignUp() {
  return (
    <form
      className="flex flex-col gap-2 w-full"
      action={async (formData) => {
        'use server';
        try {
          const email = formData.get('email')?.toString() || '';
          const password = formData.get('password')?.toString() || '';
          const name = formData.get('name')?.toString() || '';

          await createUser({ email, password, name });

          // Redirect to sign-in page or dashboard
          window.location.href = '/login';
        } catch (error) {
          console.error('Error creating user:', error);
        }
      }}
    >
      <Input
        name="name"
        type="text"
        placeholder="Name"
        className="border-primary"
        required
      />
      <Input
        name="email"
        type="email"
        placeholder="Email"
        className="border-primary"
        required
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        className="border-primary"
        required
      />
      <Button>Create Account</Button>
    </form>
  );
}
