const form = document.getElementById("addAccountForm");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const role = document.getElementById("role");
const table = document.getElementById("accountTableBody");

function hienthids() {
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk") || "[]");
  const tk_dang_nhap = JSON.parse(localStorage.getItem("tk_dang_nhap") || "[]");

  if (!tk_dang_nhap.username) {
    alert("Cần đăng nhập để vào trang !");
    window.location.href = "index.html";
  }

  //xóa toàn bộ nội dung HTML bên trong phần tử
  table.innerHTML = "";

  for (let i = 0; i < ds_tk.length; i++) {
    const tk = ds_tk[i];

    const tr = document.createElement("tr");
    tr.id = tk.id;
    const username = document.createElement("td");
    username.textContent = tk.username;

    const date = document.createElement("td");
    date.textContent = new Date(tk.id).toLocaleString();

    const role = document.createElement("td");
    role.textContent = tk.role;

    const act = document.createElement("td");
    const btn = document.createElement("button");

    if (tk.username === tk_dang_nhap.username) {
      btn.className = "btn btn-primary btn-sm ";
      btn.textContent = "online";
    } else {
      btn.className = "btn btn-danger btn-sm ";
      btn.textContent = "Xóa";
    }

    table.appendChild(tr);
    tr.appendChild(username);
    tr.appendChild(date);
    tr.appendChild(role);
    tr.appendChild(act);
    act.appendChild(btn);
  }
}

// vào trang hiện danh sách
hienthids();

form.addEventListener("submit", function (e) {
  e.preventDefault();

  //Xóa các lỗi trong form
  xoaloiall(username);
  xoaloiall(email);
  xoaloiall(password);

  let checkusername = false;
  let checkemail = false;
  let checkpassword = false;

  // ===== kiểm tra tên đăng nhập =====
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

  if (checkusername && checkemail && checkpassword) {
    const ds_tk = JSON.parse(localStorage.getItem("ds_tk") || "[]");
    const tk_moi = {
      id: Date.now(),
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value.trim(),
      role: role.value,
    };
    ds_tk.push(tk_moi);
    localStorage.setItem("ds_tk", JSON.stringify(ds_tk));
    alert("Tạo tài khoản thành công!");
    form.reset();
  }

  hienthids();
});

// Xóa tài khoản
table.addEventListener("click", function (e) {
  const btn = e.target.parentElement;
  const bang = btn.parentElement;
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk") || "[]");
  const kiemtra = [];
  if (btn.textContent === "Xóa") {
    if (!confirm("Xóa tài khoản này?")) return;
    for (let i = 0; i < ds_tk.length; i++) {
      if (Number(ds_tk[i].id) !== Number(bang.id)) {
        kiemtra.push(ds_tk[i]);
      }
    }
  } else {
    return;
  }
  localStorage.setItem("ds_tk", JSON.stringify(kiemtra));
  hienthids();
});

//thoát về trang đăng nhập
const exitBtn = document.getElementById("exit");
exitBtn.addEventListener("click", function () {
  // Xóa thông tin tài khoản đang đăng nhập khỏi localStorage
  localStorage.removeItem("tk_dang_nhap");
  window.location.href = "index.html";
});
