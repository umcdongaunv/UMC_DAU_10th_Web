export type UserSigninInformation = {
    email: string;
    passwd: string;
};

function validateUser(value: UserSigninInformation) {
    const errors = {
        email: "",
        passwd: "",
    };

    if (
        !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(value.email)
    ) {
        errors.email = '올바른 이메일 형식이 아닙니다!';
    }

    if (!(value.passwd.length >= 8 && value.passwd.length < 20)) {
        errors.passwd = '비밀번호는 8-20자 사이로 입력해주세요.';
    }

    return errors;

}

function validateSignin (values: UserSigninInformation) {
    return validateUser(values);
}

export {validateSignin};