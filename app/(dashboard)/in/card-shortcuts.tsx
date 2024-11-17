import Link from 'next/link';

import { tagClass } from './cards';
import { Shortcut } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { getColorCode } from '@/lib/utils';

export default function CardShortcuts({
  shortcutsItems
}: {
  shortcutsItems: Shortcut[];
}) {
  return (
    <>
      <div className="relative w-full p-4 sm:border sm:border-slate-300 sm:border-dashed">
        <div className="flex flex-wrap gap-1">
          {shortcutsItems.map((el: Shortcut) => (
            <div key={el.id}>
              <Link href={el.url} target="_blank">
                <p
                  className="text-sm sm:text-base px-2 py-1 font-semibold"
                  style={getColorCode(el.category?.color ?? 'grey')}
                >
                  {el.shortcut}
                </p>
              </Link>
            </div>
          ))}
        </div>
        <div className={tagClass}>Shortcuts</div>
        <Button
          variant="ghost"
          className="absolute -bottom-2 sm:bottom-4 right-6 sm:right-2 text-xs underline underline-offset-4 bg-white sm:bg-transparent p-1 h-4"
        >
          <Link href="/shortcuts">View All</Link>
        </Button>
      </div>
    </>
  );
}
