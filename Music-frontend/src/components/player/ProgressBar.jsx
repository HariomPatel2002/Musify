import { useSelector } from 'react-redux';
import { formatTime } from '../../utils/formatTime';

export default function ProgressBar({ seek }) {
  const { progress, duration } = useSelector((state) => state.player);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
  };

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-[11px] text-gray-500 dark:text-neutral-400 w-10 text-right font-medium tabular-nums">
        {formatTime(progress)}
      </span>
      <div
        className="flex-1 h-1.5 bg-gray-300 dark:bg-[#333] rounded-full cursor-pointer group relative"
        onClick={handleClick}
      >
        <div
          className="h-full bg-gray-900 dark:bg-white rounded-full group-hover:bg-violet-500 transition-colors relative"
          style={{ width: `${pct}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-violet-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <span className="text-[11px] text-gray-500 dark:text-neutral-400 w-10 font-medium tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );
}
