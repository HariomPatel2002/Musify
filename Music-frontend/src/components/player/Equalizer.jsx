import { useSelector, useDispatch } from 'react-redux';
import { setBand, setPreset, toggleEqualizerEnabled, EQ_PRESETS, EQ_BANDS } from '../../features/player/playerSlice';
import { X, RotateCcw } from 'lucide-react';

const presetLabels = {
  flat: 'Flat', bassBoost: 'Bass Boost', treble: 'Treble', vocal: 'Vocal',
  rock: 'Rock', jazz: 'Jazz', classical: 'Classical', pop: 'Pop',
};

export default function Equalizer() {
  const dispatch = useDispatch();
  const { equalizerEnabled, equalizerBands, currentPreset } = useSelector((state) => state.player);

  return (
    <div className="w-80 bg-white dark:bg-[#1A1A1A] border-l border-gray-200 dark:border-[#2A2A2A] flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#2A2A2A]">
        <h3 className="font-semibold text-sm">Equalizer</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(toggleEqualizerEnabled())}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              equalizerEnabled ? 'bg-violet-500 text-white' : 'bg-gray-200 dark:bg-[#242424] text-gray-500'
            }`}
          >
            {equalizerEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-gray-100 dark:border-[#2A2A2A]">
        <label className="text-xs text-gray-400 mb-1 block">Preset</label>
        <select
          value={currentPreset}
          onChange={(e) => dispatch(setPreset(e.target.value))}
          className="w-full rounded-lg border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#242424] px-3 py-2 text-sm"
        >
          {Object.entries(presetLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 flex items-end justify-center gap-1 px-4 py-6">
        {equalizerBands.map((gain, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-gray-400 tabular-nums">{gain > 0 ? '+' : ''}{gain}</span>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={gain}
              onChange={(e) => dispatch(setBand({ index, gain: parseInt(e.target.value) }))}
              className="w-6 h-24 accent-violet-500 cursor-pointer"
              style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
            />
            <span className="text-[8px] text-gray-400">
              {EQ_BANDS[index] >= 1000 ? `${EQ_BANDS[index] / 1000}k` : EQ_BANDS[index]}
            </span>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-gray-100 dark:border-[#2A2A2A]">
        <button
          onClick={() => dispatch(setPreset('flat'))}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-white"
        >
          <RotateCcw className="w-4 h-4" /> Reset to Flat
        </button>
      </div>
    </div>
  );
}
