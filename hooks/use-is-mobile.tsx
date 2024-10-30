import { useEffect, useState } from 'react';

export default function useIsMobile(breakpoint: number = 640) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, [breakpoint]);

  if (!mounted) return false;
  return isMobile;
}
