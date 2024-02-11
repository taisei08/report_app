export const trimText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}年${month}月${day}日`;
};

export const checkUserNameFormat = (userName: string) => {
  const userNameRegex: RegExp = /^[a-zA-Z0-9_-]*$/;
  if (!userNameRegex.test(userName)) {
    return true;
  }
  return false;
};

export const checkUserNameLength = (userName: string) => {
  if (!(userName.length > 0 && userName.length <= 32)) {
    return true;
  }
  return false;
};

export const checkEmail = (email: string) => {
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return true
  } 
  else {
    return false
  }
};

export const checkPassword = (password: string) => {
  const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*[^\x01-\x7E]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return true
  }
  else {
    return false
  }
};

export const checkPasswordConfirmation: (password: string, passwordConfirmation: string) => boolean = (
  password,
  passwordConfirmation
) => {
  if (password === passwordConfirmation) {
    return false;
  } else {
    return true;
  }
};


