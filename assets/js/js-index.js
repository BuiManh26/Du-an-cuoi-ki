/* Xử lý form đăng ký */
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

/* Kiểm tra mật khẩu khớp */
function CheckPasswordMatchError(passwordInput, passwordConfirmInput) {
  if (passwordInput.value !== passwordConfirmInput.value) {
    ShowError(passwordConfirmInput, "Mật khẩu không khớp");
    return true;
  } else {
    ShowSuccess(passwordConfirmInput, "Mật khẩu không khớp");
    return false;
  }
}

/* Kiểm tra ký tự đầu là chữ cái */
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

/* Kiểm tra username đã tồn tại trong localStorage chưa */
function checkusernameExists(input) {
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk")) || [];
  const newUsername = input.value.trim();
  const exists = ds_tk.some(function (acc) {
    return acc.username && acc.username.toString().trim() === newUsername;
  });

  if (exists) {
    // nếu trùng -> hiển thị lỗi và đánh dấu không hợp lệ
    ShowError(input, "Tên đăng nhập đã tồn tại");
    checkusername = false;
  } else {
    // nếu không trùng -> xóa lỗi liên quan (nếu có)
    ShowSuccess(input, "Tên đăng nhập đã tồn tại");
  }
}

/* Kiểm tra email đã tồn tại trong localStorage chưa */
function checkEmailExists(input) {
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk")) || [];
  const newEmail = input.value.trim();
  const exists = ds_tk.some(function (acc) {
    return acc.email && acc.email.toString().trim() === newEmail;
  });

  if (exists) {
    // nếu trùng -> hiển thị lỗi và đánh dấu không hợp lệ
    ShowError(input, "Email đã được sử dụng");
    checkemail = false;
  } else {
    // nếu không trùng -> xóa lỗi liên quan (nếu có)
    ShowSuccess(input, "Email đã được sử dụng");
  }
}

/* --- Validation functions: chỉ trả về boolean (true = hợp lệ) --- */

/* kiểm tra không rỗng */
function isNotEmpty(input) {
  if (!input) return false;
  const v = (input.value || "").toString().trim();
  return v !== "";
}

/* kiểm tra định dạng email */
function isEmailFormat(input) {
  if (!input) return false;
  const v = (input.value || "").toString().trim();
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(v);
}

/* kiểm tra độ dài trong khoảng [min, max] */
function isLengthInRange(input, min, max) {
  if (!input) return false;
  const len = (input.value || "").toString().trim().length;
  return len >= min && len <= max;
}

