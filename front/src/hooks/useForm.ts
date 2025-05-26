import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface FormField {
  value: string;
  error: string;
  touched: boolean;
}

interface UseFormProps<T> {
  initialValues: T;
  validationRules: Partial<Record<keyof T, ValidationRule>>;
}

export function useForm<T extends Record<string, string>>({
  initialValues,
  validationRules,
}: UseFormProps<T>) {
  const [fields, setFields] = useState<Record<keyof T, FormField>>(() => {
    const initialFields: Record<keyof T, FormField> = {} as Record<keyof T, FormField>;
    Object.keys(initialValues).forEach((key) => {
      initialFields[key as keyof T] = {
        value: initialValues[key as keyof T],
        error: '',
        touched: false,
      };
    });
    return initialFields;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: keyof T, value: string): string => {
      const rules = validationRules[name];
      if (!rules) return '';

      if (rules.required && !value.trim()) {
        return `${String(name)}을(를) 입력해주세요`;
      }

      if (rules.minLength && value.length < rules.minLength) {
        return `${String(name)}은(는) 최소 ${rules.minLength}자 이상이어야 합니다`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `${String(name)}은(는) 최대 ${rules.maxLength}자까지 입력 가능합니다`;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return `${String(name)} 형식이 올바르지 않습니다`;
      }

      if (rules.custom) {
        return rules.custom(value) || '';
      }

      return '';
    },
    [validationRules]
  );

  const setFieldValue = useCallback(
    (name: keyof T, value: string) => {
      setFields((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value,
          error: prev[name].touched ? validateField(name, value) : '',
        },
      }));
    },
    [validateField]
  );

  const setFieldTouched = useCallback(
    (name: keyof T, touched: boolean = true) => {
      setFields((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          touched,
          error: touched ? validateField(name, prev[name].value) : '',
        },
      }));
    },
    [validateField]
  );

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setFields((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        error,
      },
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newFields = { ...fields };

    Object.keys(fields).forEach((key) => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, fields[fieldName].value);
      newFields[fieldName] = {
        ...newFields[fieldName],
        error,
        touched: true,
      };
      if (error) isValid = false;
    });

    setFields(newFields);
    return isValid;
  }, [fields, validateField]);

  const reset = useCallback(() => {
    const resetFields: Record<keyof T, FormField> = {} as Record<keyof T, FormField>;
    Object.keys(initialValues).forEach((key) => {
      resetFields[key as keyof T] = {
        value: initialValues[key as keyof T],
        error: '',
        touched: false,
      };
    });
    setFields(resetFields);
    setIsSubmitting(false);
  }, [initialValues]);

  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: fields[name].value,
      error: fields[name].error,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue(name, e.target.value);
      },
      onBlur: () => {
        setFieldTouched(name);
      },
    }),
    [fields, setFieldValue, setFieldTouched]
  );

  const values = Object.keys(fields).reduce((acc, key) => {
    const fieldKey = key as keyof T;
    (acc as any)[fieldKey] = fields[fieldKey].value;
    return acc;
  }, {} as T);

  const errors = Object.keys(fields).reduce((acc, key) => {
    acc[key as keyof T] = fields[key as keyof T].error;
    return acc;
  }, {} as Record<keyof T, string>);

  const hasErrors = Object.values(errors).some((error) => error !== '');
  const isValid = !hasErrors && Object.values(fields).every((field) => field.touched);

  return {
    fields,
    values,
    errors,
    hasErrors,
    isValid,
    isSubmitting,
    setIsSubmitting,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    validateForm,
    reset,
    getFieldProps,
  };
} 