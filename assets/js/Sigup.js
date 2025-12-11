const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password_confirm = document.getElementById("password-confirm");
const form1 = document.getElementById("form-sign-up");

form1.addEventListener("submit", function (e) {
  e.preventDefault();

  let checkusername = false;
  let checkemail = false;
  let checkpassword = false;
  let checkpasswordconfirm = false;

  //xóa lỗi trên màn hình
  xoaloiall(username);
  xoaloiall(email);
  xoaloiall(password);
  xoaloiall(password_confirm);

  // ===== Kiểm tra tên đang nhập =====
  if (kttrong(username)) {
    checkusername = true;
    xoaloi(username, "Không được để trống");

    if (ktchucaidau(username)) {
      xoaloi(username, "Ký tự đầu phải là chữ cái (A-Z hoặc a-z)");
    } else {
      hienthiloi(username, "Ký tự đầu phải là chữ cái (A-Z hoặc a-z)");
      checkusername = false;
    }

    if (ktdodaimin(username, 3)) {
      xoaloi(username, "Tên đăng nhập ít nhất 3 ký tự");
    } else {
      hienthiloi(username, "Tên đăng nhập ít nhất 3 ký tự");
      checkusername = false;
    }

    if (ktdodaimax(username, 15)) {
      xoaloi(username, "Tên đăng nhập tối đa 15 ký tự");
    } else {
      hienthiloi(username, "Tên đăng nhập tối đa 15 ký tự");
      checkusername = false;
    }
  } else {
    hienthiloi(username, "Không được để trống");
    checkusername = false;
  }

  if (kt_trung_username(username)) {
    xoaloi(username, "Tên đăng nhập đã tồn tại");
  } else {
    hienthiloi(username, "Tên đăng nhập đã tồn tại");
    checkusername = false;
  }
  // ===== Kiểm tra email =====
  if (kttrong(email)) {
    checkemail = true;
    xoaloi(email, "Không được để trống");

    if (ktemail(email)) {
      xoaloi(email, "Email không hợp lệ");
    } else {
      hienthiloi(email, "Email không hợp lệ");
      checkemail = false;
    }
  } else {
    checkemail = false;
    hienthiloi(email, "Không được để trống");
  }

  if (kt_trung_email(email)) {
    xoaloi(email, "Email đã được sử dụng");
  } else {
    hienthiloi(email, "Email đã được sử dụng");
    checkemail = false;
  }
  // ===== Kiểm tra mật khẩu =====
  if (kttrong(password)) {
    checkpassword = true;
    xoaloi(password, "Không được để trống");

    if (ktdodaimin(password, 6)) {
      xoaloi(password, "Mật khẩu ít nhất 6 ký tự");
    } else {
      hienthiloi(password, "Mật khẩu ít nhất 6 ký tự");
      checkpassword = false;
    }

    if (ktdodaimax(password, 25)) {
      xoaloi(password, "Mật khẩu tối đa 25 ký tự");
    } else {
      hienthiloi(password, "Mật khẩu tối đa 25 ký tự");
      checkpassword = false;
    }

    if (ktmkmanh(password)) {
      xoaloi(password, "Mật khẩu phải bao gồm chữ cái, số và ký tự đặc biệt");
    } else {
      hienthiloi(
        password,
        "Mật khẩu phải bao gồm chữ cái, số và ký tự đặc biệt"
      );
      checkpassword = false;
    }
  } else {
    checkpassword = false;
    hienthiloi(password, "Không được để trống");
  }

  // ===== Xác thực mật khẩu =====
  if (kttrong(password_confirm)) {
    checkpasswordconfirm = true;
    xoaloi(password_confirm, "Không được để trống");

    if (ktmktrung(password, password_confirm)) {
      xoaloi(password_confirm, "Mật khẩu không khớp");
    } else {
      hienthiloi(password_confirm, "Mật khẩu không khớp");
      checkpasswordconfirm = false;
    }
  } else {
    checkpasswordconfirm = false;
    hienthiloi(password_confirm, "Không được để trống");
  }

  // ===== SUBMIT FORM =====
  if (checkemail && checkusername && checkpassword && checkpasswordconfirm) {
    const ds_tk = JSON.parse(localStorage.getItem("ds_tk") || "[]");
    const tk_moi = {
      id: Date.now(),
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value,
      role: "user",
    };
    ds_tk.push(tk_moi);
    localStorage.setItem("ds_tk", JSON.stringify(ds_tk));
    alert("Tạo tài khoản thành công!");
    form1.reset();
    window.location.href = "index.html";
  }
});

const signInButton = document.getElementById("login-in");

if (signInButton) {
  signInButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
