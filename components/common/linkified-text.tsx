import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LinkifiedTextProps {
  text: string;
  className?: string;
  linkClassName?: string;
  stopPropagation?: boolean;
  showIcon?: boolean;
}

const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

export function LinkifiedText({
  text,
  className,
  linkClassName,
  stopPropagation = false,
  showIcon = true
}: LinkifiedTextProps) {
  if (!text) return null;

  const parts = text.split(URL_REGEX);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!part) return null;

        if (part.match(/^https?:\/\//i) || part.match(/^www\./i)) {
          // Strip trailing punctuation if accidentally captured (e.g., "https://site.com.")
          let cleanUrl = part;
          let trailingPunctuation = '';
          const matchPunctuation = cleanUrl.match(/[.,;:!)]+$/);
          if (matchPunctuation) {
            trailingPunctuation = matchPunctuation[0];
            cleanUrl = cleanUrl.slice(0, -trailingPunctuation.length);
          }

          let href = cleanUrl;
          if (href.toLowerCase().startsWith('www.')) {
            href = `https://${href}`;
          }

          // Security check: protocol must strictly be http: or https:
          try {
            const parsed = new URL(href);
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
              return <React.Fragment key={index}>{part}</React.Fragment>;
            }
          } catch {
            return <React.Fragment key={index}>{part}</React.Fragment>;
          }

          return (
            <React.Fragment key={index}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-0.5 text-primary underline underline-offset-2 hover:text-primary/80 transition-colors font-medium break-all',
                  linkClassName
                )}
                onClick={(e) => {
                  if (stopPropagation) {
                    e.stopPropagation();
                  }
                }}
              >
                <span>{cleanUrl}</span>
                {showIcon && (
                  <ExternalLink size={11} className="inline shrink-0 ml-0.5 opacity-80" />
                )}
              </a>
              {trailingPunctuation}
            </React.Fragment>
          );
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
