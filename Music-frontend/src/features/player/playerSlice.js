import { createSlice } from '@reduxjs/toolkit';

const EQ_PRESETS = {
  flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  bassBoost: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0],
  treble: [0, 0, 0, 0, 0, 2, 4, 5, 6, 6],
  vocal: [0, 0, 0, 2, 4, 4, 2, 0, 0, 0],
  rock: [4, 3, 2, 0, -1, 0, 2, 3, 4, 4],
  jazz: [2, 1, 0, 2, 3, 3, 2, 1, 0, 0],
  classical: [3, 2, 0, 0, 0, 0, 0, 2, 3, 4],
  pop: [-1, 0, 2, 3, 3, 2, 0, -1, -1, -1],
};

const initialState = {
  currentSong: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  repeatMode: 'off',
  isShuffle: false,
  showQueue: false,
  showLyrics: false,
  showEqualizer: false,
  sleepTimerEnd: null,
  equalizerEnabled: false,
  equalizerBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  currentPreset: 'flat',
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playSong: (state, action) => {
      state.currentSong = action.payload;
      state.isPlaying = true;
      state.progress = 0;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
      state.queueIndex = 0;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    nextSong: (state) => {
      if (state.queue.length === 0) return;
      const currentIndex = state.queue.findIndex((s) => s._id === state.currentSong?._id);
      let nextIndex;
      if (state.isShuffle) {
        nextIndex = Math.floor(Math.random() * state.queue.length);
      } else {
        nextIndex = (currentIndex + 1) % state.queue.length;
      }
      state.currentSong = state.queue[nextIndex];
      state.queueIndex = nextIndex;
      state.isPlaying = true;
      state.progress = 0;
    },
    prevSong: (state) => {
      if (state.queue.length === 0) return;
      const currentIndex = state.queue.findIndex((s) => s._id === state.currentSong?._id);
      const prevIndex = currentIndex <= 0 ? state.queue.length - 1 : currentIndex - 1;
      state.currentSong = state.queue[prevIndex];
      state.queueIndex = prevIndex;
      state.isPlaying = true;
      state.progress = 0;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
    },
    toggleRepeat: (state) => {
      const modes = ['off', 'all', 'one'];
      const currentIndex = modes.indexOf(state.repeatMode);
      state.repeatMode = modes[(currentIndex + 1) % modes.length];
    },
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
    },
    playNext: (state, action) => {
      const currentIndex = state.queue.findIndex((s) => s._id === state.currentSong?._id);
      state.queue.splice(currentIndex + 1, 0, action.payload);
    },
    removeFromQueue: (state, action) => {
      state.queue.splice(action.payload, 1);
    },
    reorderQueue: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const [item] = state.queue.splice(fromIndex, 1);
      state.queue.splice(toIndex, 0, item);
    },
    clearQueue: (state) => {
      state.queue = [];
      state.queueIndex = 0;
    },
    playFromQueue: (state, action) => {
      const index = action.payload;
      state.currentSong = state.queue[index];
      state.queueIndex = index;
      state.isPlaying = true;
      state.progress = 0;
    },
    toggleQueue: (state) => {
      state.showQueue = !state.showQueue;
      state.showLyrics = false;
      state.showEqualizer = false;
    },
    toggleLyrics: (state) => {
      state.showLyrics = !state.showLyrics;
      state.showQueue = false;
      state.showEqualizer = false;
    },
    toggleEqualizer: (state) => {
      state.showEqualizer = !state.showEqualizer;
      state.showQueue = false;
      state.showLyrics = false;
    },
    setSleepTimer: (state, action) => {
      state.sleepTimerEnd = Date.now() + action.payload * 60 * 1000;
    },
    clearSleepTimer: (state) => {
      state.sleepTimerEnd = null;
    },
    setBand: (state, action) => {
      const { index, gain } = action.payload;
      state.equalizerBands[index] = gain;
    },
    setPreset: (state, action) => {
      state.currentPreset = action.payload;
      state.equalizerBands = [...(EQ_PRESETS[action.payload] || EQ_PRESETS.flat)];
    },
    toggleEqualizerEnabled: (state) => {
      state.equalizerEnabled = !state.equalizerEnabled;
    },
  },
});

export const EQ_BANDS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
export { EQ_PRESETS };

export const {
  playSong, setQueue, togglePlay, nextSong, prevSong,
  setVolume, setProgress, setDuration, toggleShuffle, toggleRepeat,
  addToQueue, playNext, removeFromQueue, reorderQueue, clearQueue, playFromQueue,
  toggleQueue, toggleLyrics, toggleEqualizer,
  setSleepTimer, clearSleepTimer,
  setBand, setPreset, toggleEqualizerEnabled,
} = playerSlice.actions;
export default playerSlice.reducer;
