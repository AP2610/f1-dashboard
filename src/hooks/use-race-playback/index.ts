import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { useEffect, useRef } from 'react';

// The hook that controls the playback of a session. It creates an animation frame loop that calls the tick function on every animation frame and returns a start and stop function to control the playback.
export const useRacePlayback = () => {
  const animationFrameId = useRef<number | null>(null);
  const lastTimestamp = useRef<number | null>(null);

  const tick = useSessionTimeLineStore((state) => state.tick);
  const setIsPlaying = useSessionTimeLineStore((state) => state.setIsPlaying);

  // The loop function that is called on every animation frame
  const loop = (timestamp: number) => {
    if (!lastTimestamp.current) {
      lastTimestamp.current = timestamp;
    }

    // Calculate the delta time between the current timestamp and the last timestamp which is when the last frame was rendered
    const deltaTime = timestamp - lastTimestamp.current;

    // set the last timestamp to the current timestamp so we can calculate the delta time in the next frame
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

  // TODO: Add pause

  const start = () => {
    // Reset the last timestamp to start the loop from the beginning
    setIsPlaying(true);
    lastTimestamp.current = null;
    animationFrameId.current = requestAnimationFrame(loop);
  };

  const stop = () => {
    // Cancel the animation frame and reset the animation frame id
    if (animationFrameId.current) {
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  return {
    start,
    stop,
  };
};
