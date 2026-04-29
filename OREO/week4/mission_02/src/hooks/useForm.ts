import { useState, ChangeEvent } from "react";
// handleChange, handleBlur는 getInputProps()에 통합됨

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  pattern?: RegExp;
  message?: string;
}

type Rules<T> = Partial<Record<keyof T, ValidationRules>>;

function validate<T>(values: T, rules: Rules<T>): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const key in rules) {
    const rule = rules[key]!;
    const value = String(values[key] ?? "");

    if (rule.required && !value.trim()) {
      errors[key] = rule.message ?? "필수 입력 항목입니다.";
      continue;
    }
    if (rule.minLength && value.length < rule.minLength) {
      errors[key] = rule.message ?? `최소 ${rule.minLength}자 이상 입력해주세요.`;
      continue;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[key] = rule.message ?? "형식이 올바르지 않습니다.";
    }
  }

  return errors;
}

/**
 * 폼 상태(값, 에러, 유효성)를 관리하는 커스텀 훅
 */
export function useForm<T extends Record<string, string>>(
  initialValues: T,
  rules: Rules<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: value } as T;
    setValues(newValues);

    // 입력 즉시 해당 필드 유효성 검사
    const newErrors = validate(newValues, rules);
    setErrors(newErrors);
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // 모든 필드가 유효한지 여부
  const isValid =
    Object.keys(rules).every((key) => {
      const value = values[key as keyof T];
      return value && !errors[key as keyof T];
    });

  // react-hook-form의 register()처럼 한 번에 props를 반환
  const getInputProps = (name: keyof T) => ({
    name: name as string,
    value: values[name],
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const newValues = { ...values, [name]: e.target.value } as T;
      setValues(newValues);
      setErrors(validate(newValues, rules));
    },
    onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
  });

  return { values, errors, touched, getInputProps, isValid };
}
