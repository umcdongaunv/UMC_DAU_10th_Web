import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { signUpSchema, SignUpSchemaType } from '../utils/controlSchema';

const SignUpPage = () => {
  const [step, setStep] = useState(1); // 단계 관리
  const [showPwd, setShowPwd] = useState(false); // [x] 비밀번호 가시성 토글
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange', // 🔥 실시간으로 8자 검사해서 에러 띄우는 핵심 설정!
  });

  const onSubmit = (data: SignUpSchemaType) => {
    console.log('회원가입 데이터:', data);
    alert('회원가입이 완료되었습니다!');
    navigate('/'); // [x] 완료 후 홈(로그인) 이동
  };

  // 현재 입력값들 모니터링
  const emailVal = watch('email');
  const pwdVal = watch('password');
  const pwdConfirmVal = watch('passwordConfirm');

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>회원가입</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: 이메일 단계 */}
        {step === 1 && (
          <div style={stepContainer}>
            <input {...register('email')} placeholder="이메일을 입력해주세요" style={inputStyle} />
            {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
            
            {/* [x] 이메일 유효할 때만 다음 버튼 활성화 */}
            <button 
              type="button" 
              disabled={!emailVal || !!errors.email} 
              onClick={() => setStep(2)} 
              style={btnStyle(!!emailVal && !errors.email)}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 2: 비밀번호 단계 */}
        {step === 2 && (
          <div style={stepContainer}>
            <p style={{ color: '#666' }}>입력한 이메일: {emailVal}</p>
            
            {/* 비밀번호 입력 */}
            <div style={{ position: 'relative' }}>
              <input 
                {...register('password')} 
                type={showPwd ? 'text' : 'password'} 
                placeholder="비밀번호를 입력해주세요" 
                style={inputStyle} 
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={eyeBtnStyle}>
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
            
            {/* 비밀번호 재확인 */}
            <input 
              {...register('passwordConfirm')} 
              type="password" 
              placeholder="비밀번호를 다시 입력해주세요" 
              style={{ ...inputStyle, marginTop: '10px' }} 
            />
            {errors.passwordConfirm && <p style={errorStyle}>{errors.passwordConfirm.message}</p>}
            
            <button 
              type="button" 
              disabled={!!errors.password || !!errors.passwordConfirm || !pwdConfirmVal} 
              onClick={() => setStep(3)} 
              style={btnStyle(!errors.password && !errors.passwordConfirm && !!pwdConfirmVal)}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 3: 닉네임 단계 */}
        {step === 3 && (
          <div style={stepContainer}>
            <div style={profilePlaceholder}>프로필</div>
            <input {...register('nickname')} placeholder="닉네임을 입력해주세요" style={inputStyle} />
            {errors.nickname && <p style={errorStyle}>{errors.nickname.message}</p>}
            
            <button type="submit" disabled={!isValid} style={btnStyle(isValid)}>
              회원가입 완료
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

// CSS 스타일 (원하는 대로 수정 가능)
const stepContainer = { display: 'flex' as const, flexDirection: 'column' as const, gap: '10px' };
const inputStyle = { padding: '15px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', fontSize: '16px' };
const errorStyle = { color: 'red', fontSize: '12px', margin: '0' };
const btnStyle = (active: boolean) => ({
  padding: '15px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold',
  backgroundColor: active ? '#FF416C' : '#ccc', color: 'white',
  cursor: active ? 'pointer' : 'not-allowed', marginTop: '20px'
});
const eyeBtnStyle: React.CSSProperties = { position: 'absolute', right: '15px', top: '15px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' };
const profilePlaceholder = { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f0f0f0', margin: '20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '12px' };

export default SignUpPage;