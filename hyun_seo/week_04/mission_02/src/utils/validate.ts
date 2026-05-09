export type UserSigninInformation = {
  email: string;
  password: string;
};

function validateUser(values: UserSigninInformation) {
  const errors = {
    email: "",
    password: ""
  };

  if (!/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(values.email,)) {
    errors.email = "Invalid email format.";
  }

  // 비밀번호 8자 ~ 20자 사이
  if (!(values.password.length >= 8 && values.password.length < 20)) {
    errors.password = "Please enter a password between 8 and 20 characters.";
  }

  return errors;
}

// 로그인 유효성 검사
function validateSignin (values: UserSigninInformation) {
  return validateUser(values);
}

export {validateSignin};