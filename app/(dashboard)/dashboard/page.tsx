import { auth } from '@/lib/auth';
import DashboardView from './view';
import { getWeather } from '@/lib/weather.server';
import { getUserLocation } from '@/lib/location.server';
import { getBucketListItems } from '@/lib/actions/bucket-list';
import { getShortcuts } from '@/lib/actions/shortcuts';
import { getVisualBoardItems } from '@/lib/actions/visual-board';
import { getHabits } from '@/lib/actions/habits';
import SignInPrompt from '@/components/SignInPrompt';

import { LocationProps } from '@/lib/types';

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  if (!session) {
    return <SignInPrompt />;
  }

  const [visionBoardItems, bucketListItems, shortcutsItems, habits, location] =
    await Promise.all([
      getVisualBoardItems(user?.email ?? ''),
      getBucketListItems(user?.email ?? ''),
      getShortcuts(user?.email ?? ''),
      getHabits(user?.email ?? ''),
      getUserLocation() as Promise<LocationProps | null>
    ]);

  let weather;
  if (location) {
    weather = await getWeather(location.city);
  }

  return (
    <DashboardView
      user={user}
      location={location}
      weather={weather}
      visionBoardItems={visionBoardItems || []}
      bucketListItems={bucketListItems || []}
      shortcutsItems={shortcutsItems || []}
      habits={habits || []}
    />
  );
}
