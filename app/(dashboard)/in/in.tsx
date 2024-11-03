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
import { LocationProps, User, VisualBoardItem } from '@/lib/types';
import { kumbh_sans } from '@/app/ui/fonts';
import { CardWeather } from './card-weather';
import CardUser from './card-user';
import { CardFunFact } from './card-fun-fact';
import CardVisionBoard from './card-vision-board';

export default function In({
  user,
  location,
  weather,
  visionBoardItems
}: {
  user: User | undefined;
  location: LocationProps | null;
  weather: any;
  visionBoardItems: VisualBoardItem[];
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
              <TabsList className="flex w-full justify-between mb-4">
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
          <div className="sm:flex flex-col sm:flex-row w-full gap-8 mb-12">
            <div className="sm:w-1/3">
              {visionBoardItems ? (
                <CardVisionBoard visionBoardItems={visionBoardItems} />
              ) : (
                <p>No data</p>
              )}
            </div>
            <div className="flex justify-center sm:w-1/3">
              {/* <CardVisionBoard visionBoardItems={visionBoardItems} /> */}
            </div>
            <div className="flex justify-center sm:w-1/3">
              {/* <CardVisionBoard visionBoardItems={visionBoardItems} /> */}
            </div>
          </div>

          {/* ----------------------- Second Row ----------------------- */}
          <div className="flex flex-col sm:flex-row w-full justify-between gap-8">
            <div className="flex items-center justify-between sm:w-1/3 border border-dashed border-slate-300 p-4">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Affirmation
              </h3>
              <p className="hidden sm:block">Donec sapien mi, fermentum et</p>
              <ChevronsUpDown size={24} strokeWidth={1.8} />
            </div>
            <div className="flex items-center justify-between sm:w-1/3 border border-dashed border-slate-300 p-4">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Pellentesque
              </h3>
              <p className="hidden sm:block">Mauris tristique sem consequat</p>
              <ChevronsUpDown size={24} strokeWidth={1.8} />
            </div>
            <div className="flex items-center justify-between sm:w-1/3 border border-dashed border-slate-300 p-4">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Donec
              </h3>
              <p className="hidden sm:block">
                Pellentesque est ante, porttitor
              </p>
              <ChevronsUpDown size={24} strokeWidth={1.8} />
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
              <p>Pellentesque est ante</p>
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

          {/* ----------------------- Fourth Row ----------------------- */}
          <p
            className={`${kumbh_sans.className} uppercase font-bold text-xl leading-none mt-4`}
          >
            ultricies
          </p>
          <div className="flex flex-col sm:flex-row w-full justify-between gap-8">
            <div className="flex items-start justify-between sm:w-1/3 border border-dashed border-slate-300 p-4 h-[10em]">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Title
              </h3>
            </div>
            <div className="flex items-start justify-between sm:w-1/3 border border-dashed border-slate-300 p-4 h-[10em]">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Title
              </h3>
            </div>
            <div className="flex flex-col items-start gap-4 sm:w-1/3 border border-dashed border-slate-300 p-4 h-[10em]">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Title
              </h3>
              <p className="hidden sm:block">
                Praesent ante est, facilisis at commodo sit amet, efficitur id
                diam. Mauris tristique sem consequat, aliquam est eu, sodales
                nisi. Vivamus elementum, eros quis varius fermentum.{' '}
              </p>
            </div>
          </div>

          {/* ----------------------- Fiveth Row ----------------------- */}
          <p
            className={`${kumbh_sans.className} uppercase font-bold text-xl leading-none mt-4`}
          >
            aliquam
          </p>
          <div className="flex flex-col sm:flex-row w-full justify-between gap-8">
            <div className="flex items-start justify-between sm:w-1/3 border border-dashed border-slate-300 p-4 h-[10em]">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Title
              </h3>
            </div>
            <div className="flex items-start justify-between sm:w-1/3 border border-dashed border-slate-300 p-4 h-[10em]">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Title
              </h3>
            </div>
            <div className="flex items-start justify-between sm:w-1/3 border border-dashed border-slate-300 p-4 h-[10em]">
              <h3
                className={`${kumbh_sans.className} uppercase font-bold text-lg leading-none`}
              >
                Title
              </h3>
            </div>
          </div>

          {/* ----------------------- Sixth Row ----------------------- */}

          <p
            className={`${kumbh_sans.className} uppercase font-bold text-xl leading-none mt-4`}
          >
            elementum
          </p>
          <div className="flex flex-col sm:flex-row w-full justify-between gap-8">
            <div className="stripe-border flex flex-col sm:w-1/3 items-center h-[10em] p-4">
              <p>Box</p>
            </div>
            <div className="stripe-border flex flex-col sm:w-1/3 items-center h-[10em] p-4">
              <p>Box</p>
            </div>
            <div className="stripe-border flex flex-col sm:w-1/3 items-center h-[10em] p-4">
              <p>Box</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
