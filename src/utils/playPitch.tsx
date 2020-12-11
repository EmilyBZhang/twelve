import playAudio from './playAudio';

export const bellSounds = {
  G4: require(`assets/sfx/bells/G4.mp3`),
  Ab4: require(`assets/sfx/bells/Ab4.mp3`),
  A4: require(`assets/sfx/bells/A4.mp3`),
  Bb4: require(`assets/sfx/bells/Bb4.mp3`),
  B4: require(`assets/sfx/bells/B4.mp3`),
  C5: require(`assets/sfx/bells/C5.mp3`),
  Db5: require(`assets/sfx/bells/Db5.mp3`),
  D5: require(`assets/sfx/bells/D5.mp3`),
  Eb5: require(`assets/sfx/bells/Eb5.mp3`),
  E5: require(`assets/sfx/bells/E5.mp3`),
  F5: require(`assets/sfx/bells/F5.mp3`),
  Gb5: require(`assets/sfx/bells/Gb5.mp3`),
  G5: require(`assets/sfx/bells/G5.mp3`),
} as {[note: string]: any};

export const playBell = (note: string) => {
  playAudio(bellSounds[note]);
};

export const electricGuitarSounds = {
  G5: require(`assets/sfx/electric-guitar/G5.mp3`),
  Ab5: require(`assets/sfx/electric-guitar/Ab5.mp3`),
  A5: require(`assets/sfx/electric-guitar/A5.mp3`),
  Bb5: require(`assets/sfx/electric-guitar/Bb5.mp3`),
  B5: require(`assets/sfx/electric-guitar/B5.mp3`),
  C6: require(`assets/sfx/electric-guitar/C6.mp3`),
  Db6: require(`assets/sfx/electric-guitar/Db6.mp3`),
  D6: require(`assets/sfx/electric-guitar/D6.mp3`),
  Eb6: require(`assets/sfx/electric-guitar/Eb6.mp3`),
  E6: require(`assets/sfx/electric-guitar/E6.mp3`),
  F6: require(`assets/sfx/electric-guitar/F6.mp3`),
  Gb6: require(`assets/sfx/electric-guitar/Gb6.mp3`),
  G6: require(`assets/sfx/electric-guitar/G6.mp3`),
} as {[note: string]: any};

export const playElectricGuitar = (note: string) => {
  playAudio(electricGuitarSounds[note]);
};

export const coinSounds = {
  G5: require(`assets/sfx/coin/G5.mp3`),
  Ab5: require(`assets/sfx/coin/Ab5.mp3`),
  A5: require(`assets/sfx/coin/A5.mp3`),
  Bb5: require(`assets/sfx/coin/Bb5.mp3`),
  B5: require(`assets/sfx/coin/B5.mp3`),
  C6: require(`assets/sfx/coin/C6.mp3`),
  Db6: require(`assets/sfx/coin/Db6.mp3`),
  D6: require(`assets/sfx/coin/D6.mp3`),
  Eb6: require(`assets/sfx/coin/Eb6.mp3`),
  E6: require(`assets/sfx/coin/E6.mp3`),
  F6: require(`assets/sfx/coin/F6.mp3`),
  Gb6: require(`assets/sfx/coin/Gb6.mp3`),
  G6: require(`assets/sfx/coin/G6.mp3`),
} as {[note: string]: any};

// export const coinOrder = ['G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5', 'Db5', 'D5', 'Eb5', 'E5', 'F5', 'Gb5', 'G5'];
export const coinOrder = ['G5', 'Ab5', 'A5', 'Bb5', 'B5', 'C6', 'Db6', 'D6', 'Eb6', 'E6', 'F6', 'Gb6', 'G6'];

export const playCoinSound = (index: number) => {
  playElectricGuitar(coinOrder[index]);
  // playAudio(coinSounds[coinOrder[index]]);
};

export const pianoSounds = {
  C4: require(`assets/sfx/piano/C4.mp3`),
  Db4: require(`assets/sfx/piano/Db4.mp3`),
  D4: require(`assets/sfx/piano/D4.mp3`),
  Eb4: require(`assets/sfx/piano/Eb4.mp3`),
  E4: require(`assets/sfx/piano/E4.mp3`),
  F4: require(`assets/sfx/piano/F4.mp3`),
  Gb4: require(`assets/sfx/piano/Gb4.mp3`),
  G4: require(`assets/sfx/piano/G4.mp3`),
  Ab4: require(`assets/sfx/piano/Ab4.mp3`),
  A4: require(`assets/sfx/piano/A4.mp3`),
  Bb4: require(`assets/sfx/piano/Bb4.mp3`),
  B4: require(`assets/sfx/piano/B4.mp3`),
  C5: require(`assets/sfx/piano/C5.mp3`),
} as {[note: string]: any};

export const playPiano = (note: string) => {
  playAudio(pianoSounds[note]);
};
