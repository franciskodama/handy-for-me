import { auth } from '@/lib/auth';
import In from './in';
import { getWeather } from '@/lib/weather.server';
import { getUserLocation } from '@/lib/location.server';
import { getBucketListItems } from '@/lib/actions/bucket-list';
import { getShortcuts } from '@/lib/actions/shortcuts';
import { getVisualBoardItems } from '@/lib/actions/visual-board';
import SignInPrompt from '@/components/SignInPrompt';

export default async function InPage() {
  const session = await auth();
  const user = session?.user;

  if (!session) {
    return <SignInPrompt />;
  }

  const location: any | null = await getUserLocation();

  let weather;
  if (location) {
    weather = await getWeather(location.city);
  }

  const visionBoardItems = await getVisualBoardItems(user?.email ?? '');
  const bucketListItems = await getBucketListItems(user?.email ?? '');
  const shortcutsItems = await getShortcuts(user?.email ?? '');

  return (
    <In
      user={user}
      location={location}
      weather={weather}
      visionBoardItems={visionBoardItems || []}
      bucketListItems={bucketListItems || []}
      shortcutsItems={shortcutsItems || []}
    />
  );
}
