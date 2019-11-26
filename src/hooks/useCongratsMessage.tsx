import { useMemo } from 'react';

import { randElem } from 'utils/random';

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
  return randElem(messages);
};

const useCongratsMessage = () => {
  const congratsMessage = useMemo<string>(getCongratsMessage, []);
  return congratsMessage;
};

export default useCongratsMessage;
