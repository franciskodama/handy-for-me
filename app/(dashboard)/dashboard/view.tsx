import { Card, CardContent } from '@/components/ui/card';
import {
  BucketListItem,
  LocationProps,
  Shortcut,
  UserNameEmailImage,
  VisualBoardItem
} from '@/lib/types';
import DashboardHeader from './components/sections/header';
import DashboardTopSection from './components/sections/top-section';
import DashboardWidgets from './components/sections/widgets';
import DashboardFeatureHighlights from './components/sections/highlights';

export default function DashboardView({
  user,
  location,
  weather,
  visionBoardItems,
  bucketListItems,
  shortcutsItems
}: {
  user: UserNameEmailImage | undefined;
  location: LocationProps | null;
  weather: any;
  visionBoardItems: VisualBoardItem[];
  bucketListItems: BucketListItem[];
  shortcutsItems: Shortcut[];
}) {
  return (
    <Card className="relative min-h-[75vh]">
      <DashboardHeader />
      <CardContent>
        <div className="flex flex-col gap-4">
          <DashboardTopSection
            user={user}
            location={location}
            weather={weather}
          />

          <DashboardWidgets
            visionBoardItems={visionBoardItems}
            bucketListItems={bucketListItems}
            shortcutsItems={shortcutsItems}
          />

          <DashboardFeatureHighlights />
        </div>
      </CardContent>
    </Card>
  );
}
