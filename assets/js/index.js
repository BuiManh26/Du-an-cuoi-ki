const usernameLogin = document.getElementById("username-login");
const passwordLogin = document.getElementById("password-login");

// kiem tra dang nhap
function ktdangnhap(usernameLogin, passwordLogin) {
  const username = usernameLogin.value.trim();
  const password = passwordLogin.value.trim();
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk") || "[]");
  let check = false;
  for (let i = 0; i < ds_tk.length; i++) {
    if (username === ds_tk[i].username && password === ds_tk[i].password) {
      check = true;
      break;
    }
  }
  return check;
}

// check role
function ktrole(input) {
  const username = input.value.trim();
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk") || "[]");
  for (let i = 0; i < ds_tk.length; i++) {
    if (username === ds_tk[i].username) {
      return ds_tk[i].role;
    }
  }
}
const form2 = document.getElementById("form-sign-in");
form2.addEventListener("submit", function (e) {
  e.preventDefault();
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk") || "[]");
  xoaloiall(usernameLogin);
  xoaloiall(passwordLogin);

  let checkusernameLogin = false;
  let checkpasswordLogin = false;

  // ===== Kiểm tra tên đăng nhập =====
  if (kttrong(usernameLogin)) {
    checkusernameLogin = true;
    xoaloi(usernameLogin, "Không được để trống");
  } else {
    hienthiloi(usernameLogin, "Không được để trống");
    checkusernameLogin = false;
  }
  // ===== Kiểm tra mật khẩu =====
  if (kttrong(passwordLogin)) {
    checkpasswordLogin = true;
    xoaloi(passwordLogin, "Không được để trống");
  } else {
    hienthiloi(passwordLogin, "Không được để trống");
    checkpasswordLogin = false;
  }

  if (checkpasswordLogin && checkusernameLogin) {
    if (ktdangnhap(usernameLogin, passwordLogin)) {
      xoaloi(passwordLogin, "Tên đăng nhập hoặc mật khẩu không đúng");
      if (ktrole(usernameLogin) === "admin") {
        tk_dang_nhap(usernameLogin);
        alert("Đăng nhập thành công! Chuyển đến trang Quản trị viên.");
        window.location.href = "Admin.html";
      } else {
        tk_dang_nhap(usernameLogin);
        alert("Đăng nhập thành công! Chuyển đến trang Người dùng.");
        window.location.href = "User.html";
      }
    } else {
      hienthiloi(passwordLogin, "Tên đăng nhập hoặc mật khẩu không đúng");
    }
  }
});

// Tạo tài khoản admin mặc định nếu chưa có
const ds_tk = JSON.parse(localStorage.getItem("ds_tk")) || [];
let kt = true;
for (let i = 0; i < ds_tk.length; i++) {
  if (ds_tk[i].role === "admin") {
    kt = false;
    break;
  }
}
if (kt) {
  const tkadmin = {
    id: Date.now(),
    username: "admin",
    email: "",
    password: "1",
    role: "admin",
  };
  ds_tk.push(tkadmin);
  localStorage.setItem("ds_tk", JSON.stringify(ds_tk));
}

/* --- Chuyển trang khi ấn nút Sign Up / Sign In --- */
const signUpButton1 = document.getElementById("login-up1");
if (signUpButton1) {
  signUpButton1.addEventListener("click", () => {
    window.location.href = "Signup.html";
  });
}
const signUpButton2 = document.getElementById("login-up2");
if (signUpButton2) {
  signUpButton2.addEventListener("click", () => {
    window.location.href = "Signup.html";
  });
}
