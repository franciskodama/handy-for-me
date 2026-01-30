import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardWeather } from '../cards/card-weather';
import { CardFunFact } from '../cards/card-fun-fact';
import CardUser from '../cards/card-user';
import CardEmpty from '../cards/card-empty';
import { LocationProps, UserNameEmailImage } from '@/lib/types';

export default function DashboardTopSection({
  user,
  location,
  weather
}: {
  user: UserNameEmailImage | undefined;
  location: LocationProps | null;
  weather: any;
}) {
  return (
    <>
      {/* Mobile Tabs */}
      <Tabs defaultValue="user" className="w-full sm:hidden mb-8">
        <TabsList className="flex w-full justify-between mb-6">
          <TabsTrigger value="user">Hello!</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="fun-fact">Fun Fact</TabsTrigger>
        </TabsList>
        <TabsContent value="weather">
          {weather && location ? (
            <CardWeather location={location} weather={weather} />
          ) : (
            <p>No data</p>
          )}
        </TabsContent>
        <TabsContent value="fun-fact">
          <CardFunFact />
        </TabsContent>
        <TabsContent value="user">
          {user && <CardUser user={user} />}
        </TabsContent>
      </Tabs>

      {/* Desktop Grid */}
      <div className="hidden sm:flex flex-col sm:flex-row w-full justify-between gap-8 mb-12">
        <div className="sm:w-1/3">{user && <CardUser user={user} />}</div>
        <div className="sm:w-1/3">
          <CardFunFact />
        </div>
        <div className="sm:w-1/3">
          {weather && location ? (
            <CardWeather location={location} weather={weather} />
          ) : (
            <CardEmpty
              title="Weather"
              description="Ops... Weather data is out of reach. 👻 Check back soon!"
            />
          )}
        </div>
      </div>
    </>
  );
}
