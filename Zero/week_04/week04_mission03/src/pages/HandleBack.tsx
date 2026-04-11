import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const handleBack = () => {
    setLeaving(true);
    setTimeout(() => {
      navigate(-1);
    }, 200); // 애니메이션 시간 맞추기
  };

  return (
    <div className={`transition-opacity duration-200 ${leaving ? 'opacity-0' : 'opacity-100'}`}>
      <button onClick={handleBack}>←</button>
      로그인 페이지
    </div>
  );
};

export default LoginPage;