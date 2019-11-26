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

export const electricGuitarSounds = {
  G5: require(`assets/sounds/electric-guitar/G5.mp3`),
  Ab5: require(`assets/sounds/electric-guitar/Ab5.mp3`),
  A5: require(`assets/sounds/electric-guitar/A5.mp3`),
  Bb5: require(`assets/sounds/electric-guitar/Bb5.mp3`),
  B5: require(`assets/sounds/electric-guitar/B5.mp3`),
  C6: require(`assets/sounds/electric-guitar/C6.mp3`),
  Db6: require(`assets/sounds/electric-guitar/Db6.mp3`),
  D6: require(`assets/sounds/electric-guitar/D6.mp3`),
  Eb6: require(`assets/sounds/electric-guitar/Eb6.mp3`),
  E6: require(`assets/sounds/electric-guitar/E6.mp3`),
  F6: require(`assets/sounds/electric-guitar/F6.mp3`),
  Gb6: require(`assets/sounds/electric-guitar/Gb6.mp3`),
  G6: require(`assets/sounds/electric-guitar/G6.mp3`),
} as {[note: string]: any};

export const playElectricGuitar = (note: string) => {
  playAudio(electricGuitarSounds[note]);
};

// export const coinOrder = ['G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5', 'Db5', 'D5', 'Eb5', 'E5', 'F5', 'Gb5', 'G5'];
export const coinOrder = ['G5', 'Ab5', 'A5', 'Bb5', 'B5', 'C6', 'Db6', 'D6', 'Eb6', 'E6', 'F6', 'Gb6', 'G6'];

export const playCoinSound = (index: number) => {
  playElectricGuitar(coinOrder[index]);
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
