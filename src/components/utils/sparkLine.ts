export function generateSparklineData(
  points = 1000, 
  min = 10000, 
  max = 30000 
) {
  const sparkline = [];
  for (let i = 0; i < points; i++) {
    const value = (Math.random() * (max - min) + min).toFixed(2);
    sparkline.push(Number(value));
  }
  return sparkline;
}
