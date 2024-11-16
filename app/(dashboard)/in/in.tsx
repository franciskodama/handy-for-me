'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  ChevronsUpDown,
  CircleHelp,
  MoveUpRight,
  Terminal
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  BucketListItem,
  LocationProps,
  Shortcut,
  User,
  VisualBoardItem
} from '@/lib/types';
import { CardWeather } from './card-weather';
import CardUser from './card-user';
import { CardFunFact } from './card-fun-fact';
import CardVisionBoard from './card-vision-board';
import CardBucketList from './card-bucket-list';
import CardShortcuts from './card-shortcuts';
import CardEmpty from './card-empty';
import CardDivulgation from './card-divulgation';
import CardDivulgationHelp from './card-divulgation-help';
import ExplanationIn from './explanation-in';
import Help from '@/components/Help';

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
  const [openAction, setOpenAction] = useState(false);

  return (
    <Card className="relative">
      <CardHeader className="sm:mb-12">
        <CardTitle className="flex justify-between items-center gap-2">
          <p>Dashboard</p>
          {!openAction ? <Help setOpenAction={setOpenAction} /> : <div />}
        </CardTitle>
        <CardDescription>
          Everything you need, right at your fingertips.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
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
        </AnimatePresence>

        {!openAction ? <CardDivulgationHelp /> : null}

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
                  <CardEmpty
                    title="Weather"
                    description="Ops... Weather data is out of reach. 👻 Check back soon!"
                  />
                )}
              </div>
            </div>
          </>

          {/* ----------------------- Second Row ----------------------- */}

          <div className="flex flex-col sm:flex-row w-full gap-24 sm:gap-8 my-12">
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
              {shortcutsItems.length > 0 ? (
                <CardShortcuts shortcutsItems={shortcutsItems} />
              ) : (
                <CardEmpty
                  title="Shortcuts"
                  description="No shortcuts saved yet? Add your top links here!"
                  buttonText="Create My First Shortcut"
                  url="shortcuts"
                />
              )}
            </div>

            <div className="flex justify-center sm:w-1/3">
              {bucketListItems.length > 0 ? (
                <CardBucketList bucketListItems={bucketListItems} />
              ) : (
                <CardEmpty
                  title="Bucket List"
                  description="Add adventures to your Bucket List and watch them show up here!"
                  buttonText="Build My Bucket List"
                  url="bucket-list"
                />
              )}
            </div>
          </div>

          {/* ----------------------- Divulgation Row ----------------------- */}

          <div className="flex flex-col sm:flex-row w-full gap-24 sm:gap-8 my-12">
            <div className="flex justify-center sm:w-1/3">
              <CardDivulgation
                feature={'Random Questions'}
                image={'/thumbnail/tn-random-questions.webp'}
                title={'Surprise Yourself!'}
                copy={
                  'Break the routine with unexpected questions to spark thought and conversation. Perfect for reflection or fun interactions!'
                }
                cta={'Get a Random Question'}
                url={'random-questions'}
              />
            </div>

            <div className="flex justify-center sm:w-1/3">
              <CardDivulgation
                feature={'Decision Helper'}
                image={'/thumbnail/tn-decision-helper.webp'}
                title={'Decisions Made Fun!'}
                copy={
                  'Let fate decide! Perfect for quick choices, big or small. Spin the wheel and see where it lands.'
                }
                cta={'Spin to Decide'}
                url={'decision-helper'}
              />
            </div>

            <div className="flex justify-center sm:w-1/3">
              <CardDivulgation
                feature={'Stoic Support'}
                image={'/thumbnail/tn-stoic-support.webp'}
                title={'Find Calm in the Chaos'}
                copy={
                  'Life’s challenges meet ancient wisdom. Discover tailored Stoic insights to help you tackle everyday issues with resilience.'
                }
                cta={'Show me Stoic Insights'}
                url={'stoic-support'}
              />
            </div>
          </div>

          {/* ----------------------- Third Row ----------------------- */}

          {visionBoardItems.length > 0 ? (
            <div className="flex flex-col sm:flex-row w-full gap-24 sm:gap-8 my-12">
              <CardVisionBoard visionBoardItems={visionBoardItems} />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row w-full gap-24 sm:gap-8 my-12">
              <CardEmpty
                title="Weekly Wins"
                description=" Stay focused, track progress, and celebrate your wins each week!"
                buttonText="Start Planning Now!"
                url="weekly-wins"
              />
            </div>
          )}

          {/* ----------------------- FOOTER ----------------------- */}
        </div>
      </CardContent>
    </Card>
  );
}
