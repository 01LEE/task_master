import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, '이메일을 입력해주세요')
  .email('올바른 이메일 형식이 아닙니다')
  .max(254, '이메일이 너무 깁니다');

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
  .max(100, '비밀번호가 너무 깁니다')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    '비밀번호는 영문 대소문자와 숫자를 포함해야 합니다'
  );

// Sign up form schema
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

// Sign in form schema
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

// Types inferred from schemas
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;

// Password strength checker
export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('최소 8자 이상 입력하세요');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('영문 소문자를 포함하세요');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('영문 대문자를 포함하세요');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('숫자를 포함하세요');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
    feedback.splice(0); // Clear feedback if special chars are included
  }

  return { score, feedback };
}; 