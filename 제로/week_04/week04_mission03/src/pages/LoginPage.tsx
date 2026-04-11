import useForm from '../hooks/useForm';
import { validateSignin, type UserSigninInformation } from '../utils/validate';
import icon from '../assets/google.png';
import { postSignin } from '../apis/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { useNavigate } from 'react-router-dom';

const LoginPage =() => {
   const {setItem} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
   const {values, errors, touched, getInputProps} = useForm<UserSigninInformation>({
      initialValue: {
         email: '',
         password: '',
      },
      validate: validateSignin,
      }, 
   );

   const handleSubmit = async () => {
      console.log(values);
      try {
         const response = await postSignin(values);
         setItem(response.data.accessToken);
      } catch (error) {
         alert(error?.message);
      }

      console.log(response);
   }

   const isDisabled = 
      Object.values(errors || {}).some((error) => error.length > 0) ||
      Object.values(values).some((value) => value === "");

      const navigate = useNavigate();

      const handleBack = () => {
      navigate(-1);
  };

   return (
      <div className='flex flex-col bg-black items-center justify-center h-full gap-4'>
         <div className="w-full max-w-md mx-auto relative flex items-center justify-center px-4 mb-4">
            <button
            onClick={handleBack}
            className="absolute left-20 text-white text-xl hover:opacity-70 transition"
            >
            &lt;
            </button>

            <p className="text-2xl font-bold text-white">로그인</p>
         </div>
         <div className="flex flex-col gap-3">
            <button className="w-full relative flex items-center justify-center
            bg-black border border-[#ccc] py-3 rounded-md text-lg text-white font-medium cursor-pointer"
            type="button" 
            onClick={handleSubmit}
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
            {...getInputProps('email')}
            name="email"
            className={`font-bold border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm text-white
            ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            type={"email"}
            placeholder={"이메일을 입력해주세요!"}
            />
            {errors?.email && touched?.email && (
               <div className="text-red-500 text-sm">{errors.email}</div>
            )}
            <input 
            {...getInputProps('password')}
            type={"password"} 
            className={`font-bold border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm text-white
            ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`} 
            placeholder={"비밀번호를 입력해주세요!"}
            />
            {errors?.password && touched?.password && (
               <div className="text-red-500 text-sm">{errors.password}</div>
            )}
            <button 
            type="button" 
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-full py-3 rounded-md text-lg font-medium transition-colors
            bg-[#333333] text-white
            enabled:bg-pink-500 enabled:hover:bg-pink-600 enabled:cursor-pointer"
            >
               로그인
            </button>
         </div>
      </div>

   );
}
export default LoginPage;

