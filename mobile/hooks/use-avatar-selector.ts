import { useState } from "react";

import { Avatars } from "@/lib/avatars";

export function useAvatarSelector() {
  const [avatarId, setAvatarId] = useState(0);

  const handleNext = () => {
    setAvatarId((prev) => {
      return prev === Avatars.length ? 1 : prev + 1;
    });
  };

  const handlePrev = () => {
    setAvatarId((prev) => {
      return prev === 1 ? Avatars.length : prev - 1;
    });
  };

  return {
    avatarId,
    handlePrev,
    handleNext,
  };
}
