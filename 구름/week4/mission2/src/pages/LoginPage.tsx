import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSignin } from "../utils/validate";

const LoginPage = () => {
    const navigate = useNavigate();
    const {values, errors, touched, getInputProps} = useForm<UserSigninInformation>({
        initialValue:{
            email: "",
            passwd: "",
        },
        validate: validateSignin,
    })

    const isDisabled = 
    Object.values(errors || {}).some((error) => error.length > 0) || 
    Object.values(values).some((value) => value === '');

    const handleSubmit = () => {};

    return (
        <div className="flex flex-co; items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                <input
                {...getInputProps("email")}
                type={"email"} className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] roumded-sm
                ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`
                }
                placeholder={"이메일"}>
                </input>
                {errors?.email && touched?.email && (<div className="text-red-500 text-sm">{errors.email}</div>)}
                

                <input type={"password"} className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] roumded-sm
                ${errors?.passwd && touched?.passwd ? "border-red-500 bg-red-200" : "border-gray-300"}`
                }
                placeholder={"비밀번호"}>
                </input>
                {errors?.passwd && touched?.passwd && (<div className="text-red-500 text-sm">{errors.passwd}</div>)}
                <button type="button" onClick={handleSubmit} disabled={false}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg
                font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300">로그인</button>
            </div>
        </div>
    )
}

export default LoginPage;