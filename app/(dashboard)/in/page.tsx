import { auth } from '@/lib/auth';
import In from './in';
import { getWeather } from '@/lib/weather.server';
import { getUserLocation } from '@/lib/location.server';

export default async function InPage() {
  const session = await auth();
  const user = session?.user;

  const location: any | null = await getUserLocation();

  let weather;
  if (location) {
    weather = await getWeather(location.city);
  }

  console.log('---  🚀 ---> | user:', user);
  console.log('---  🚀 ---> | location server:', location);
  console.log('---  🚀 ---> | weather server:', weather);

  return (
    <>
      {session ? (
        <In user={user} location={location} weather={weather} />
      ) : null}
    </>
  );
}
