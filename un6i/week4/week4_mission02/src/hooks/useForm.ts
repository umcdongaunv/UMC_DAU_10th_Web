import { useState } from 'react';

// 어떤 값들이 들어올지 미리 정의 (이메일, 비밀번호 등)
interface UseFormProps {
    initialValues: { [key: string]: string };
    validate: (values: { [key: string]: string }) => { [key: string]: string };
}

const useForm = ({ initialValues, validate }: UseFormProps) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // 타이핑할 때마다 값을 업데이트
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    // 입력창에서 마우스를 뗐을 때(Blur) 유효성 검사 실행
    const handleBlur = () => {
        const validationErrors = validate(values);
        setErrors(validationErrors);
    };

    return { values, errors, handleChange, handleBlur };
};

export default useForm;