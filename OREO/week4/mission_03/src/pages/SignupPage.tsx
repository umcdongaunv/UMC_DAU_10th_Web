import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// ── Zod schemas ──────────────────────────────────────────────────────────────

const step1Schema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
});

const step2Schema = z
  .object({
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

const step3Schema = z.object({
  name: z.string().min(1, '닉네임을 입력해주세요.'),
  avatar: z.string().url('올바른 URL을 입력해주세요.').optional().or(z.literal('')),
});

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type Step3 = z.infer<typeof step3Schema>;

// ── Shared collected data ─────────────────────────────────────────────────────

interface CollectedData {
  email: string;
  password: string;
  name: string;
  avatar?: string;
}

// ── Sub-step components ───────────────────────────────────────────────────────

function Step1Form({ onNext }: { onNext: (data: Step1) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
      <div>
        <label className="block mb-1 text-sm font-medium text-[var(--text-h)]">
          이메일
        </label>
        <input
          type="email"
          placeholder="이메일을 입력해주세요."
          {...register('email')}
          className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-transparent outline-none focus:border-purple-500 transition-colors placeholder:text-gray-400 text-[var(--text-h)]"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="w-full py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        다음
      </button>
    </form>
  );
}

function Step2Form({
  onNext,
  onBack,
}: {
  onNext: (data: Step2) => void;
  onBack: () => void;
}) {
  const [showPw, setShowPw] = useState(false);
  const [showCfm, setShowCfm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step2>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange',
  });

  const EyeIcon = ({ open }: { open: boolean }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      {open ? (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </>
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </>
      )}
    </svg>
  );

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
      <div>
        <label className="block mb-1 text-sm font-medium text-[var(--text-h)]">
          비밀번호
        </label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            placeholder="비밀번호를 입력해주세요. (6자 이상)"
            {...register('password')}
            className="w-full px-4 py-3 pr-12 rounded-lg border border-[var(--border)] bg-transparent outline-none focus:border-purple-500 transition-colors placeholder:text-gray-400 text-[var(--text-h)]"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <EyeIcon open={showPw} />
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-[var(--text-h)]">
          비밀번호 확인
        </label>
        <div className="relative">
          <input
            type={showCfm ? 'text' : 'password'}
            placeholder="비밀번호를 다시 입력해주세요."
            {...register('confirmPassword')}
            className="w-full px-4 py-3 pr-12 rounded-lg border border-[var(--border)] bg-transparent outline-none focus:border-purple-500 transition-colors placeholder:text-gray-400 text-[var(--text-h)]"
          />
          <button
            type="button"
            onClick={() => setShowCfm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <EyeIcon open={showCfm} />
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-lg font-semibold border border-[var(--border)] text-[var(--text-h)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          이전
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="flex-1 py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          다음
        </button>
      </div>
    </form>
  );
}

function Step3Form({
  onSubmit,
  onBack,
  isLoading,
  error,
}: {
  onSubmit: (data: Step3) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}) {
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<Step3>({
    resolver: zodResolver(step3Schema),
    mode: 'onChange',
    defaultValues: { name: '', avatar: '' },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setValue('avatar', url, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-24 rounded-full border-2 border-dashed border-purple-400 flex items-center justify-center overflow-hidden hover:border-purple-600 transition-colors bg-gray-50 dark:bg-gray-800"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="프로필 미리보기"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-purple-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
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
        <p className="text-xs text-[var(--text)]">
          클릭하여 프로필 이미지 선택 (선택사항)
        </p>
        {/* hidden field for avatar url — optional */}
        <input type="hidden" {...register('avatar')} />
      </div>

      {/* Nickname */}
      <div>
        <label className="block mb-1 text-sm font-medium text-[var(--text-h)]">
          닉네임
        </label>
        <input
          type="text"
          placeholder="닉네임을 입력해주세요."
          {...register('name')}
          className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-transparent outline-none focus:border-purple-500 transition-colors placeholder:text-gray-400 text-[var(--text-h)]"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 py-3 rounded-lg font-semibold border border-[var(--border)] text-[var(--text-h)] hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
        >
          이전
        </button>
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="flex-1 py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '가입 중...' : '회원가입 완료'}
        </button>
      </div>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const STEP_LABELS = ['이메일', '비밀번호', '프로필'];

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [collected, setCollected] = useState<Partial<CollectedData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleStep1 = (data: Step1) => {
    setCollected((prev) => ({ ...prev, ...data }));
    setStep(1);
  };

  const handleStep2 = (data: Step2) => {
    setCollected((prev) => ({ ...prev, password: data.password }));
    setStep(2);
  };

  const handleStep3 = async (data: Step3) => {
    setIsLoading(true);
    setApiError(null);

    const payload: Record<string, string> = {
      email: collected.email!,
      password: collected.password!,
      name: data.name,
    };
    if (data.avatar) payload.avatar = data.avatar;

    try {
      await axios.post('http://localhost:8000/v1/auth/signup', payload);
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setApiError(err.response?.data?.message ?? '회원가입에 실패했습니다.');
      } else {
        setApiError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-[var(--text-h)] mb-8">
          회원가입
        </h1>

        {/* Step indicator */}
        <div className="flex items-center mb-10">
          {STEP_LABELS.map((label, idx) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    idx < step
                      ? 'bg-purple-600 text-white'
                      : idx === step
                      ? 'bg-purple-600 text-white ring-4 ring-purple-200 dark:ring-purple-900'
                      : 'bg-[var(--border)] text-[var(--text)]'
                  }`}
                >
                  {idx < step ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className="text-xs text-[var(--text)]">{label}</span>
              </div>
              {idx < STEP_LABELS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mb-5 mx-1 transition-colors ${
                    idx < step ? 'bg-purple-600' : 'bg-[var(--border)]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="p-6 rounded-2xl border border-[var(--border)] shadow-sm bg-[var(--bg)]">
          {step === 0 && <Step1Form onNext={handleStep1} />}
          {step === 1 && (
            <Step2Form onNext={handleStep2} onBack={() => setStep(0)} />
          )}
          {step === 2 && (
            <Step3Form
              onSubmit={handleStep3}
              onBack={() => setStep(1)}
              isLoading={isLoading}
              error={apiError}
            />
          )}
        </div>

        <p className="mt-6 text-center text-sm text-[var(--text)]">
          이미 계정이 있으신가요?{' '}
          <a href="/login" className="text-purple-500 hover:underline font-medium">
            로그인
          </a>
        </p>
      </div>
    </main>
  );
}
