function checkEmail() {
  let email = document.getElementById('email')
  let emailTip = document.getElementsByClassName('email-tip')[0]
  let value = email.value
  if (!value) {
    emailTip.style.color = 'red';
    emailTip.style.display = 'block';
    emailTip.innerHTML = '请输入邮箱';
    return false
  } else if (value.match(/[\w]+(\.[\w]+)*@[\w]+(\.[\w])+/) === null) {
    emailTip.style.color = 'red';
    emailTip.style.display = 'block';
    emailTip.innerHTML = '邮箱格式不正确';
    return false
  } else {
    emailTip.style.display = 'none';
    return true
  }
}
function checkNickname() {
  let nickname = document.getElementById('nickname')
  let nicknameTip = document.getElementsByClassName('nickname-tip')[0]
  let value = nickname.value
  if (!value) {
    nicknameTip.style.color = 'red';
    nicknameTip.style.display = 'block';
    nicknameTip.innerHTML = '请输入用户名';
    return false
  } else if (value.length < 6) {
    nicknameTip.style.color = 'red';
    nicknameTip.style.display = 'block';
    nicknameTip.innerHTML = '用户名不能少于六位';
    return false
  } else if (value.length > 20) {
    nicknameTip.style.color = 'red';
    nicknameTip.style.display = 'block';
    nicknameTip.innerHTML = '用户名不能多于二十位';
    return false
  } else {
    nicknameTip.style.display = 'none';
    return true
  }
}
function checkPass() {
  let password = document.getElementById('password')
  let passwordTip = document.getElementsByClassName('password-tip')[0]
  let value = password.value
  if (!value) {
    passwordTip.style.color = 'red';
    passwordTip.style.display = 'block';
    passwordTip.innerHTML = '请输入密码';
    return false
  } else if (value.length < 6) {
    passwordTip.style.color = 'red';
    passwordTip.style.display = 'block';
    passwordTip.innerHTML = '密码不能少于六位';
    return false
  } else if (value.length > 20) {
    passwordTip.style.color = 'red';
    passwordTip.style.display = 'block';
    passwordTip.innerHTML = '密码不能多于二十位';
    return false
  } else {
    passwordTip.style.display = 'none';
    return true
  }
}
function checkForm() {
  return checkEmail() && checkNickname() && checkPass();
}