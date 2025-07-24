// useCountdown.ts
import { useState, useEffect } from 'react';

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h:${minutes.toString().padStart(2, "0")}m`);
      } else {
        setTimeLeft("0h:00m");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default useCountdown;