'use client';

import { useSessionTimeLineStore } from '@/lib/stores/session-timeline-store';
import { useEffect, useRef } from 'react';

// controls the playback of a session. It creates an animation frame loop that calls the tick function on every animation frame and returns a start and stop function to control the playback.
export const useRacePlayback = () => {
  const animationFrameId = useRef<number | null>(null);
  const lastTimestamp = useRef<number | null>(null);

  // Avoid subscribing to the store to prevent rerendering when state changes, therefore using getState()
  const { tick, setIsPlaying } = useSessionTimeLineStore.getState();

  // The loop function that is called on every animation frame
  const loop = (timestamp: number) => {
    if (!lastTimestamp.current) {
      lastTimestamp.current = timestamp;
    }

    // i'm using deltaTime to calculate the amount of time that has passed since the last frame was rendered, then multiplying it by the playback speed to get the amount of time that has passed since the last frame was rendered.
    const deltaTime = timestamp - lastTimestamp.current;

    // set the last timestamp to the current timestamp so we can calculate the delta time in the next frame
    lastTimestamp.current = timestamp;

    const reachedEnd = tick(deltaTime);

    // Make sure that we don't continue the animation if the race has reached the end
    if (reachedEnd && animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);

      animationFrameId.current = null;
      lastTimestamp.current = null;

      setIsPlaying(false);

      return;
    }

    animationFrameId.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const start = () => {
    if (animationFrameId.current != null) return;

    setIsPlaying(true);

    lastTimestamp.current = null;
    animationFrameId.current = requestAnimationFrame(loop);
  };

  const stop = () => {
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
