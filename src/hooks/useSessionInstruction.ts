import { useState } from "react";

const shownInstructionKeys = new Set<string>();

export function useSessionInstruction(key: string) {
  const [showInstruction, setShowInstruction] = useState(() => {
    const shouldShow = !shownInstructionKeys.has(key);

    if (shouldShow) {
      shownInstructionKeys.add(key);
    }

    return shouldShow;
  });

  return {
    showInstruction,
    openInstruction: () => setShowInstruction(true),
    closeInstruction: () => setShowInstruction(false),
  };
}