/* kiểm tra ký tự đầu là chữ cái A-Z hoặc a-z */
function isFirstLetterValid(input) {
  if (!input) return false;
  const v = (input.value || "").toString().trim();
  if (!v) return false;
  const code = v.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

/* kiểm tra mật khẩu phức tạp: >=6, có chữ, số, ký tự đặc biệt */
function isPasswordComplex(input) {
  if (!input) return false;
  const v = (input.value || "").toString();
  if (v.length < 6) return false;
  const hasLetter = /[A-Za-z]/.test(v);
  const hasDigit = /\d/.test(v);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>~`_\-\\\/\[\];'=+;]/.test(v);
  return hasLetter && hasDigit && hasSpecial;
}

/* kiểm tra 2 mật khẩu khớp */
function isPasswordMatch(passInput, confirmInput) {
  if (!passInput || !confirmInput) return false;
  return (passInput.value || "") === (confirmInput.value || "");
}

/* kiểm tra username có sẵn trong localStorage -> true nếu hợp lệ (không trùng) */
function isUsernameAvailable(input) {
  if (!input) return false;
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk") || "[]");
  const newUsername = (input.value || "").toString().trim().toLowerCase();
  if (!newUsername) return false;
  return !ds_tk.some(function (acc) {
    return (
      acc &&
      acc.username &&
      acc.username.toString().trim().toLowerCase() === newUsername
    );
  });
}

/* kiểm tra email có sẵn trong localStorage -> true nếu hợp lệ (không trùng) */
function isEmailAvailable(input) {
  if (!input) return false;
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk") || "[]");
  const newEmail = (input.value || "").toString().trim().toLowerCase();
  if (!newEmail) return false;
  return !ds_tk.some(function (acc) {
    return (
      acc && acc.email && acc.email.toString().trim().toLowerCase() === newEmail
    );
  });
}

/* --- Submit handler: chỉ khi nhấn nút mới hiển thị lỗi bằng ShowError / ShowSuccess --- */
const form1 = document.getElementById("form-sign-up");
if (form1) {
  form1.addEventListener("submit", function (e) {
    e.preventDefault();

    // xóa lỗi cũ
    [username, email, password, password_confirm].forEach((inp) => {
      if (!inp) return;
      const parent = inp.parentElement;
      const errs = parent.querySelectorAll(".error");
      errs.forEach((el) => el.remove());
    });

    // chạy các validate, lưu kết quả boolean
    const okUserNotEmpty = isNotEmpty(username);
    const okEmailNotEmpty = isNotEmpty(email);
    const okPassNotEmpty = isNotEmpty(password);
    const okPassConfirmNotEmpty = isNotEmpty(password_confirm);

    let okUsername = false;
    let okEmail = false;
    let okPassword = false;
    let okPassConfirm = false;

    // username: kiểm tra lần lượt các điều kiện sai
    if (!okUserNotEmpty) {
      ShowError(username, "Không được để trống");
    } else {
      if (!isFirstLetterValid(username)) {
        ShowError(username, "Ký tự đầu phải là chữ cái (A-Z hoặc a-z)");
      }
      if (!isLengthInRange(username, 3, 15)) {
        ShowError(username, "Tên đăng nhập phải từ 3 đến 15 ký tự");
      }
      if (!isUsernameAvailable(username)) {
        ShowError(username, "Tên đăng nhập đã tồn tại");
      }
      if (
        isFirstLetterValid(username) &&
        isLengthInRange(username, 3, 15) &&
        isUsernameAvailable(username)
      ) {
        // hợp lệ: xóa các lỗi liên quan nếu còn
        ShowSuccess(username, [
          "Không được để trống",
          "Ký tự đầu phải là chữ cái (A-Z hoặc a-z)",
          "Tên đăng nhập phải từ 3 đến 15 ký tự",
          "Tên đăng nhập đã tồn tại",
        ]);
        okUsername = true;
      }
    }

    // email: kiểm tra lần lượt các điều kiện sai
    if (!okEmailNotEmpty) {
      ShowError(email, "Không được để trống");
    } else {
      if (!isEmailFormat(email)) {
        ShowError(email, "Email không hợp lệ");
      }
      if (!isEmailAvailable(email)) {
        ShowError(email, "Email đã được sử dụng");
      }
      if (isEmailFormat(email) && isEmailAvailable(email)) {
        // hợp lệ: xóa các lỗi liên quan nếu còn
        ShowSuccess(email, [
          "Không được để trống",
          "Email không hợp lệ",
          "Email đã được sử dụng",
        ]);
        okEmail = true;
      }
    }

    // password: kiểm tra lần lượt các điều kiện sai
    if (!okPassNotEmpty) {
      ShowError(password, "Không được để trống");
    } else {
      if (!isLengthInRange(password, 6, 25)) {
        ShowError(password, "Mật khẩu phải từ 6 đến 25 ký tự");
      }
      if (!isPasswordComplex(password)) {
        ShowError(
          password,
          "Mật khẩu phải có ít nhất 1 chữ cái, 1 chữ số và 1 ký tự đặc biệt"
        );
      }
      if (isLengthInRange(password, 6, 25) && isPasswordComplex(password)) {
        // hợp lệ: xóa các lỗi liên quan nếu còn
        ShowSuccess(password, [
          "Không được để trống",
          `Mật khẩu phải từ 6 đến 25 ký tự`,
          "Mật khẩu phải có ít nhất 1 chữ cái, 1 chữ số và 1 ký tự đặc biệt",
        ]);
        okPassword = true;
      }
    }

    // password confirm: kiểm tra lần lượt các điều kiện sai
    if (!okPassConfirmNotEmpty) {
      ShowError(password_confirm, "Không được để trống");
    } else {
      if (!isPasswordMatch(password, password_confirm)) {
        ShowError(password_confirm, "Mật khẩu không khớp");
      }
      if (isPasswordMatch(password, password_confirm)) {
        // hợp lệ: xóa các lỗi liên quan nếu còn
        ShowSuccess(password_confirm, [
          "Không được để trống",
          "Mật khẩu không khớp",
        ]);
        okPassConfirm = true;
      }
    }

    // nếu tất cả hợp lệ -> lưu
    if (okUsername && okEmail && okPassword && okPassConfirm) {
      const ds_tk = JSON.parse(localStorage.getItem("ds_tk") || "[]");
      const tk_moi = {
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value,
      };
      ds_tk.push(tk_moi);
      localStorage.setItem("ds_tk", JSON.stringify(ds_tk));
      alert("Tạo tài khoản thành công!");
      form1.reset();
      container.classList.remove("active");
    }
  });
}

/* --- Sửa phần login: CheckLogin trả về boolean, hiển thị lỗi tại submit --- */
const usernameLogin = document.getElementById("username-login");
const passwordLogin = document.getElementById("password-login");

function checkLoginCredentials(userInput, passInput) {
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk")) || [];
  const user = (userInput.value || "").toString().trim();
  const pass = (passInput.value || "").toString();
  return ds_tk.some((acc) => acc.username === user && acc.password === pass);
}

const form2 = document.getElementById("form-sign-in");
if (form2) {
  form2.addEventListener("submit", function (e) {
    e.preventDefault();
    // xóa lỗi cũ
    [usernameLogin, passwordLogin].forEach((inp) => {
      if (!inp) return;
      const parent = inp.parentElement;
      parent.querySelectorAll(".error").forEach((el) => el.remove());
    });

    let okUser = isNotEmpty(usernameLogin);
    let okPass = isNotEmpty(passwordLogin);

    if (!okUser) ShowError(usernameLogin, "Không được để trống");
    if (!okPass) ShowError(passwordLogin, "Không được để trống");

    if (okUser && okPass) {
      const valid = checkLoginCredentials(usernameLogin, passwordLogin);
      if (!valid) {
        ShowError(passwordLogin, "Tên đăng nhập hoặc mật khẩu không đúng");
      } else {
        ShowSuccess(passwordLogin, "Tên đăng nhập hoặc mật khẩu không đúng");
        alert("Đăng nhập thành công"); // tiếp hành động
        form2.reset();
      }
    }
  });
}

/* Làm chuyển động web */
const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

/* chuyển sang trang đăng ký */
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
  ShowSuccess(username, [
    "Không được để trống",
    "Ký tự đầu phải là chữ cái (A-Z hoặc a-z)",
    "Tên đăng nhập phải từ 3 đến 15 ký tự",
    "Tên đăng nhập đã tồn tại",
  ]);
  ShowSuccess(email, [
    "Không được để trống",
    "Email không hợp lệ",
    "Email đã được sử dụng",
  ]);
  ShowSuccess(password, [
    "Không được để trống",
    `Mật khẩu phải từ 6 đến 25 ký tự`,
    "Mật khẩu phải có ít nhất 1 chữ cái, 1 chữ số và 1 ký tự đặc biệt",
  ]);
  ShowSuccess(password_confirm, ["Không được để trống", "Mật khẩu không khớp"]);
  form1.reset();
});

/* chuyển sang trang đăng nhập */
loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
  ShowSuccess(usernameLogin, "Không được để trống");
  ShowSuccess(passwordLogin, "Không được để trống");
  ShowSuccess(passwordLogin, "Tên đăng nhập hoặc mật khẩu không đúng");
  form2.reset();
});
