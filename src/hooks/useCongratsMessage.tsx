import { useMemo } from 'react';

const messages = [
  'Astounding!',
  'Congratulations!',
  'Excellent!',
  'Good job!',
  'Magnificent!',
  'Marvelous!',
  'Nice job!',
  'Nice work!',
  'Superb!',
  'Terrific!',
  'Well done!',
  'Wonderful!'
];

const getCongratsMessage = () => {
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
};

const useCongratsMessage = () => {
  const congratsMessage = useMemo<string>(getCongratsMessage, []);
  return congratsMessage;
};

export default useCongratsMessage;
