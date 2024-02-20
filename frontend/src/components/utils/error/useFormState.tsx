import { useState } from 'react';

interface FormState {
  isChanged: boolean;
  isSubmitting: boolean;
  alertMessageOpen: boolean;
  alertMessage: string;
  alertSeverity: "success" | "error" | "info" | "warning" | undefined;
}

export const useFormState = () => {
  const [state, setState] = useState<FormState>({
    isChanged: false,
    isSubmitting: false,
    alertMessageOpen: false,
    alertMessage: '',
    alertSeverity: undefined,
  });

  const setFormState = (newState: Partial<FormState>) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  return [state, setFormState] as const;
};

