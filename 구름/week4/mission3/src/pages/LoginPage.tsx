import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSignin } from "../utils/validate";
import { useLocalStorage } from "../hooks/useLocalStoreage";
import { postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const LoginPage = () => {
    const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const navigate = useNavigate();
    const {values, errors, touched, getInputProps} = useForm<UserSigninInformation>({
        initialValue:{
            email: "",
            passwd: "",
        },
        validate: validateSignin,
    })

const handleSubmit = async () => {
    try {
        const response = await postSignin({
        email: values.email,
        password: values.passwd // values.passwd의 값을 password라는 키로 전달
        });
        setItem(response.data.accessToken);
        console.log("로그인 성공", response);
        navigate('/'); 
    } catch (error: any) {
        alert(error?.response?.data?.message || "로그인에 실패했습니다.");
    }
};


    const isDisabled = 
    Object.values(errors || {}).some((error) => error.length > 0) || 
    Object.values(values).some((value) => value === '');

    
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
                ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`
                }
                placeholder={"비밀번호"}>
                </input>
                {errors?.password && touched?.password && (<div className="text-red-500 text-sm">{errors.password}</div>)}
                <button type="button" onClick={handleSubmit} disabled={false}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg
                font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300">로그인</button>
            </div>
        </div>
    )
}

export default LoginPage;