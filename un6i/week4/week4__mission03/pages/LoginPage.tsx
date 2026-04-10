import useForm from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    const { values, errors, handleChange, handleBlur } = useForm({
        initialValues: { email: '', password: '' },
        validate: (values) => {
            const errors: { [key: string]: string } = {};
            // [x] 이메일 유효성 검사
            if (!values.email.includes('@') || !values.email.includes('.')) {
                errors.email = '유효하지 않은 이메일 형식입니다.';
            }
            // [x] 비밀번호 길이 검사 (8자 기준)
            if (values.password.length < 8) {
                errors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
            }
            return errors;
        },
    });

    // [x] 버튼 활성화 조건: 에러가 없고 값이 비어있지 않을 때만!
    const isFormValid = 
        values.email.length > 0 && 
        values.password.length > 0 && 
        Object.keys(errors).length === 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('로그인 시도:', values);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px' }}>
            {/* [x] 뒤로 가기 버튼 (<) */}
            <button 
                onClick={() => navigate(-1)} 
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginBottom: '20px' }}
            >
                &lt;
            </button>

            {/* [x] 로그인 UI 구축 */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h1 style={{ marginBottom: '20px' }}>로그인</h1>
                
                <input 
                    name="email" 
                    placeholder="이메일을 입력해주세요" 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
                {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
                
                <input 
                    name="password" 
                    type="password" 
                    placeholder="비밀번호를 입력해주세요" 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
                {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password}</span>}
                
                {/* [x] 버튼 활성화 로직 적용 */}
                <button 
                    type="submit" 
                    disabled={!isFormValid}
                    style={{ 
                        padding: '15px', 
                        borderRadius: '8px', 
                        backgroundColor: isFormValid ? '#ff005a' : '#ccc', 
                        color: 'white', 
                        border: 'none',
                        cursor: isFormValid ? 'pointer' : 'not-allowed',
                        marginTop: '20px'
                    }}
                >
                    로그인
                </button>
            </form>
        </div>
    );
};

export default LoginPage;