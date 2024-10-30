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
import { LocationProps } from '@/lib/types';

export function CardWeather({
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
          <AccordionTrigger>Weather</AccordionTrigger>
          <AccordionContent>
            <Card>
              {/* <CardHeader> */}
              {/* <CardTitle>Weather</CardTitle> */}
              {/* <CardDescription>Card Description<ss/CardDescription> */}
              {/* </CardHeader> */}
              <CardContent className="flex">
                <div className="flex flex-col items-center w-3/5">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={`/weather/${weather.weather[0].icon}.png`}
                      alt={weather.weather[0].description}
                      className="object-cover rounded-sm border-primary"
                      priority
                      fill
                      sizes="(max-width: 500px) 100vw"
                    />
                  </AspectRatio>
                  <p>{weather.weather[0].description}</p>
                </div>

                <div>
                  <div>
                    <h4>Feels like</h4>
                    <h3>
                      {weather.main ? (
                        <p>{Math.trunc(weather.main.feels_like)}</p>
                      ) : null}
                    </h3>
                  </div>
                  <h5>°C</h5>

                  <div>
                    <h4>Current weather</h4>
                    <h3>
                      {weather.main ? (
                        <p>{Math.trunc(weather.main.temp)}°C</p>
                      ) : null}
                    </h3>
                  </div>
                  <div>
                    <h4>Wind</h4>
                    <h3>{weather.wind ? <p>{weather.wind.speed}</p> : null}</h3>
                    <h5>km/h</h5>
                  </div>

                  <div>
                    <h4>Pressure</h4>
                    <h3>
                      {weather.main ? <p>{weather.main.pressure}</p> : null}
                    </h3>
                    <h5>kPa</h5>
                  </div>

                  <div>
                    <h4>Humidity</h4>
                    <h3>
                      {weather.main ? <p>{weather.main.humidity}</p> : null}
                    </h3>
                    <h5>%</h5>
                  </div>

                  <div>
                    <h4>Visibility</h4>
                    <p>{weather.visibility}</p>
                    <h5>km</h5>
                  </div>

                  <div>
                    <h4>Sunrise</h4>
                    <h3>
                      {weather.sys ? (
                        <p>
                          {new Date(
                            weather.sys.sunrise * 6000 - weather.timezone * 1000
                          )
                            .toString()
                            .slice(17, 21)}
                        </p>
                      ) : null}
                    </h3>
                    <h5>a.m.</h5>
                  </div>

                  <div>
                    <h4>Sunset</h4>
                    <h3>
                      {weather.sys ? (
                        <p>
                          {new Date(
                            weather.sys.sunrise * 6000 - weather.timezone * 1000
                          )
                            .toString()
                            .slice(17, 21)}
                        </p>
                      ) : null}
                    </h3>
                    <h5>p.m.</h5>
                  </div>

                  <div>
                    <h4>Updated on</h4>
                    <h3>
                      {new Date(weather.dt * 1000 - weather.timezone * 6000)
                        .toString()
                        .slice(4)}
                    </h3>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-start">
                <div className="flex flex-col gap-2 font-base">
                  <p className="font-bold">{location?.city}</p>
                  {/* <p>{location?.region}</p> */}
                  <p>{location?.country}</p>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  <div>
                    Longitude{' '}
                    {weather.coord ? <p>{weather.coord.lon}</p> : null}
                  </div>
                  <div>
                    Latitude {weather.coord ? <p>{weather.coord.lat}</p> : null}
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
