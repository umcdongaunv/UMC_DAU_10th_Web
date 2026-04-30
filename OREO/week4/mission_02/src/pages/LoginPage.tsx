import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "../hooks/useForm";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps, isValid } =
    useForm<LoginForm>(
      { email: "", password: "" },
      {
        email: {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "유효하지 않은 이메일 형식입니다.",
        },
        password: {
          required: true,
          minLength: 6,
          message: "비밀번호는 최소 6자 이상이어야 합니다.",
        },
      }
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const { data } = await axios.post("http://localhost:8000/v1/auth/signin", {
        email: values.email,
        password: values.password,
      });

      // 토큰 저장
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      navigate("/");
    } catch {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-800 text-xl mb-6 transition-colors cursor-pointer"
        >
          {"<"}
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          로그인
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 이메일 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">이메일</label>
            <input
              {...getInputProps("email")}
              type="text"
              placeholder="이메일을 입력해주세요."
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm
              focus:outline-none focus:border-[#b2dab1] transition-colors"
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">비밀번호</label>
            <input
              {...getInputProps("password")}
              type="password"
              placeholder="비밀번호를 입력해주세요."
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm
              focus:outline-none focus:border-[#b2dab1] transition-colors"
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!isValid}
            className="mt-2 bg-[#b2dab1] text-white font-bold py-3 rounded-lg
            hover:bg-[#9ac99a] transition-all duration-200
            disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
            cursor-pointer"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
