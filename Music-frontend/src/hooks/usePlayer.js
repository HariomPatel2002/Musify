import { useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Howl } from 'howler';
import {
  playSong,
  togglePlay,
  nextSong,
  setDuration,
  setProgress,
} from '../features/player/playerSlice';

export default function usePlayer() {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, volume, repeatMode } = useSelector(
    (state) => state.player
  );
  const soundRef = useRef(null);

  useEffect(() => {
    if (!currentSong?.audioUrl) return;

    if (soundRef.current) {
      soundRef.current.unload();
    }

    soundRef.current = new Howl({
      src: [currentSong._id ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/api/songs/${currentSong._id}/stream` : currentSong.audioUrl],
      html5: true,
      volume,
      onload: () => {
        dispatch(setDuration(soundRef.current.duration()));
      },
      onplay: () => {
        dispatch(togglePlay());
      },
      onpause: () => {},
      onend: () => {
        if (repeatMode === 'one') {
          soundRef.current.seek(0);
          soundRef.current.play();
        } else {
          dispatch(nextSong());
        }
      },
      onseek: () => {
        dispatch(setProgress(soundRef.current.seek()));
      },
    });

    soundRef.current.play();

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [currentSong?.audioUrl]);

  useEffect(() => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.play();
    } else {
      soundRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!soundRef.current) return;
    soundRef.current.volume(volume);
  }, [volume]);

  const seek = useCallback((time) => {
    if (soundRef.current) {
      soundRef.current.seek(time);
      dispatch(setProgress(time));
    }
  }, []);

  return { seek };
}
