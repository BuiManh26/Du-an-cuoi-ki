/* khai báo đăng ký */
const form = document.getElementById("form-register");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password_confirm = document.getElementById("password-confirm");

/* khai báo đăng nhập  */
const usernameLogin = document.getElementById("username-login");
const passwordLogin = document.getElementById("password-login");

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
        id: Date.now(), // tạo id ngẫu nhiên
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value,
        role: "user",
      };
      ds_tk.push(tk_moi);
      localStorage.setItem("ds_tk", JSON.stringify(ds_tk));
      alert("Tạo tài khoản thành công!");
      form1.reset();
      container.classList.remove("active");
    }
  });
}
/* --- End Sửa phần đăng ký: Hiển thị lỗi tại submit --- */

/* --- Submit handler: chỉ khi nhấn nút mới hiển thị lỗi bằng ShowError / ShowSuccess --- */
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
        const role = checkrole(usernameLogin);
        if (role === "admin") {
          const tk_dang_nhap = {
            username: usernameLogin.value.trim(),
            role: role,
          };
          localStorage.setItem("tk_dang_nhap", JSON.stringify(tk_dang_nhap));
          alert("Đăng nhập thành công! Chuyển đến trang Quản trị viên.");
          window.location.href = "Admin.html";
        } else {
          const tk_dang_nhap = {
            username: usernameLogin.value.trim(),
            role: role,
          };
          localStorage.setItem("tk_dang_nhap", JSON.stringify(tk_dang_nhap));
          alert("Đăng nhập thành công! Chuyển đến trang Người dùng.");
          window.location.href = "User.html";
        }
        form2.reset();
      }
    }
  });
}
/* --- End Sửa phần login: CheckLogin trả về boolean, hiển thị lỗi tại submit --- */

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

// Tạo tài khoản admin mặc định nếu chưa có
const ds_tk = JSON.parse(localStorage.getItem("ds_tk")) || [];
const adminExists = ds_tk.some((tk) => tk.role === "admin");
if (!adminExists) {
  const adminAccount = {
    id: Date.now(),
    username: "admin",
    email: "",
    password: "123963ads!",
    role: "admin",
  };
  ds_tk.push(adminAccount);
  localStorage.setItem("ds_tk", JSON.stringify(ds_tk));
}
