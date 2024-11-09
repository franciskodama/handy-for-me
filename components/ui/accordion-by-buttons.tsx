'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

const AccordionByButtons = AccordionPrimitive.Root;
const accordionTriggerClass =
  'inline-flex gap-2 items-center justify-between h-auto px-4 py-2 text-base font-semibold uppercase leading-normal mb-2 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white bg-primary shadow-[0_0px_0px_0px_inset,#FFF_-3px_3px_0_-1px,#0F1739_-3px_3px] transition-all duration-200 ease-in-out hover:border hover:border-primary hover:bg-accent hover:text-primary active:-translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0px_0px_0px_inset,#FFF_0px_0px_0_-1px,#000_0px_0px] [&[data-state=open]>svg]:rotate-180';
const accordionContentAsButtonClass =
  'inline-flex items-center justify-center w-full h-auto px-4 py-2 text-left text-sm font-semibold leading-normal border border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none transition-all duration-200 ease-in-out shadow-[0_0px_0px_0px_inset,#FFF_-3px_3px_0_-1px,#0F1739_-3px_3px] hover:bg-accent active:-translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0px_0px_0px_inset,#FFF_0px_0px_0_-1px,#000_0px_0px]';

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(`${accordionTriggerClass}`, className)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export {
  AccordionByButtons,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionContentAsButtonClass
};
