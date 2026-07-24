'use client';

import React, { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menuItems } from '@/lib/menu';
import { useBreadcrumb } from './breadcrumb-context';

function formatSegmentLabel(segment: string): string {
  // Check if string resembles a UUID / ID
  if (
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      segment
    ) ||
    /^[0-9a-fA-F]{8}-/.test(segment)
  ) {
    return 'Board';
  }
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const { labels } = useBreadcrumb();

  if (!pathname || pathname === '/dashboard' || pathname === '/') {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);
  let currentPath = '';

  const breadcrumbItems = segments.map((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // 1. Check custom labels set by page via context
    let label = labels[currentPath] || labels[segment];

    // 2. Check matching menu items from menu configuration
    if (!label) {
      const menuItem = menuItems.find((item) => item.href === currentPath);
      if (menuItem) {
        label = menuItem.label;
      }
    }

    // 3. Fallback formatting
    if (!label) {
      label = formatSegmentLabel(segment);
    }

    return {
      href: currentPath,
      label,
      isLast
    };
  });

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.map((item) => (
          <Fragment key={item.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
