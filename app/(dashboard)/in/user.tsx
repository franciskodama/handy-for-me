import { User } from '@/lib/types';
import { UserIcon } from 'lucide-react';
import Image from 'next/image';

export default function UserCard({ user }: { user: User | undefined }) {
  return (
    <div className="flex flex-col items-center gap-2 relative">
      {/* <div className="absolute -top-1 -left-50 rounded-full w-[110px] h-[110px] bg-red-500 -z-1" /> */}
      {user?.image ? (
        <>
          <Image
            src={user.image}
            // src="/avatar.png"
            width={100}
            height={100}
            alt="Avatar"
            className="overflow-hidden rounded-full z-0"
          />
          <p className="text-2xl font-bold">
            Hi,
            <span className="text-red-500 text-4xl mx-2">
              {user.name?.split(' ')[0]}
            </span>
            {`:)`}
          </p>
          <p className="text-sm font-normal">Welcome to a Easier Life!</p>
        </>
      ) : (
        <Image
          src="/avatar.webp"
          width={150}
          height={150}
          alt="Avatar"
          className="overflow-hidden rounded-full"
        />
      )}
    </div>
  );
}
