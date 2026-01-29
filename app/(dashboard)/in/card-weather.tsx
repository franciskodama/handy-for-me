'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { LocationProps } from '@/lib/types';
import { tagClass } from './cards';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export function CardWeather({
  location,
  weather
}: {
  location: LocationProps | null;
  weather: any;
}) {
  const [sunriseTime, setSunriseTime] = useState<string>('');
  const [sunsetTime, setSunsetTime] = useState<string>('');

  useEffect(() => {
    if (weather?.sys?.sunrise) {
      setSunriseTime(
        new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      );
    }
    if (weather?.sys?.sunset) {
      setSunsetTime(
        new Date(weather.sys.sunset * 1000).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      );
    }
  }, [weather]);

  return (
    <>
      <div className="relative flex flex-col sm:flex-row gap-4 bg-muted p-6 pt-10 sm:pt-6 sm:bg-transparent sm:border sm:border-slate-300 sm:border-dashed">
        <div className="flex sm:flex-col justify-around sm:w-1/2">
          <div className="flex w-full">
            <div className="flex flex-col items-center justify-center w-1/2">
              <AspectRatio ratio={16 / 12}>
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
            <div className="w-1/3 sm:w-1/2">
              <h4 className="text-xs">Sunrise</h4>
              <div className="flex gap-1 font-semibold text-base capitalize">
                {weather.sys ? <p>{sunriseTime}</p> : null}
              </div>
            </div>
            <div className="w-1/3 sm:w-1/2">
              <h4 className="text-xs">Sunset</h4>
              <div className="flex gap-1 font-semibold text-base capitalize">
                {weather.sys ? <p>{sunsetTime}</p> : null}
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
