import { type DriverDataMap } from '@/server-functions/api/get-session-driver-data';
import { DriverMarkers } from './driver-markers';
import { TrackSvg } from './track-svg';

interface TrackMapProps {
  trackRef: React.RefObject<SVGPathElement>;
  sessionDriverData: DriverDataMap;
  sessionStartTime: number;
}

export const TrackMap = ({ trackRef, sessionDriverData, sessionStartTime }: TrackMapProps) => {
  return (
    <TrackSvg ref={trackRef}>
      <DriverMarkers pathRef={trackRef} drivers={sessionDriverData} sessionStartTime={sessionStartTime} />
    </TrackSvg>
  );
};
