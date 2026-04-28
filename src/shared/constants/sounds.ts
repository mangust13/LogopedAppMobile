export const UKRAINIAN_SOUND_OPTIONS = [
  { letter: "С", color: "#F8A15F" },
  { letter: "З", color: "#6FA8DC" },
  { letter: "Ц", color: "#B6D7A8" },
  { letter: "Ж", color: "#6FA8DC" },
  { letter: "Ш", color: "#D5A6BD" },
  { letter: "Л", color: "#B6D7A8" },
  { letter: "Р", color: "#F47C7C" },
] as const;

export const ALLOWED_PROBLEM_SOUNDS: string[] = UKRAINIAN_SOUND_OPTIONS.map(
  (sound) => sound.letter,
);

export function parseProblemSounds(value?: string | null) {
  if (!value) return [];

  return value
    .split(",")
    .map((sound) => sound.trim().toUpperCase())
    .filter((sound, index, sounds) => {
      return (
        ALLOWED_PROBLEM_SOUNDS.includes(sound) && sounds.indexOf(sound) === index
      );
    });
}

export function formatProblemSounds(sounds: string[]) {
  return sounds
    .map((sound) => sound.trim().toUpperCase())
    .filter((sound, index, normalizedSounds) => {
      return (
        ALLOWED_PROBLEM_SOUNDS.includes(sound) &&
        normalizedSounds.indexOf(sound) === index
      );
    })
    .join(",");
}
