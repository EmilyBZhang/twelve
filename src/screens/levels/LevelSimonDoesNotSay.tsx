import React from 'react';

import { Level } from 'utils/interfaces';
import SimonSays from './components/SimonSays';

const LevelSimonDoesNotSay: Level = (props) => <SimonSays simonDoesNotSay {...props} />;

export default LevelSimonDoesNotSay;
