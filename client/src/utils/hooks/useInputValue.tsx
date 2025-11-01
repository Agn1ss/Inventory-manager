import { useState, useCallback } from "react";

export function useInputValue(defValue: string = "") {
  const [input, setInput] = useState(defValue);

  const handler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  return [input, setInput, handler] as const;
}