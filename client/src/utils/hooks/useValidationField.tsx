import { useState, useEffect } from "react";

export default function useValidationField(
  field: string,
  validationRules: Map<(f: string) => boolean, string>
) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const valErrors: string[] = [];

      for (const [ruleFunc, err] of validationRules.entries()) {
        if (ruleFunc(field)) {
          valErrors.push(err);
        }
      }

      setErrors(valErrors);
      setIsValid(valErrors.length === 0);
    }, 400);

    return () => clearTimeout(timeout);
  }, [field, validationRules]);

  return [errors, isValid] as const;
}
