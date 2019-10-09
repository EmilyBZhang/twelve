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

export default getCongratsMessage;
