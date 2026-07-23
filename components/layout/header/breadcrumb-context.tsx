'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface BreadcrumbContextType {
  labels: Record<string, string>;
  setLabel: (pathOrKey: string, label: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  labels: {},
  setLabel: () => {}
});

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [labels, setLabels] = useState<Record<string, string>>({});

  const setLabel = useCallback((pathOrKey: string, label: string) => {
    setLabels((prev) => {
      if (prev[pathOrKey] === label) return prev;
      return { ...prev, [pathOrKey]: label };
    });
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ labels, setLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  return useContext(BreadcrumbContext);
}

export function useSetBreadcrumbTitle(label: string, pathOrKey?: string) {
  const pathname = usePathname();
  const { setLabel } = useBreadcrumb();
  const targetKey = pathOrKey || pathname;

  useEffect(() => {
    if (label && targetKey) {
      setLabel(targetKey, label);
    }
  }, [label, targetKey, setLabel]);
}
