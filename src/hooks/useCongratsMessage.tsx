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

const useCongratsMessage = (deps?: Array<any>) => {
  const congratsMessage = useMemo<string>(getCongratsMessage, deps);
  return congratsMessage;
};

export default useCongratsMessage;
