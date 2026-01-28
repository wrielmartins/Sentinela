import React from 'react';
import ShiftScale from '../components/ShiftScale';

const NightShift: React.FC = () => {
  const intervals = [
    '20:00h às 22:30h', '22:30h às 01:00h', '01:00h às 03:30h', '03:30h às 06:00h'
  ];

  return (
    <ShiftScale
      shiftType="night"
      title="ESCALA ORDINÁRIA NOTURNA"
      intervals={intervals}
    />
  );
};

export default NightShift;