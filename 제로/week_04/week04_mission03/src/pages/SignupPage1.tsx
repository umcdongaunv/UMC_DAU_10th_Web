import { z } from "zod";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { type SubmitHandler } from "react-hook-form";
import icon from "../assets/google.png";
import { postSignup } from "../apis/auth";
import { useNavigate } from "react-router-dom";

const schema = z.object({
   email: z.string().email({message: "올바른 이메일 형식이 아닙니다."}),
   password: z.string().min(8, 
      {message: "비밀번호는 8자 이상이어야 합니다."}).max(20, 
      {message: "비밀번호는 20자 이하여야 합니다."}),
   passwordCheck: z.string()
      .min(8, {message: "비밀번호 확인은 8자 이상이어야 합니다."})
      .max(20, {message: "비밀번호 확인은 20자 이하여야 합니다."}),
   name: z
      .string()
      .min(1, {message: "이름을 입력해주세요."})
   })
   .refine ((data) => data.password === data.passwordCheck, {
         message: "비밀번호가 일치하지 않습니다.",
         path: ["passwordCheck"],
   });



type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
   const {register, handleSubmit, watch, formState: {errors, isSubmitting}} = useForm<FormFields>({
      defaultValues: {
         name: "",
         email: "",
         password: "", 
         passwordCheck: "",    
      },
      resolver: zodResolver(schema),
      mode: "onBlur",

      
   })
      const values = watch();
   
      const isDisabled = 
         Object.keys(errors).length > 0 ||
         Object.values(values).some((value) => value === "");
   
         const navigate = useNavigate();
   
         const handleBack = () => {
         navigate(-1);
     };


   const onSubmit: SubmitHandler<FormFields> = async(data) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {passwordCheck, ...rest} = data;

      const response = await postSignup(rest);

      console.log(response);
   }

   return (
      <div className='flex flex-col bg-black items-center justify-center h-full gap-4'>
         <div className="flex flex-col gap-3">
            <div className="w-full max-w-md mx-auto relative flex items-center justify-center px-4 mb-4">
               <button
               onClick={handleBack}
               className="absolute left-4 text-white text-xl hover:opacity-70 transition"
               >
               &lt;
               </button>

               <p className="text-2xl font-bold text-white">회원가입</p>
            </div>
               <button className="w-full relative flex items-center justify-center
               bg-black border border-[#ccc] py-3 rounded-md text-lg text-white font-medium cursor-pointer"
               type="button" 
               onClick={() => console.log("구글 로그인")}
               disabled={isDisabled}>
               <img src={icon} alt="icon" className="w-5 h-5 absolute left-4"
               />
               구글 로그인
               </button>
               <div className="flex items-center w-full">
                  <div className="flex-1 border-b border-white"></div>
                  <p className="px-12 text-white">OR</p>
                  <div className="flex-1 border-b border-white"></div>
               </div>
            <input  
            {...register('email')}
            name="email"
            className={`font-bold border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm text-white
            ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            type={"email"}
            placeholder={"이메일을 입력해주세요!"}
            />
            {errors.email && (
               <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
            
            <input 
            {...register('password')}
            type={"password"} 
            className={`font-bold border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm text-white
            ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`} 
            placeholder={"비밀번호를 입력해주세요!"}
            />
            {errors.password && (
               <div className="text-red-500 text-sm">{errors.password.message}</div>
            )}

            <input 
            {...register('passwordCheck')}
            type={"password"} 
            className={`font-bold border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm text-white
            ${errors?.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"}`} 
            placeholder={"비밀번호 확인을 입력해주세요!"}
            />
            {errors.passwordCheck && (
               <div className="text-red-500 text-sm">{errors.passwordCheck.message}</div>
            )}

            <input 
            {...register('name')}
            type={"name"} 
            className={`font-bold border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm text-white
            ${errors?.name ? "border-red-500 bg-red-200" : "border-gray-300"}`} 
            placeholder={"이름을 입력해주세요!"}
            />
            {errors.name && (
               <div className="text-red-500 text-sm">{errors.name.message}</div>
            )}
           
            <button
            disabled={isSubmitting} 
            type="button" 
            onClick={handleSubmit(onSubmit)}
            className="w-full py-3 rounded-md text-lg font-medium transition-colors
            bg-[#333333] text-white
            enabled:bg-pink-500 enabled:hover:bg-pink-600 enabled:cursor-pointer"
            >
               회원가입
            </button>
         </div>
      </div>
   )
}  

export default SignupPage;