import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { useEffect, useRef } from 'react';

// The hook that controls the playback of a session. It creates an animation frame loop that calls the tick function on every animation frame and returns a start and stop function to control the playback.
export const useRacePlayback = () => {
  const animationFrameId = useRef<number | null>(null);
  const lastTimestamp = useRef<number | null>(null);

  const tick = useSessionTimeLineStore((state) => state.tick);

  // The loop function that is called on every animation frame
  const loop = (timestamp: number) => {
    if (!lastTimestamp.current) {
      lastTimestamp.current = timestamp;
    }

    const deltaTime = timestamp - lastTimestamp.current;
    lastTimestamp.current = timestamp;

    tick(deltaTime);

    animationFrameId.current = requestAnimationFrame(loop);
  };

  // Cleanup the animation frame when the component unmounts
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return {
    start: () => {
      // Reset the last timestamp to start the loop from the beginning
      lastTimestamp.current = null;
      animationFrameId.current = requestAnimationFrame(loop);
    },
    stop: () => {
      // Cancel the animation frame and reset the animation frame id
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    },
  };
};
