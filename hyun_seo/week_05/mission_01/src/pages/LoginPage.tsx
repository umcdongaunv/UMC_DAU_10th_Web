import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSignin } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export const LoginPage = () => {
  const {login, accessToken} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);
  
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

  const handleSubmit = async () => {
    try {
      await login(values);
      navigate("/my");
    } catch (error) {
      console.error("Login error", error);
      navigate("/");
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-full bg-black text-white px-4'>
      <div className="w-full max-w-87.5 flex items-center mb-10 relative">
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

      <div className='w-full max-w-87.5 flex flex-col gap-5'>
        <div className="flex flex-col gap-1.5">
          <input 
            {...getInputProps("email")}
            className={`w-full p-4 bg-[#1a1a1a] border rounded-md focus:outline-none transition-all
            ${errors?.email && touched?.email ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'}`} 
            type='email'  
            placeholder='Please enter your email address.'
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
            placeholder='Please enter your password.'
          />
          {errors?.password && touched?.password && (
            <span className='text-red-500 text-xs ml-1'>{errors.password}</span>
          )}
        </div>

        <button 
          className={`w-full py-4 rounded-md text-lg font-bold transition-all mt-4 cursor-pointer
          ${isDisabled 
            ? 'bg-[#333] text-gray-500 cursor-not-allowed' 
            : 'bg-[#E50914] text-white hover:bg-[#b20710]'}`} 
          type='button' 
          onClick={handleSubmit} 
          disabled={isDisabled}
        >
          Log In
        </button>
      </div>
    </div>
  );  
};