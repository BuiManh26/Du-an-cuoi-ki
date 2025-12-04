const from = document.getElementById("addAccountForm");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const roleInput = document.getElementById("role");
const bang = document.getElementById("accountTableBody");
const xoa = document.getElementById("deleteAccountBtn");

// Hàm hiển thị danh sách tài khoản
function displayAccounts() {
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk")) || [];
  // đọc tài khoản đang đăng nhập (nếu có)
  let logged = null;
  const tkRaw = localStorage.getItem("tk_dang_nhap");
  if (tkRaw) {
    try {
      logged = JSON.parse(tkRaw);
    } catch (err) {
      console.error("Không parse được tk_dang_nhap:", err);
      logged = null;
    }
  }

  // clear table body before render
  bang.innerHTML = "";

  for (let i = 0; i < ds_tk.length; i++) {
    const element = ds_tk[i];
    if (!element) continue;

    const accUsername = element.username;
    const accRole = element.role;
    const accCreatedAt = new Date(element.id).toLocaleString();
    const tr = document.createElement("tr");

    const name = document.createElement("td");
    const DateCreated = document.createElement("td");
    const role = document.createElement("td");
    const act = document.createElement("td");

    name.innerText = accUsername;
    DateCreated.innerText = accCreatedAt;
    role.innerText = accRole;

    // tạo nút xóa gắn class
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.dataset.id = element.id; // lưu id vào data-id
    delBtn.textContent = "Xóa";

    // nếu là tài khoản hiện đang đăng nhập -> đổi màu hành động thành xanh
    const isLoggedAccount =
      logged &&
      logged.username &&
      logged.username.toString().trim() === accUsername.toString().trim();

    if (isLoggedAccount) {
      // dùng lớp bootstrap màu xanh
      delBtn.className = "btn btn-primary btn-sm ";
      delBtn.textContent = "online";
      // thêm nền nhẹ cho dòng để nổi bật
      tr.style.backgroundColor = "#e9f5ff";
    } else {
      delBtn.className = "btn btn-danger btn-sm delete-account-btn";
    }

    act.appendChild(delBtn);

    tr.appendChild(name);
    tr.appendChild(DateCreated);
    tr.appendChild(role);
    tr.appendChild(act);
    bang.appendChild(tr);
  }
}

// Hàm xóa tài khoản theo id
function deleteAccount(id) {
  // đọc danh sách từ localStorage
  const raw = localStorage.getItem("ds_tk");
  let accounts;
  if (raw) {
    accounts = JSON.parse(raw);
  } else {
    accounts = [];
  }
  // chuẩn hóa id để so sánh
  const targetId = Number(id);

  // tạo mảng mới chứa những account không có id bằng targetId
  const remaining = [];
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const accountId = Number(account.id); // chuẩn hóa kiểu
    if (accountId !== targetId) {
      remaining.push(account);
    }
  }

  // nếu không có thay đổi (không tìm thấy id) thì thôi
  if (remaining.length === accounts.length) return;

  // lưu lại và cập nhật giao diện
  localStorage.setItem("ds_tk", JSON.stringify(remaining));
  displayAccounts();
}

from.addEventListener("submit", function (e) {
  e.preventDefault();
  // Xóa lỗi cũ
  [usernameInput, emailInput, passwordInput, roleInput].forEach((inp) => {
    if (!inp) return;
    const parent = inp.parentElement;
    const errs = parent.querySelectorAll(".error");
    errs.forEach((el) => el.remove());
  });

  // Chạy các validate, lưu kết quả boolean
  const okUserNotEmpty = isNotEmpty(usernameInput);
  const okEmailNotEmpty = isNotEmpty(emailInput);
  const okPassNotEmpty = isNotEmpty(passwordInput);

  let okUsername = false;
  let okEmail = false;
  let okPassword = false;

  // username: kiểm tra lần lượt các điều kiện sai
  if (!okUserNotEmpty) {
    ShowError(usernameInput, "Không được để trống");
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

  if (okUsername && okEmail && okPassword) {
    // Lấy danh sách tài khoản từ localStorage
    const ds_tk = JSON.parse(localStorage.getItem("ds_tk")) || [];

    // Tạo đối tượng tài khoản mới
    const newAccount = {
      id: Date.now(), // tạo id ngẫu nhiên
      username: usernameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      role: roleInput.value,
    };
    // Thêm tài khoản mới vào danh sách
    ds_tk.push(newAccount);
    // Lưu danh sách tài khoản vào localStorage
    localStorage.setItem("ds_tk", JSON.stringify(ds_tk));
    alert("Tạo tài khoản thành công!");
    // Reset form
    from.reset();
  }
  // Cập nhật lại bảng hiển thị
  displayAccounts();
});

// thay thế listener cũ bằng delegation: bắt click trên tbody, nếu là nút xóa => xóa account
bang.addEventListener("click", function (e) {
  const btn = e.target.closest(".delete-account-btn");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (!confirm("Xóa tài khoản này?")) return;
  deleteAccount(id);
});

// Hiển thị danh sách tài khoản khi tải trang
displayAccounts();

const exitBtn = document.getElementById("exit");
exitBtn.addEventListener("click", function () {
  // Xóa thông tin tài khoản đang đăng nhập khỏi localStorage
  localStorage.removeItem("tk_dang_nhap");
  // Chuyển hướng về trang đăng nhập
  window.location.href = "index.html";
});
