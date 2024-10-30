import Image from 'next/image';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { LocationProps, User } from '@/lib/types';
import { CloudSun, Sun, ThermometerSun } from 'lucide-react';

export default function UserCard({ user }: { user: User | undefined }) {
  return (
    <div className="flex flex-col items-center gap-2 relative">
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
  return (
    <>
      {/* <Card> */}
      {/* <CardHeader> */}
      {/* <CardTitle>Weather</CardTitle> */}
      {/* <CardDescription>Card Description<ss/CardDescription> */}
      {/* </CardHeader> */}
      {/* <CardContent className="flex flex-col gap-4"> */}
      <div className="flex flex-col gap-4 border border-dashed border-slate-300">
        <div className="flex pt-4">
          <div className="flex flex-col items-center w-1/2">
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
              <div className="flex font-semibold text-base mb-2">
                {weather.main ? (
                  <p>{`${Math.trunc(weather.main.temp)} °C`}</p>
                ) : null}
              </div>

              <h4 className="text-xs">Feels like</h4>
              <div className="flex font-semibold text-base">
                {weather.main ? (
                  <p>{`${Math.trunc(weather.main.feels_like)} °C`}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <h2 className="font-semibold text-2xl capitalize pb-8">
          {weather.weather[0].description}
        </h2>

        <div className="flex justify-between">
          <div>
            <h4 className="text-xs">Wind</h4>
            <p className="font-semibold text-base capitalize">{`${weather.wind.speed} km/h`}</p>
          </div>

          <div>
            <h4 className="text-xs">Pressure</h4>
            <p className="font-semibold text-base capitalize">{`${weather.main.pressure} kPa`}</p>
          </div>

          <div>
            <h4 className="text-xs">Humidity</h4>
            <p className="font-semibold text-base capitalize">{`${weather.main.humidity} %`}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <h4 className="text-xs">Visibility</h4>
            <p className="font-semibold text-base capitalize">{`${weather.visibility} Km`}</p>
          </div>

          <div>
            <h4 className="text-xs">Sunrise</h4>
            <div className="flex gap-1 font-semibold text-base capitalize">
              <p>
                {weather.sys ? (
                  <p>
                    {new Date(
                      weather.sys.sunrise * 6000 - weather.timezone * 1000
                    )
                      .toString()
                      .slice(17, 21)}
                  </p>
                ) : null}
              </p>
              <p>a.m.</p>
            </div>
          </div>

          <div>
            <h4>Sunset</h4>
            <div className="flex gap-1 font-semibold text-base capitalize">
              {weather.sys ? (
                <p>
                  {new Date(
                    weather.sys.sunrise * 6000 - weather.timezone * 1000
                  )
                    .toString()
                    .slice(17, 21)}
                </p>
              ) : null}
              <p>p.m.</p>
            </div>
          </div>
        </div>

        {/* <div>
                  <h4>Updated on</h4>
                  <h3>
                    {new Date(weather.dt * 1000 - weather.timezone * 6000)
                      .toString()
                      .slice(4)}
                  </h3>
                </div> */}
      </div>
      {/* <CardFooter className="flex justify-between items-start"> */}
      <div className="flex justify-between items-start mt-8">
        <div className="flex flex-col gap-2 font-base">
          <p className="font-bold">{location?.city}</p>
          {/* <p>{location?.region}</p> */}
          <p>{location?.country}</p>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <div>
            Longitude
            <p className="font-semibold">
              {weather.coord ? <p>{weather.coord.lon}</p> : null}
            </p>
          </div>
          <div>
            Latitude
            <p className="font-semibold">
              {weather.coord ? <p>{weather.coord.lat}</p> : null}
            </p>
          </div>
        </div>
      </div>
      {/* </Card> */}
    </>
  );
}

export function FunFactCard() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Fun Fact </CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center w-1/2">
            <AspectRatio ratio={16 / 10}>
              <Image
                src={`/waiting.webp`}
                alt="Fun fact of the Day"
                className="object-cover"
                priority
                fill
                sizes="(max-width: 500px) 100vw"
              />
            </AspectRatio>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-start">
          <div className="flex flex-col gap-2 font-base">TEst</div>
        </CardFooter>
      </Card>
    </>
  );
}

export function CardWeatherWithAccordion({
  location,
  weather
}: {
  location: LocationProps | null;
  weather: any;
}) {
  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            {/* <CloudSun size={24} strokeWidth={1.8} /> */}
            Weather
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              {/* <CardHeader> */}
              {/* <CardTitle>Weather</CardTitle> */}
              {/* <CardDescription>Card Description<ss/CardDescription> */}
              {/* </CardHeader> */}
              <CardContent className="flex flex-col gap-4">
                <div className="flex pt-4">
                  <div className="flex flex-col items-center w-1/2">
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
                      <div className="flex font-semibold text-base mb-2">
                        {weather.main ? (
                          <p>{`${Math.trunc(weather.main.temp)} °C`}</p>
                        ) : null}
                      </div>

                      <h4 className="text-xs">Feels like</h4>
                      <div className="flex font-semibold text-base">
                        {weather.main ? (
                          <p>{`${Math.trunc(weather.main.feels_like)} °C`}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="font-semibold text-2xl capitalize pb-8">
                  {weather.weather[0].description}
                </h2>

                <div className="flex justify-between">
                  <div>
                    <h4 className="text-xs">Wind</h4>
                    <p className="font-semibold text-base capitalize">{`${weather.wind.speed} km/h`}</p>
                  </div>

                  <div>
                    <h4 className="text-xs">Pressure</h4>
                    <p className="font-semibold text-base capitalize">{`${weather.main.pressure} kPa`}</p>
                  </div>

                  <div>
                    <h4 className="text-xs">Humidity</h4>
                    <p className="font-semibold text-base capitalize">{`${weather.main.humidity} %`}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <h4 className="text-xs">Visibility</h4>
                    <p className="font-semibold text-base capitalize">{`${weather.visibility} Km`}</p>
                  </div>

                  <div>
                    <h4 className="text-xs">Sunrise</h4>
                    <div className="flex gap-1 font-semibold text-base capitalize">
                      <p>
                        {weather.sys ? (
                          <p>
                            {new Date(
                              weather.sys.sunrise * 6000 -
                                weather.timezone * 1000
                            )
                              .toString()
                              .slice(17, 21)}
                          </p>
                        ) : null}
                      </p>
                      <p>a.m.</p>
                    </div>
                  </div>

                  <div>
                    <h4>Sunset</h4>
                    <div className="flex gap-1 font-semibold text-base capitalize">
                      {weather.sys ? (
                        <p>
                          {new Date(
                            weather.sys.sunrise * 6000 - weather.timezone * 1000
                          )
                            .toString()
                            .slice(17, 21)}
                        </p>
                      ) : null}
                      <p>p.m.</p>
                    </div>
                  </div>
                </div>

                {/* <div>
                  <h4>Updated on</h4>
                  <h3>
                    {new Date(weather.dt * 1000 - weather.timezone * 6000)
                      .toString()
                      .slice(4)}
                  </h3>
                </div> */}
              </CardContent>
              <CardFooter className="flex justify-between items-start">
                <div className="flex flex-col gap-2 font-base">
                  <p className="font-bold">{location?.city}</p>
                  {/* <p>{location?.region}</p> */}
                  <p>{location?.country}</p>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  <div>
                    Longitude
                    <p className="font-semibold">
                      {weather.coord ? <p>{weather.coord.lon}</p> : null}
                    </p>
                  </div>
                  <div>
                    Latitude
                    <p className="font-semibold">
                      {weather.coord ? <p>{weather.coord.lat}</p> : null}
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
