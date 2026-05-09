import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSignin } from "../utils/validate";
import icon from "../assets/google.png";
import  { useAuth } from "../context/AuthContext";


export const LoginPage = () => {
  const {login, accessToken} = useAuth();
  const navigate = useNavigate();
  
  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValue: {
      email: "",
      password: "",
    },
    validate: validateSignin,
  });

  const isDisabled = 
    Object.values(errors || {}).some((error) => error.length > 0) || 
    Object.values(values).some((value) => value === '');
  
  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    try {
      await login(values);
      navigate("/my", { replace: true }); 
    } catch {
      alert("로그인 실패");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  }

  return (
    <div className='flex flex-col bg-black items-center justify-center h-full gap-4 text-white'>
      <div className="flex items-center w-full max-w-[350px] mx-auto mb-4">
        <button
          onClick={handleBack}
          className="text-white text-xl px-2"
        >
        &lt;
        </button>

        <p className="flex-1 text-center text-2xl font-bold text-white">로그인</p>
        <div className="w-6"></div>
      </div>
        <button
        type="button"
        onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3
           py-3 rounded-md border border-gray-400 w-full max-w-[350px]
          bg-black text-white hover:bg-[#1a1a1a] transition-all"
        
        >
          <img src={icon} className="w-5 h-5" />
          <span>구글 로그인</span>
        </button>

        <div className="flex items-center w-full max-w-[350px] text-bold my-4">
          <div className="flex-1 h-px bg-gray-500"></div>
          <span className="px-4 text-gray-300 text-sm text-bold">OR</span>
          <div className="flex-1 h-px bg-gray-500"></div>
        </div>

      <div className='w-full max-w-[350px] flex flex-col gap-5'>
        <div className="flex flex-col gap-1.5">
          <input 
            {...getInputProps("email")}
            className={`w-full p-4 bg-[#1a1a1a] border rounded-md focus:outline-none transition-all
            ${errors?.email && touched?.email ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'}`} 
            type='email'  
            placeholder='이메일을 입력해주세요.'
          />
          {errors?.email && touched?.email && (
            <span className='text-red-500 text-xs ml-1'>{errors.email}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <input 
            {...getInputProps("password")}
            className={`w-full p-4 bg-[#1a1a1a] border rounded-md focus:outline-none transition-all
            ${errors?.password && touched?.password ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'}`} 
            type='password' 
            placeholder='비밀번호를 입력해주세요.'
          />
          {errors?.password && touched?.password && (
            <span className='text-red-500 text-xs ml-1'>{errors.password}</span>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className="py-3 bg-gray-500 disabled:bg-pink-500 rounded"
        >
        다음
        </button>
      </div>
    </div>
  );  
};