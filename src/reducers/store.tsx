import { createStore, applyMiddleware } from 'redux';

import rootReducer from './';
import { changePlaybackOptions } from 'utils/playAudio';

export type RootState = ReturnType<typeof rootReducer>;

export default createStore(rootReducer, applyMiddleware(changePlaybackOptions));
