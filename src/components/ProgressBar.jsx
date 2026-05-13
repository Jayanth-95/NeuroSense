// ─── Progress Bar Component ───────────────────────────────────────────────────
// Animated horizontal bar used on the Results page and Dashboard.

/**
 * @param {object} props
 * @param {number}  props.value        - 0 to 100
 * @param {string}  [props.label]      - Optional label above the bar
 * @param {string}  [props.colorClass] - Tailwind bg class for the fill (default: neural blue)
 * @param {boolean} [props.showValue]  - Whether to show the numeric value on the right
 * @param {string}  [props.size]       - 'sm' | 'md' | 'lg'
 */
const ProgressBar = ({
  value = 0,
  label,
  colorClass = 'bg-neural-500',
  showValue = true,
  size = 'md',
}) => {
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm text-slate-400 font-body">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-mono text-slate-300 ml-auto">
              {clampedValue}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div className={`w-full ${heights[size]} bg-slate-700 rounded-full overflow-hidden`}>
        {/* Fill — uses CSS transition via global bar-fill class */}
        <div
          className={`${heights[size]} ${colorClass} rounded-full bar-fill`}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
