import { z } from "zod";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";

const schema = z.object({
    email: z.string().email({message:"올바은 이메일 형식이 아닙니다."}),
    password: z.string().min(8, {
        message: "비밀번호는 8자 이상이어야 합니다."
    }).max(20, {
        message: "비밀번호는 20자 이하여야 합니다."
    }),

    passwdCheck: z.string().min(8, {
        message: "비밀번호는 8자 이상이어야 합니다."
    }).max(20, {
        message: "비밀번호는 20자 이하여야 합니다."
    }),


    name: z.string().min(1, { message:"이름을 입력해주세요."})
    
})
.refine((data) => data.password === data.passwdCheck, {
            message:"비밀번호가 일치하지 않습니다.",
            path: ['passwdCheck']
        })

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
    const {register, handleSubmit, formState: {errors, isSubmitting},} = useForm<FormFields>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
        resolver: zodResolver(schema),
        mode: "onBlur"
    })

    const omSubmit:SubmitHandler<FormFields> = async(data) => {
        const {passwdCheck, ...rest} = data;

        const response = await postSignup(rest);

        console.log(response);
    }


    return <div className="flex flex-co; items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                <input
                {...register("email")}
                name="email"
                type={"email"}
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] roumded-sm
                ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`
                }
                placeholder={"이메일"}>
                </input>

                {errors.email && (
                    <div className={"ext-red-500 text-sm"}>{errors.email?.message}</div>
                )}
                
                <input
                {...register("password")}
                name="password"
                type={"password"}
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] roumded-sm
                ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`
                }
                placeholder={"비밀번호"}>
                </input>

                {errors.password && (
                    <div className={"ext-red-500 text-sm"}>{errors.password?.message}</div>
                )}


                <input
                {...register("passwdCheck")}
                type={"password"}
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] roumded-sm
                ${errors?.passwdCheck ? "border-red-500 bg-red-200" : "border-gray-300"}`
                }
                placeholder={"비밀번호 확인"}>
                </input>

                {errors.passwdCheck && (
                    <div className={"ext-red-500 text-sm"}>{errors.passwdCheck?.message}</div>
                )}


                <input 
                {...register("name")}
                type={"name"} className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] roumded-sm
                ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`
                }
                placeholder={"이름"}>
                </input>

                {errors.name && (
                    <div className={"ext-red-500 text-sm"}>{errors.name?.message}</div>
                )}

                <button type="button" onClick={()=>{}} disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg
                font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300">회원가입</button>
            </div>
        </div>
}

export default SignupPage;