import { useEffect, useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
    initialValue: T;
    validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({initialValue, validate}: UseFormProps<T>){
    const [values, setValues] = useState(initialValue);

    const [touched, setTouched] = useState<Record<string, boolean>>();

    const [errors, seterrors] = useState<Record<string, string>>();

    const handleChange = (name: keyof T, text: string) => {
        setValues({
            ...values,  //불변성 유지(기존값 유지)
            [name]: text,
        })
    }

    const handleBlur = (name: keyof T) => {
        setTouched({
            ...touched,
            [name]: true,
        })
    }

    const getInputProps = (name: keyof T) => {
        const value: T[keyof T] = values[name];
        const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(name, e.target.value);
        const onBlur = () => handleBlur(name);

        return {value, onChange, onBlur};
    }

    useEffect( () => {
        const newErrors = validate(values);
        seterrors(newErrors);  //오류 메시지 엡뎃
    }, [validate, values])

    return { values, errors, touched, getInputProps};

    
}

export default useForm;