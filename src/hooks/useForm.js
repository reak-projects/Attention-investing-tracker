import { useState, useCallback } from "react";

/**
 * Custom hook for form state management with validation
 */
const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (onSubmit) => {
      setIsSubmitting(true);
      const validation = validate ? validate(values) : { isValid: true, errors: {} };

      if (!validation.isValid) {
        setErrors(validation.errors);
        // Mark all fields as touched
        const allTouched = {};
        Object.keys(validation.errors).forEach((k) => (allTouched[k] = true));
        setTouched((prev) => ({ ...prev, ...allTouched }));
        setIsSubmitting(false);
        return false;
      }

      try {
        await onSubmit(values);
        setIsSubmitting(false);
        return true;
      } catch (err) {
        setIsSubmitting(false);
        throw err;
      }
    },
    [values, validate]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  };
};

export default useForm;
