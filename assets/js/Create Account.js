const form = document.getElementById("form-register");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password_confirm = document.getElementById("password-confirm");

/* in ra lỗi: nếu đã có cùng thông báo thì không tạo thêm */
function ShowError(input, loi) {
  if (!input) return;
  const parent = input.parentElement;
  const value = (input.value || "").toString().trim();
  // Xác định thông báo lỗi:
  // - Nếu input rỗng -> luôn là "Không được để trống"
  // - Ngược lại lấy từ tham số `loi`, đảm bảo là chuỗi và đã trim
  let message;
  if (value === "") {
    message = "Không được để trống";
  } else {
    // nếu `loi` là null/undefined thì dùng chuỗi rỗng, sau đó toString() + trim()
    message = (loi || "").toString().trim();
  }
  if (!message) return;
  // Nếu input rỗng: xóa tất cả thông báo lỗi hiện có và chỉ thêm 1 thông báo "Không được để trống"
  if (value === "") {
    const existingErrors = parent.querySelectorAll(".error");
    existingErrors.forEach(function (el) {
      el.remove();
    });
    const errEl = document.createElement("small");
    errEl.className = "error";
    errEl.innerText = message;
    parent.appendChild(errEl);
    return;
  }
  // Nếu không rỗng: chỉ thêm thông báo mới nếu chưa tồn tại (không tạo trùng)
  const errorNodes = parent.querySelectorAll(".error");
  for (let i = 0; i < errorNodes.length; i++) {
    const text = (errorNodes[i].innerText || "").trim();
    if (text === message) {
      return; // đã có thông báo giống -> không thêm
    }
  }
  const errEl = document.createElement("small");
  errEl.className = "error";
  errEl.innerText = message;
  parent.appendChild(errEl);
}

/* Hiện thị thành công: xóa các thẻ lỗi có nội dung trùng với 'remove' */
function ShowSuccess(input, remove) {
  if (!input || !remove) return;
  const parent = input.parentElement;
  // Chuẩn hóa `remove` thành mảng các chuỗi đã trim
  let toRemove;
  if (Array.isArray(remove)) {
    // Nếu remove đã là mảng, convert từng phần tử thành chuỗi và trim
    toRemove = remove.map(function (item) {
      return (item || "").toString().trim();
    });
  } else {
    // Nếu remove không phải mảng, bọc vào mảng và trim
    toRemove = [(remove || "").toString().trim()];
  }

  const errors = parent.querySelectorAll(".error");
  errors.forEach((el) => {
    const text = (el.innerText || "").trim();
    if (toRemove.includes(text)) {
      el.remove();
    }
  });
}

/* Kiểm tra trống */
function CheckEpmtyError(input) {
  let isEmptyError = false;
  input.value = input.value.trim();
  if (!input.value) {
    isEmptyError = true;
    ShowError(input, "Không được để trống");
  } else {
    ShowSuccess(input, "Không được để trống");
  }
  return isEmptyError;
}

/* Kiểm tra email bằng regex */
function CheckEmailError(input) {
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  input.value = input.value.trim();
  if (regexEmail.test(input.value)) {
    ShowSuccess(input, "Email không hợp lệ");
    return false;
  } else {
    ShowError(input, "Email không hợp lệ");
    return true;
  }
}

/* Kiểm tra độ dài ký tự */
function CheckLengthError(input, min, max) {
  input.value = input.value.trim();
  if (input.value.length < min) {
    ShowError(input, `Phải có ít nhất ${min} ký tự`);
    return true;
  } else if (input.value.length > max) {
    ShowError(input, `Không được vượt quá ${max} ký tự`);
    return true;
  } else {
    ShowSuccess(input, [
      `Phải có ít nhất ${min} ký tự`,
      `Không được vượt quá ${max} ký tự`,
    ]);
    return false;
  }
}

function CheckPasswordMatchError(passwordInput, passwordConfirmInput) {
  if (passwordInput.value !== passwordConfirmInput.value) {
    ShowError(passwordConfirmInput, "Mật khẩu không khớp");
    return true;
  } else {
    ShowSuccess(passwordConfirmInput, "Mật khẩu không khớp");
    return false;
  }
}

function CheckFirstLetter(input) {
  input.value = input.value.trim();
  const firstChar = input.value.charAt(0);
  const code = firstChar.charCodeAt(0);
  let isLetter = false;

  // Kiểm tra A-Z và a-z bằng if/else (theo mã ASCII)
  if (code >= 65 && code <= 90) {
    // A - Z
    isLetter = true;
  } else if (code >= 97 && code <= 122) {
    // a - z
    isLetter = true;
  } else {
    isLetter = false;
  }
  if (!isLetter) {
    ShowError(input, "Ký tự đầu phải là chữ cái (A-Z hoặc a-z)");
    return true;
  } else {
    ShowSuccess(input, "Ký tự đầu phải là chữ cái (A-Z hoặc a-z)");
    return false;
  }
}

/* Kiểm tra mật khẩu: ít nhất 1 chữ cái, 1 chữ số, 1 ký tự đặc biệt*/
function CheckPasswordComplexityError(input) {
  if (!input) return true;
  input.value = input.value.trim();
  const val = input.value;
  const hasLetter = /[A-Za-z]/.test(val);
  const hasDigit = /\d/.test(val);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>~`_\-\\\/\[\];'=+;:]/.test(val);
  if (!hasLetter || !hasDigit || !hasSpecial) {
    ShowError(
      input,
      "Mật khẩu phải có ít nhất 1 chữ cái, 1 chữ số và 1 ký tự đặc biệt"
    );
    return true;
  } else {
    ShowSuccess(
      input,
      "Mật khẩu phải có ít nhất 1 chữ cái, 1 chữ số và 1 ký tự đặc biệt"
    );
    return false;
  }
}

/* Sự kiện submit form */
form.addEventListener("submit", function (e) {
  e.preventDefault();
  let isEmptyErrorUsername = CheckEpmtyError(username);
  let isEmptyErrorEmail = CheckEpmtyError(email);
  let isEmptyErrorPassword = CheckEpmtyError(password);
  let isEmptyErrorPasswordConfirm = CheckEpmtyError(password_confirm);
  if (!isEmptyErrorUsername) {
    CheckFirstLetter(username);
    CheckLengthError(username, 3, 10);
  }
  if (!isEmptyErrorEmail) {
    CheckEmailError(email);
  }
  if (!isEmptyErrorPassword) {
    CheckLengthError(password, 6, 20);
    CheckPasswordComplexityError(password);
  }
  if (!isEmptyErrorPasswordConfirm) {
    CheckPasswordMatchError(password, password_confirm);
  }
});
