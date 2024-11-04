import Link from 'next/link';

import { tagClass } from './cards';
import { Shortcut } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function CardShortcuts({
  shortcutsItems
}: {
  shortcutsItems: Shortcut[];
}) {
  // On Bucket List Get Colores must be only one function (export)
  // Colors here

  return (
    <>
      <div className="relative w-full p-4 sm:border sm:border-slate-300 sm:border-dashed">
        <div className="flex flex-wrap">
          {shortcutsItems.map((item: Shortcut) => (
            <div key={item.id}>
              <p
                className="text-sm sm:text-base px-4 py-1 font-semibold"
                // style={getColorCodes(item.category)}
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>
        <div className={tagClass}>Shortcuts</div>
        <Button
          variant="ghost"
          className="absolute bottom-4 sm:bottom-4 right-6 sm:right-2 text-xs underline bg-white sm:bg-transparent p-1 h-4"
        >
          <Link href="/buclet-list">View All</Link>
        </Button>
      </div>
    </>
  );
}
