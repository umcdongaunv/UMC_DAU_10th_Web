import { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { postSignup } from '../apis/auth';

// ── Zod schema ────────────────────────────────────────────────────────────────

const schema = z
  .object({
    email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .max(20, '비밀번호는 20자 이하여야 합니다.'),
    passwordCheck: z.string(),
    name: z.string().min(1, '닉네임을 입력해주세요.'),
  })
  .refine((d) => d.password === d.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  });

type FormFields = z.infer<typeof schema>;

// ── Component ─────────────────────────────────────────────────────────────────

export const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: { email: '', password: '', passwordCheck: '', name: '' },
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const [emailValue, passwordValue, passwordCheckValue, nameValue] = watch([
    'email', 'password', 'passwordCheck', 'name',
  ]);

  const isStep1Valid = emailValue && !errors.email;
  const isStep2Valid =
    passwordValue && passwordCheckValue && !errors.password && !errors.passwordCheck;
  const isStep3Valid = nameValue && !errors.name;

  const handleNextToStep2 = async () => {
    const valid = await trigger('email');
    if (valid) setStep(2);
  };

  const handleNextToStep3 = async () => {
    const valid = await trigger(['password', 'passwordCheck']);
    if (valid) setStep(3);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { passwordCheck: _, ...rest } = data;
      await postSignup(rest);
      alert('회원가입이 완료되었습니다!');
      navigate('/');
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : '회원가입에 실패했습니다.';
      alert(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black text-white px-4 font-sans">
      {/* Header */}
      <div className="w-full max-w-[350px] flex items-center mb-10 relative">
        <button
          onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))}
          className="absolute left-0 p-2 hover:bg-gray-800 rounded-full transition-all cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="w-full text-center text-xl font-bold tracking-tight">Sign Up</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[350px] flex flex-col gap-5">
        {/* Step 1 — 이메일 */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <input
                {...register('email')}
                type="email"
                placeholder="이메일을 입력해주세요."
                className={`w-full p-4 bg-[#1a1a1a] border rounded-md focus:outline-none transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs px-1">{errors.email.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleNextToStep2}
              disabled={!isStep1Valid}
              className={`w-full py-4 font-bold rounded-md transition-all ${
                isStep1Valid
                  ? 'bg-red-700 text-white hover:bg-red-600 cursor-pointer'
                  : 'bg-[#333] text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2 — 비밀번호 */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            {/* 입력된 이메일 표시 */}
            <div className="flex items-center gap-2 px-1 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-200">{emailValue}</span>
            </div>

            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력해주세요. (8~20자)"
                className={`w-full p-4 bg-[#1a1a1a] border rounded-md focus:outline-none text-sm transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs hover:text-white transition-colors"
              >
                {showPassword ? '🐵' : '🙈'}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs px-1">{errors.password.message}</p>
            )}

            <div className="relative">
              <input
                {...register('passwordCheck')}
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 다시 입력해주세요."
                className={`w-full p-4 bg-[#1a1a1a] border rounded-md focus:outline-none text-sm transition-all ${
                  errors.passwordCheck ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs hover:text-white transition-colors"
              >
                {showPassword ? '🐵' : '🙈'}
              </button>
            </div>
            {errors.passwordCheck && (
              <p className="text-red-500 text-xs px-1">{errors.passwordCheck.message}</p>
            )}

            <button
              type="button"
              onClick={handleNextToStep3}
              disabled={!isStep2Valid}
              className={`w-full py-4 rounded-md text-sm font-bold mt-2 transition-all ${
                isStep2Valid
                  ? 'bg-red-700 text-white hover:bg-red-600 cursor-pointer'
                  : 'bg-[#333] text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Step 3 — 닉네임 + 프로필 이미지 */}
        {step === 3 && (
          <div className="flex flex-col gap-6 items-center">
            {/* 프로필 이미지 */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-28 h-28 rounded-full bg-[#333] flex items-center justify-center overflow-hidden border border-gray-700 hover:border-red-500 transition-all cursor-pointer"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="프로필 미리보기" className="w-full h-full object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-gray-500 mt-4">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <p className="text-xs text-gray-500">클릭하여 프로필 이미지 선택 (선택사항)</p>

            {/* 닉네임 */}
            <div className="flex flex-col gap-1.5 w-full">
              <input
                {...register('name')}
                type="text"
                placeholder="닉네임을 입력해주세요."
                className={`w-full p-4 bg-[#1a1a1a] border rounded-md focus:outline-none transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs px-1">{errors.name.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isStep3Valid || isSubmitting}
              className={`w-full py-4 rounded-md text-sm font-bold transition-all ${
                isStep3Valid && !isSubmitting
                  ? 'bg-red-700 text-white hover:bg-red-600 cursor-pointer'
                  : 'bg-[#333] text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? '처리 중...' : '회원가입 완료'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
