import { useEffect, useState } from 'react';

export function useCountdown(initialSeconds, isRunning = true) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

  useEffect(() => {
    setSecondsRemaining(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || secondsRemaining <= 0) return undefined;

    const timerId = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [secondsRemaining]);

  return secondsRemaining;
}
