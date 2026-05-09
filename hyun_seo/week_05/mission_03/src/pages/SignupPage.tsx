import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { postSignup } from "../apis/auth";

const schema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string().trim().min(8, { message: "Password must be between 8 and 20 characters." }).max(20),
  passwordCheck: z.string().trim(),
  name: z.string().min(1, { message: "Please enter your name." }),
}).refine((data) => data.password === data.passwordCheck, {
  message: "Passwords do not match.",
  path: ['passwordCheck'],
});

type FormFields = z.infer<typeof schema>;

export const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, trigger, watch, formState: { errors, isSubmitting } } = useForm<FormFields>({
    defaultValues: { name: "", email: "", password: "", passwordCheck: "" },
    resolver: zodResolver(schema),
    mode: "onChange" 
  });

  const [emailValue, passwordValue, passwordCheckValue, nameValue] = watch(["email", "password", "passwordCheck", "name"]);

  const isStep1Valid = emailValue && !errors.email;
  const isStep2Valid = passwordValue && passwordCheckValue && !errors.password && !errors.passwordCheck;
  const isStep3Valid = nameValue && !errors.name;

  const handleNextStep = async () => {
    const isEmailValid = await trigger("email"); 
    if (isEmailValid) setStep(2);
  };

  const handleNextToStep3 = async () => {
    const isPasswordValid = await trigger(["password", "passwordCheck"]);
    if (isPasswordValid) setStep(3);
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { passwordCheck, ...rest } = data;
      await postSignup(rest);
      alert("Welcome!");
      navigate('/');
    } catch (error: any) {
      alert(error?.response?.data?.message || "Sign Up failed.");
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-full bg-black text-white px-4 font-sans'>
      <div className="w-full max-w-87.5 flex items-center mb-10 relative">
        <button onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))} className="absolute left-0 p-2 hover:bg-gray-800 rounded-full transition-all cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <h1 className="w-full text-center text-xl font-bold tracking-tight">Sign Up</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-87.5 flex flex-col gap-5'>
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <input 
                {...register("email")}
                className={`w-full p-4 bg-[#1a1a1a] border rounded-md focus:outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'}`} 
                type='email' placeholder='Enter your email address' 
              />
              {errors.email && <div className='text-red-500 text-xs px-1'>{errors.email.message}</div>}
            </div>
            <button 
              type="button" 
              onClick={handleNextStep} 
              disabled={!isStep1Valid}
              className={`w-full py-4 font-bold rounded-md transition-all ${
                isStep1Valid ? "bg-red-700 text-white hover:bg-red-600 cursor-pointer" : "bg-[#333] text-gray-500 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span className="text-sm font-medium text-gray-200">{emailValue}</span>
            </div>

            <div className="relative">
              <input 
                {...register("password")} 
                type={showPassword ? "text" : "password"}
                className={`w-full p-4 bg-[#1a1a1a] border rounded-md focus:outline-none text-sm transition-all ${errors.password ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'}`} 
                placeholder='Create a password' 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs hover:text-white transition-colors">
                {showPassword ? "🐵" : "🙈"}
              </button>
            </div>
            {errors.password && (
              <div className='text-red-500 text-xs px-1 font-medium'>{errors.password.message}</div>
            )}

            <div className="relative">
              <input 
                {...register("passwordCheck")} 
                type={showPassword ? "text" : "password"}
                className={`w-full p-4 bg-[#1a1a1a] border rounded-md focus:outline-none text-sm transition-all ${errors.passwordCheck ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'}`} 
                placeholder='Confirm your password' 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs hover:text-white transition-colors">
                {showPassword ? "🐵" : "🙈"}
              </button>
            </div>
            
            {errors.passwordCheck && (
              <div className='text-red-500 text-xs px-1 font-medium'>{errors.passwordCheck?.message}</div>
            )}

            <button 
              type='button' 
              onClick={handleNextToStep3}
              disabled={!isStep2Valid}
              className={`w-full py-4 rounded-md text-sm font-bold mt-2 transition-all ${
                isStep2Valid ? "bg-red-700 text-white hover:bg-red-600 cursor-pointer" : "bg-[#333] text-gray-500 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6 items-center">
            <div className="w-27.5 h-27.5 rounded-full bg-[#333] flex items-center justify-center mb-2 overflow-hidden border border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-gray-500 mt-4">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <input 
                {...register("name")}
                className={`w-full p-4 bg-[#1a1a1a] border rounded-md focus:outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'}`} 
                type='text' placeholder='What is your name?' 
              />
              {errors.name && <div className='text-red-500 text-xs px-1'>{errors.name.message}</div>}
            </div>
            
            <button 
              disabled={!isStep3Valid || isSubmitting}
              type='submit' 
              className={`w-full py-4 rounded-md text-sm font-bold mt-2 transition-all ${
                isStep3Valid && !isSubmitting ? "bg-red-700 text-white hover:bg-red-600 cursor-pointer" : "bg-[#333] text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Processing..." : "Complete Sign Up"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};