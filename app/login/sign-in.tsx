'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// import { signIn } from 'next-auth/react';
// export function SignIn() {
//   const credentialsAction = async (formData: FormData) => {
//     const data: Record<string, string> = {};
//     formData.forEach((value, key) => {
//       data[key] = value.toString();
//     });

//     const result = await signIn('credentials', {
//       ...data,
//       redirect: true
//     });

//     if (result?.error) {
//       console.error('Error signing in:', result.error);
//     } else {
//       console.log('Successfully signed in');
//     }
//   };

//   return (
//     <form action={credentialsAction} className="flex flex-col gap-2 w-full">
//       <Input
//         name="email"
//         type="email"
//         placeholder="Name"
//         className="border-primary"
//       />
//       <Input
//         name="password"
//         type="password"
//         placeholder="Password"
//         className="border-primary"
//       />
//       <Button>Sign In</Button>
//     </form>
//   );
// }

import { signIn } from '@/lib/auth';

export function SignIn() {
  return (
    <form
      className="flex flex-col gap-2 w-full"
      action={async (formData) => {
        console.log('---  🚀 ---> | formData:', formData);
        ('use server');
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
