import React, { useState, useEffect } from 'react';

type Props = {
  timestamp: number;
};

const CountdownText = ({ timestamp }: Props) => {
  const calculateTimePassed = () => {
    const now = new Date();
    const created = new Date(timestamp);
    const differenceInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);
    return differenceInSeconds;
  };

  const [timePassed, setTimePassed] = useState(calculateTimePassed());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimePassed(calculateTimePassed());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimePassed = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  return <span>{formatTimePassed(timePassed)}</span>;
};

export default CountdownText;
