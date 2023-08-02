import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';

interface CountdownProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  const isPaymentExpired = +targetDate < +new Date();

  return (
    <Text className='font-black text-xs text-center text-white'>
      {isPaymentExpired
        ? 'Pagamento vencido'
        : timeLeft.days > 0
        ? `Tempo restante para o pagamento: ${timeLeft.days} dias ${timeLeft.hours} horas ${timeLeft.minutes} minutos`
        : `Tempo restante: ${timeLeft.hours} horas ${timeLeft.minutes} minutos`}
    </Text>
  );
};


export default Countdown;
