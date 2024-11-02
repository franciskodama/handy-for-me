import Image from 'next/image';
import { useEffect, useState } from 'react';

import { funFacts } from './fun-facts';
import { Button } from '@/components/ui/button';
import { LocationProps, User } from '@/lib/types';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const tagClass =
  'absolute -top-1 left-6 sm:-top-3 sm:-left-3 p-1 px-2 bg-primary text-white text-xs font-semibold';

export default function UserCard({ user }: { user: User | undefined }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 relative mt-16 sm:mt-0 mb-8">
      {user?.image ? (
        <>
          <Image
            src={user.image || '/avatar.png'}
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
          <p className="text-sm font-normal">Welcome to an Easier Life!</p>
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

export function WeatherCard({
  location,
  weather
}: {
  location: LocationProps | null;
  weather: any;
}) {
  const timezone = weather.timezone;
  console.log('---  🚀 ---> | timezone:', timezone);

  console.log({
    rawSunrise: weather.sys.sunrise,
    timezone: weather.timezone,
    localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  return (
    <>
      <div className="relative flex flex-col sm:flex-row gap-4 bg-muted p-6 pt-10 sm:pt-6 sm:bg-transparent sm:border sm:border-slate-300 sm:border-dashed">
        <div className="flex sm:flex-col justify-around sm:w-1/2">
          <div className="flex w-full">
            <div className="flex flex-col items-center justify-center w-1/2">
              <AspectRatio ratio={16 / 10}>
                <Image
                  src={`/weather/${weather.weather[0].icon}.png`}
                  alt={weather.weather[0].description}
                  className="object-cover"
                  priority
                  fill
                  sizes="(max-width: 500px) 100vw"
                />
              </AspectRatio>
            </div>
            <div className="w-1/2 flex justify-center">
              <div className="flex flex-col items-left">
                <h4 className="text-xs">Temperature</h4>
                <div className="flex font-semibold text-xl mb-2">
                  {weather.main ? (
                    <p>{`${Math.trunc(weather.main.temp)} °C`}</p>
                  ) : null}
                </div>

                <h4 className="text-xs">Feels like</h4>
                <div className="flex font-semibold text-xl">
                  {weather.main ? (
                    <p>{`${Math.trunc(weather.main.feels_like)} °C`}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <h2 className="hidden sm:block font-semibold text-2xl capitalize text-center mt-4">
            {weather.weather[0].description}
          </h2>
        </div>
        <h2 className="sm:hidden font-semibold text-3xl capitalize pb-8 text-center sm:text-left">
          {weather.weather[0].description}
        </h2>

        <div className="flex flex-col gap-4 sm:w-1/2 sm:ml-8">
          <div className="flex justify-around w-full">
            <div className="w-1/3 sm:w-1/2">
              <h4 className="text-xs">Wind</h4>
              <p className="font-semibold text-base capitalize">{`${weather.wind.speed} km/h`}</p>
            </div>

            {/* <div className="w-1/3 sm:hidden">
              <h4 className="text-xs ">Pressure</h4>
              <p className="font-semibold text-base capitalize">{`${weather.main.pressure} kPa`}</p>
            </div> */}

            <div className="w-1/3 sm:w-1/2">
              <h4 className="text-xs">Humidity</h4>
              <p className="font-semibold text-base capitalize">{`${weather.main.humidity} %`}</p>
            </div>
          </div>

          <div className="flex justify-around w-full">
            {/* <div className="w-1/3 sm:hidden">
              <h4 className="text-xs">Visibility</h4>
              <p className="font-semibold text-base capitalize">{`${weather.visibility} Km`}</p>
            </div> */}
            <div className="w-1/3 sm:w-1/2">
              <h4 className="text-xs">Sunrise</h4>
              <div className="flex gap-1 font-semibold text-base capitalize">
                {weather.sys ? (
                  <p>
                    {new Date(weather.sys.sunrise * 1000).toLocaleTimeString(
                      'en-US',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        timeZone:
                          Intl.DateTimeFormat().resolvedOptions().timeZone
                      }
                    )}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="w-1/3 sm:w-1/2">
              <h4 className="text-xs">Sunset</h4>
              <div className="flex gap-1 font-semibold text-base capitalize">
                {weather.sys ? (
                  <p>
                    {new Date(weather.sys.sunset * 1000).toLocaleTimeString(
                      'en-US',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        timeZone:
                          Intl.DateTimeFormat().resolvedOptions().timeZone
                      }
                    )}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-start pt-8 w-full text-xs">
            <div className="w-1/3 font-bold">
              <p>{location?.city}</p>
              <p>{location?.country}</p>
            </div>
            <div className="w-1/3">
              <p>Longitude</p>
              <p>{weather.coord.lon}</p>
            </div>
            <div className="w-1/3">
              <p>Latitude</p>
              <p>{weather.coord.lat}</p>
            </div>
          </div>
        </div>
        <div className={tagClass}>Weather</div>
      </div>
    </>
  );
}

export function FunFactCard() {
  const [currentFact, setCurrentFact] = useState({
    start: 'Surprising Fact:',
    curiosity: 'Avocados are fruit, and they’re technically a berry!'
  });

  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    setCurrentFact(funFacts[randomIndex]);
  };

  useEffect(() => {
    getRandomFact();
  }, []);

  const numberOfGifsAvailable = 20;

  return (
    <>
      <div className="relative flex flex-col sm:flex-row gap-2 bg-muted px-6 py-8 pt-12 sm:pt-8 sm:bg-transparent sm:border sm:border-slate-300 sm:border-dashed ">
        <div className="flex flex-col items-start justify-between gap-2">
          <p className="text-base sm:text-sm">{currentFact.start}</p>
          <p className="text-2xl sm:text-xl font-bold sm:pr-4">
            {currentFact.curiosity}
          </p>
          <Button
            variant="link"
            className="hidden sm:block text-xs p-0 underline"
            onClick={getRandomFact}
          >
            Show Another Fun Fact
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="my-4 sm:my-0 sm:w-[10em]">
            <AspectRatio ratio={1 / 1}>
              <Image
                src={`/fun-fact/fun-fact-${Math.floor(Math.random() * numberOfGifsAvailable + 1)}.webp`}
                alt="Fun Fact Wow Image"
                className="object-cover"
                unoptimized
                priority
                fill
                sizes="(max-width: 500px) 100vw"
              />
            </AspectRatio>
          </div>
          <Button
            variant="outline"
            className="sm:hidden mt-2"
            onClick={getRandomFact}
          >
            Show Another Fun Fact
          </Button>
        </div>
        <div className={tagClass}>Fun Fact</div>
      </div>
    </>
  );
}
