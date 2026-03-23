export function getExercisesText(count: number) {
  if (count === 1) return "1 вправа";
  if (count >= 2 && count <= 4) return `${count} вправи`;
  return `${count} вправ`;
}
