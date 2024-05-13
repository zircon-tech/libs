'use client'
import { useEffect, useState } from 'react';

/**
 * A React hook that provides the current screen size.
 *
 * This hook returns an object with four properties: `isSmall`, `isMedium`, `isLarge`, and `isXL`.
 * Each property is a boolean that indicates whether the current screen width falls within a certain range.
 * The ranges are defined as follows:
 * - `isSmall`: width < 768px
 * - `isMedium`: 768px <= width < 1024px
 * - `isLarge`: 1024px <= width < 1280px
 * - `isXL`: width >= 1280px
 *
 * @returns {Object} An object with properties `isSmall`, `isMedium`, `isLarge`, and `isXL`.
 *
 * @example
 * const { isSmall, isMedium, isLarge, isXL } = useScreenSize();
 */
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<{
    isSmall?: boolean;
    isMedium?: boolean;
    isLarge?: boolean;
    isXL?: boolean;
  }>({
    isSmall: undefined,
    isMedium: undefined,
    isLarge: undefined,
    isXL: undefined,
  });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      const isSmall = width < 768;
      const isMedium = width >= 768 && width < 1024;
      const isLarge = width >= 1024 && width < 1280;
      const isXL = width >= 1280;
      setScreenSize({
        isSmall,
        isMedium,
        isLarge,
        isXL,
      });
    });

    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return screenSize;
};

export default useScreenSize;
