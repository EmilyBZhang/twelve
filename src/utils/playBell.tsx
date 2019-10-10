import playAudio from './playAudio';

const bellSounds = [
  require(`../assets/sounds/bells/G4.mp3`),
  require(`../assets/sounds/bells/Ab4.mp3`),
  require(`../assets/sounds/bells/A4.mp3`),
  require(`../assets/sounds/bells/Bb4.mp3`),
  require(`../assets/sounds/bells/B4.mp3`),
  require(`../assets/sounds/bells/C5.mp3`),
  require(`../assets/sounds/bells/Db5.mp3`),
  require(`../assets/sounds/bells/D5.mp3`),
  require(`../assets/sounds/bells/Eb5.mp3`),
  require(`../assets/sounds/bells/E5.mp3`),
  require(`../assets/sounds/bells/F5.mp3`),
  require(`../assets/sounds/bells/Gb5.mp3`),
  require(`../assets/sounds/bells/G5.mp3`)
];

const playBell = (index: number) => {
  playAudio(bellSounds[index]);
};

export default playBell;
