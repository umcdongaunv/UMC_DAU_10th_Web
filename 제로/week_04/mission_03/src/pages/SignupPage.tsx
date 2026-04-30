import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler } from "react-hook-form";
import icon from "../assets/google.png";
import { postSignup } from "../apis/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";


const fullSchema = z.object({
  email: z.string().email({
    message: "올바른 이메일 형식을 입력해주세요.",
  }),

  password: z
    .string()
    .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
    .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),

  passwordCheck: z
    .string(),

  name: z.string().min(1, {
    message: "닉네임을 입력해주세요.",
  }),
})
.refine((data) => data.password === data.passwordCheck, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["passwordCheck"], 
});

type FormFields = z.infer<typeof fullSchema>;


const emailSchema = z.string().email({
  message: "올바른 이메일 형식을 입력해주세요.",
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),

  passwordCheck: z
    .string()
})
.refine((data) => data.password === data.passwordCheck, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["passwordCheck"],
});

const nameSchema = z.string().min(1);


const SignupPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(fullSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      passwordCheck: "",
      name: "",
    },
  });


  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPw, setShowPw] = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);


  const email = watch("email");
  const password = watch("password");
  const passwordCheck = watch("passwordCheck");
  const name = watch("name");


  const isStep1Valid = emailSchema.safeParse(email).success;

  const isStep2Valid = passwordSchema.safeParse({
    password,
    passwordCheck,
  }).success;

  const isStep3Valid = nameSchema.safeParse(name).success;


  const handleNext1 = () => {
    if (!isStep1Valid) return;
    setStep(2);
  };

  const handleNext2 = () => {
    if (!isStep2Valid) return;
    setStep(3);
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
  try {
    const { passwordCheck, ...rest } = data;

    await postSignup(rest); 
  } catch (error) {
    console.error("회원가입 실패:", error);
  } finally {
    navigate("/"); 
  }
};
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col bg-black items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-4 w-[300px]">

        <div className="relative flex justify-center items-center">
          <button
            onClick={handleBack}
            className="absolute left-0 text-white text-xl"
          >
            &lt;
          </button>
          <p className="text-2xl font-bold text-white">회원가입</p>
        </div>

        {step >= 2 && (
          <div className="text-white text-sm">{email}</div>
        )}

        {step === 1 && (
          <>
            <button
              className="relative flex items-center justify-center
              bg-black border border-[#ccc] py-3 rounded-md text-white"
              type="button"
            >
              <img src={icon} className="w-5 h-5 absolute left-4" />
              구글 로그인
            </button>

            <div className="flex items-center">
              <div className="flex-1 border-b border-white"></div>
              <p className="px-4 text-white">OR</p>
              <div className="flex-1 border-b border-white"></div>
            </div>

            <input
              {...register("email")}
              className="p-3 rounded text-white bg-black border"
              placeholder="이메일 입력"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <button
              onClick={handleNext1}
              disabled={!isStep1Valid}
              className="py-3 bg-pink-500 disabled:bg-gray-500 rounded"
            >
              다음
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                {...register("password")}
                className="p-3 w-full rounded bg-black text-white border"
                placeholder="비밀번호"
              />
            <button
              type="button"
              onClick={() => setShowPw((p) => !p)}
              className="absolute right-3 top-3 text-white"
            >
              {showPw ? <FiEye /> : <FiEyeOff />}
            </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}

            <div className="relative">
              <input
                type={showPwCheck ? "text" : "password"}
                {...register("passwordCheck")}
                className="p-3 w-full rounded bg-black text-white border"
                placeholder="비밀번호 확인"
              />
            <button
              type="button"
              onClick={() => setShowPwCheck((p) => !p)}
              className="absolute right-3 top-3 text-white"
            >
              {showPwCheck ? <FiEye /> : <FiEyeOff />}
            </button>
            </div>
            {errors.passwordCheck && (
              <p className="text-red-500 text-sm">
                {errors.passwordCheck.message}
              </p>
            )}

            <button
              onClick={handleNext2}
              disabled={!isStep2Valid}
              className="py-3 bg-pink-500 disabled:bg-gray-500 rounded"
            >
              다음
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="w-24 h-24 bg-gray-400 rounded-full mx-auto" />

            <input
              {...register("name")}
              className="p-3 rounded bg-black text-white border"
              placeholder="닉네임 입력"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={!isStep3Valid || isSubmitting}
              className="py-3 bg-pink-500 disabled:bg-gray-500 rounded"
            >
              회원가입 완료
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupPage;