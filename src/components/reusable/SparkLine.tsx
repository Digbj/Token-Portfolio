
import type { SparkLineProps } from "../types/Types";


const SparkLine = ({ data = [], className = "" }: SparkLineProps) => {
  if (!data || data.length === 0) return null;

  const width = 100;
  const height = 30;
  const max = Math.max(...data);
  const min = Math.min(...data);
const trendColor = data[data.length - 1] >= data[0] ? "green" : "red";
  // scale points to fit in svg
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / (max - min || 1)) * height;
    return `${x},${y}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-20 h-6 md:w-24 md:h-10 ${className}`}
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke={trendColor}
        strokeWidth="1"
        points={points.join(" ")}
      />
    </svg>
  );
};

export default SparkLine;
