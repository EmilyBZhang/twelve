import { useMemo } from 'react';

import { randElem } from 'utils/random';

const messages = [
  'Astounding!',
  'Excellent!',
  'Fantastic!',
  'Good job!',
  'Magnificent!',
  'Marvelous!',
  'Nice job!',
  'Nice work!',
  'Superb!',
  'Terrific!',
  'Well done!',
  'Wonderful!',
];

const getCongratsMessage = () => {
  return randElem(messages);
};

const useCongratsMessage = (deps: React.DependencyList) => {
  const congratsMessage = useMemo<string>(getCongratsMessage, deps);
  return congratsMessage;
};

export default useCongratsMessage;
