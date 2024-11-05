'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BucketListItem,
  LocationProps,
  Shortcut,
  User,
  VisualBoardItem
} from '@/lib/types';
import { kumbh_sans } from '@/app/ui/fonts';
import { CardWeather } from './card-weather';
import CardUser from './card-user';
import { CardFunFact } from './card-fun-fact';
import CardVisionBoard from './card-vision-board';
import CardBucketList from './card-bucket-list';
import CardShortcuts from './card-shortcuts';

export default function In({
  user,
  location,
  weather,
  visionBoardItems,
  bucketListItems,
  shortcutsItems
}: {
  user: User | undefined;
  location: LocationProps | null;
  weather: any;
  visionBoardItems: VisualBoardItem[];
  bucketListItems: BucketListItem[];
  shortcutsItems: Shortcut[];
}) {
  // const [openAction, setOpenAction] = useState(false);

  return (
    <Card>
      <CardHeader className="sm:mb-12">
        <CardTitle className="flex justify-between items-center gap-2">
          <p>Dashboard</p>
          {/* {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />} */}
        </CardTitle>
        <CardDescription>
          Everything you need, right at your fingertips.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* <AnimatePresence>
          {openAction ? (
            <motion.div
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            >
              <div className="mb-12">
                <ExplanationIn setOpenAction={setOpenAction} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence> */}

        {/* ----------------------- Main Container ----------------------- */}
        <div className="flex flex-col gap-4">
          {/* -----------------------  First Row ----------------------- */}

          <>
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

            <div className="hidden sm:flex flex-col sm:flex-row w-full justify-between gap-8 mb-12">
              <div className="sm:w-1/3">{user && <CardUser user={user} />}</div>
              <div className="sm:w-1/3">
                <CardFunFact />
              </div>
              <div className="sm:w-1/3">
                {weather && location ? (
                  <CardWeather location={location} weather={weather} />
                ) : (
                  <p>No data</p>
                )}
              </div>
            </div>
          </>

          {/* ----------------------- Second Row ----------------------- */}
          <div className="flex flex-col sm:flex-row w-full gap-24 sm:gap-8 mb-12">
            <div className="flex justify-center sm:w-1/3">
              {visionBoardItems ? (
                <CardVisionBoard visionBoardItems={visionBoardItems} />
              ) : (
                <p>No data</p>
              )}
            </div>
            <div className="flex justify-center sm:w-1/3">
              {shortcutsItems ? (
                <CardShortcuts shortcutsItems={shortcutsItems} />
              ) : (
                <p>No data</p>
              )}
            </div>
            <div className="flex justify-center sm:w-1/3">
              {visionBoardItems ? (
                <CardBucketList bucketListItems={bucketListItems} />
              ) : (
                <p>No data</p>
              )}
            </div>
          </div>

          {/* ----------------------- Third Row ----------------------- */}

          <p
            className={`${kumbh_sans.className} uppercase font-bold text-xl leading-none mt-4`}
          >
            fermentum
          </p>
          <div className="flex flex-col sm:flex-row w-full justify-between gap-8">
            <div className="stripe-border flex flex-col sm:w-1/3 items-center h-[10em] p-4">
              <p>
                Vivamus elementum, eros quis varius fermentum. Vivamus
                elementum, eros quis varius fermentum. Vivamus elementum, eros
                quis varius fermentum. Vivamus elementum, eros quis varius
                fermentum. Pellentesque est ante
              </p>
            </div>
            <div className="stripe-border flex flex-col sm:w-1/3 items-center h-[10em] p-4">
              <p>
                Etiam nec mi non felis dapibus aliquam. Nullam tempus odio eget
                euismod semper.{' '}
              </p>
            </div>
            <div className="stripe-border flex flex-col sm:w-1/3 items-center h-[10em] p-4">
              <p className="hidden sm:block">
                Praesent ante est, facilisis at commodo sit amet, efficitur id
                diam. Mauris tristique sem consequat, aliquam est eu, sodales
                nisi. Vivamus elementum, eros quis varius fermentum.{' '}
              </p>
            </div>
          </div>

          {/* ----------------------- FOOTER ----------------------- */}
        </div>
      </CardContent>
    </Card>
  );
}
