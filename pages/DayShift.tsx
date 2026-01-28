import React from 'react';
import ShiftScale from '../components/ShiftScale';

const DayShift: React.FC = () => {
  const intervals = [
    '08:00h às 10:30h', '10:30h às 13:00h', '13:00h às 15:30h', '15:30h às 18:00h'
  ];

  return (
    <ShiftScale
      shiftType="day"
      title="ESCALA ORDINÁRIA DIURNA"
      intervals={intervals}
    />
  );
};

export default DayShift;
