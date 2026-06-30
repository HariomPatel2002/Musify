import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSleepTimer, clearSleepTimer } from '../../features/player/playerSlice';
import { Moon, X } from 'lucide-react';

const timerOptions = [5, 10, 15, 30, 45, 60];

export default function SleepTimer() {
  const dispatch = useDispatch();
  const { sleepTimerEnd } = useSelector((state) => state.player);
  const [showMenu, setShowMenu] = useState(false);
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    if (!sleepTimerEnd) { setRemaining(''); return; }
    const interval = setInterval(() => {
      const diff = sleepTimerEnd - Date.now();
      if (diff <= 0) {
        dispatch(clearSleepTimer());
        setRemaining('');
        clearInterval(interval);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setRemaining(`${mins}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sleepTimerEnd, dispatch]);

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-colors ${
          sleepTimerEnd ? 'text-violet-500 bg-violet-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        <Moon className="w-4 h-4" />
        {remaining && <span className="tabular-nums">{remaining}</span>}
      </button>

      {showMenu && (
        <div className="absolute right-0 bottom-full mb-2 w-44 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] rounded-xl shadow-xl py-1 z-50">
          <p className="px-3 py-1.5 text-xs font-semibold text-gray-400">Sleep Timer</p>
          {timerOptions.map((min) => (
            <button
              key={min}
              onClick={() => { dispatch(setSleepTimer(min)); setShowMenu(false); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#242424]"
            >
              {min} minutes
            </button>
          ))}
          {sleepTimerEnd && (
            <button
              onClick={() => { dispatch(clearSleepTimer()); setShowMenu(false); }}
              className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-[#242424] border-t border-gray-100 dark:border-[#2A2A2A]"
            >
              Cancel timer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
