import CardVisionBoard from './card-vision-board';
import CardShortcuts from './card-shortcuts';
import CardBucketList from './card-bucket-list';
import CardEmpty from './card-empty';
import { BucketListItem, Shortcut, VisualBoardItem } from '@/lib/types';

export default function DashboardWidgets({
  visionBoardItems,
  bucketListItems,
  shortcutsItems
}: {
  visionBoardItems: VisualBoardItem[];
  bucketListItems: BucketListItem[];
  shortcutsItems: Shortcut[];
}) {
  return (
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
  );
}
