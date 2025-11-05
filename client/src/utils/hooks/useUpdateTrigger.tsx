import { useState, useEffect, useCallback } from "react";

interface UseUpdateTriggerProps {
  intervalMs?: number;
}

export default function useUpdateTrigger({ intervalMs = 60000 }: UseUpdateTriggerProps = {}) {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const triggerUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!intervalMs) return;

    const interval = setInterval(() => {
      setUpdateTrigger(prev => prev + 1);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return { updateTrigger, triggerUpdate };
}