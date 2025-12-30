import { useEffect } from "react";
import { useGameStore } from "../_store/gameStore";

export function useGameTimer() {
  const status = useGameStore((s) => s.status);
  const tick = useGameStore((s) => s.tick);

  useEffect(() => {
    if (status !== "playing") return;

    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [status, tick]);
}
