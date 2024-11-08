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
import CardEmpty from './card-empty';

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
              {visionBoardItems.length > 0 ? (
                <CardVisionBoard visionBoardItems={visionBoardItems} />
              ) : (
                <CardEmpty
                  title="Vision Board"
                  description="Add goals to your Vision Board, and see them shine here!"
                  buttonText="Create My Vision Board"
                  url="vision-board"
                />
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

          {visionBoardItems.length > 0 ? (
            <CardVisionBoard visionBoardItems={visionBoardItems} />
          ) : (
            <CardEmpty
              title="Weekly Wins"
              description=" Stay focused, track progress, and celebrate your wins each week!"
              buttonText="Let's start this Week!"
              url="weekly-wins"
            />
          )}

          {/* ----------------------- FOOTER ----------------------- */}
        </div>
      </CardContent>
    </Card>
  );
}
