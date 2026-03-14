function Validation(values) {
  const error = {};
  const usernamePattern = /^[a-zA-Z0-9._-]{3,}$/;
  const passwordPattern = /^(?=.*\d)(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

  if (values.username === '') {
    error.username = 'Username field should not be empty';
  } else if (!usernamePattern.test(values.username)) {
    error.username = 'Username must be at least 3 characters';
  } else {
    error.username = '';
  }

  if (values.password === '') {
    error.password = 'Password field should not be empty';
  } else if (!passwordPattern.test(values.password)) {
    error.password = 'Password is wrong';
  } else {
    error.password = '';
  }

  return error;
}

export default Validation;
