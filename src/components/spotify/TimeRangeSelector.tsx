import { motion } from 'framer-motion';
import { TIME_RANGES } from '../../utils/constants';
import type { TimeRange } from '../../types/spotify';

interface TimeRangeSelectorProps {
  selected: TimeRange;
  onSelect: (timeRange: TimeRange) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex gap-2 p-1 bg-white/10 rounded-full">
      {Object.entries(TIME_RANGES).map(([key, { label }]) => (
        <motion.button
          key={key}
          onClick={() => onSelect(key as TimeRange)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors relative ${
            selected === key
              ? 'text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {selected === key && (
            <motion.div
              className="absolute inset-0 bg-green-500 rounded-full"
              layoutId="timeRangeSelector"
              initial={false}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{label}</span>
        </motion.button>
      ))}
    </div>
  );
};