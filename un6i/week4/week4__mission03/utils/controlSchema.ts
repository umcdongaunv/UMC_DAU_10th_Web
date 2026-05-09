import * as z from 'zod';

export const signUpSchema = z.object({
  // [x] 이메일 유효성 검사
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
  
  // [x] 비밀번호 길이 검사 (가이드라인 8자 적용)
  password: z.string().min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." }),
  
  // 비밀번호 확인용 (아래 refine에서 검사)
  passwordConfirm: z.string(),
  
  // [x] 닉네임 설정
  nickname: z.string().min(2, { message: "닉네임은 2자 이상이어야 합니다." }),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "비밀번호가 일치하지 않습니다.", // [x] 비밀번호 불일치 메시지
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;