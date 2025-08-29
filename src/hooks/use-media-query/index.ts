'use client';

import { useEffect, useState } from 'react';

export type Breakpoints = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const twBreakpoints: Record<Breakpoints, string> = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
} as const;

/**
 * // Returns true when viewport width >= 768px (md)
 * const isMediumScreenOrLarger = useMediaQuery('md');
 */
export const useMediaQuery = (mediaQuery: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string) => {
  const [matches, setMatches] = useState<boolean>(false);

  let query;
  if (mediaQuery in twBreakpoints) {
    query = twBreakpoints[mediaQuery as Breakpoints];
  } else {
    query = mediaQuery;
  }

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set the matches state initially
    setMatches(media.matches);

    // Update the matches state when the media query changes when crossing a specific breakpoint
    const handleMediaChange = () => {
      setMatches(media.matches);
    };

    media.addEventListener('change', handleMediaChange);

    return () => {
      media.removeEventListener('change', handleMediaChange);
    };
  }, [query]);

  return matches;
};
