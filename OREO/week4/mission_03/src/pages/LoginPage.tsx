import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import { validateSignin, type UserSigninInformation } from '../utils/validate';
import { postSignin } from '../apis/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';

export const LoginPage = () => {
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValue: { email: '', password: '' },
    validate: useCallback(validateSignin, []),
  });

  const isDisabled =
    Object.values(errors ?? {}).some((e) => e.length > 0) ||
    Object.values(values).some((v) => v === '');

  const handleSubmit = async () => {
    try {
      const response = await postSignin(values);
      setItem(response.data.accessToken);
      navigate('/');
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : '로그인에 실패했습니다.';
      alert(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black text-white px-4">
      <div className="w-full max-w-[350px] flex items-center mb-10 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 p-2 hover:bg-gray-800 rounded-full transition-all cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="w-full text-center text-xl font-bold">Log In</h1>
      </div>

      <div className="w-full max-w-[350px] flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <input
            {...getInputProps('email')}
            type="email"
            placeholder="이메일을 입력해주세요."
            className={`w-full p-4 bg-[#1a1a1a] border rounded-md focus:outline-none transition-all ${
              errors?.email && touched?.email ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'
            }`}
          />
          {errors?.email && touched?.email && (
            <span className="text-red-500 text-xs ml-1">{errors.email}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <input
            {...getInputProps('password')}
            type="password"
            placeholder="비밀번호를 입력해주세요."
            className={`w-full p-4 bg-[#1a1a1a] border rounded-md focus:outline-none transition-all ${
              errors?.password && touched?.password ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'
            }`}
          />
          {errors?.password && touched?.password && (
            <span className="text-red-500 text-xs ml-1">{errors.password}</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`w-full py-4 rounded-md text-lg font-bold transition-all mt-4 ${
            isDisabled
              ? 'bg-[#333] text-gray-500 cursor-not-allowed'
              : 'bg-[#E50914] text-white hover:bg-[#b20710] cursor-pointer'
          }`}
        >
          Log In
        </button>
      </div>
    </div>
  );
};
