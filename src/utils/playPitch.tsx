import playAudio from './playAudio';

export const bellSounds = {
  G4: require(`assets/sounds/bells/G4.mp3`),
  Ab4: require(`assets/sounds/bells/Ab4.mp3`),
  A4: require(`assets/sounds/bells/A4.mp3`),
  Bb4: require(`assets/sounds/bells/Bb4.mp3`),
  B4: require(`assets/sounds/bells/B4.mp3`),
  C5: require(`assets/sounds/bells/C5.mp3`),
  Db5: require(`assets/sounds/bells/Db5.mp3`),
  D5: require(`assets/sounds/bells/D5.mp3`),
  Eb5: require(`assets/sounds/bells/Eb5.mp3`),
  E5: require(`assets/sounds/bells/E5.mp3`),
  F5: require(`assets/sounds/bells/F5.mp3`),
  Gb5: require(`assets/sounds/bells/Gb5.mp3`),
  G5: require(`assets/sounds/bells/G5.mp3`),
} as {[note: string]: any};

export const playBell = (note: string) => {
  playAudio(bellSounds[note]);
};

export const coinOrder = ['G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5', 'Db5', 'D5', 'Eb5', 'E5', 'F5', 'Gb5', 'G5'];

export const playCoinSound = (index: number) => {
  playBell(coinOrder[index]);
};

export const pianoSounds = {
  C4: require(`assets/sounds/piano/C4.mp3`),
  Db4: require(`assets/sounds/piano/Db4.mp3`),
  D4: require(`assets/sounds/piano/D4.mp3`),
  Eb4: require(`assets/sounds/piano/Eb4.mp3`),
  E4: require(`assets/sounds/piano/E4.mp3`),
  F4: require(`assets/sounds/piano/F4.mp3`),
  Gb4: require(`assets/sounds/piano/Gb4.mp3`),
  G4: require(`assets/sounds/piano/G4.mp3`),
  Ab4: require(`assets/sounds/piano/Ab4.mp3`),
  A4: require(`assets/sounds/piano/A4.mp3`),
  Bb4: require(`assets/sounds/piano/Bb4.mp3`),
  B4: require(`assets/sounds/piano/B4.mp3`),
  C5: require(`assets/sounds/piano/C5.mp3`),
} as {[note: string]: any};

export const playPiano = (note: string) => {
  playAudio(pianoSounds[note]);
};
