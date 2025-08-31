'use client';

import { DriverMarkers } from './driver-markers';
import { TrackSvg } from './track-svg';
import { useRef } from 'react';

export const TrackMap = () => {
  const trackRef = useRef<SVGPathElement | null>(null);

  return (
    <TrackSvg ref={trackRef as React.RefObject<SVGPathElement>}>
      <DriverMarkers pathRef={trackRef as React.RefObject<SVGPathElement>} />
    </TrackSvg>
  );
};
