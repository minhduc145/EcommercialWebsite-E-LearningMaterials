interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
}

export function ProgressBar({ value, max = 100, showLabel = false }: ProgressBarProps) {
  // Ensure value is between 0 and max
  const clampedValue = Math.min(Math.max(0, value), max)
  const percentage = (clampedValue / max) * 100

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Tiến độ</span>
          <span className="text-sm font-medium text-gray-700">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
