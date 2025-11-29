const username = document.getElementById("username");
const password = document.getElementById("password");

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

/* in ra lỗi: nếu đã có cùng thông báo thì không tạo thêm */
function CheckLogin(input) {
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk")) || [];
  let isValid = false;
  const usernameValue = username.value.trim();
  const passwordValue = password.value.trim();
  for (let i = 0; i < ds_tk.length; i++) {
    if (
      ds_tk[i].username === usernameValue &&
      ds_tk[i].password === passwordValue
    ) {
      isValid = true;
      break;
    }
  }
  if (!isValid) {
    ShowError(input, "Tên đăng nhập hoặc mật khẩu không đúng");
  } else {
    ShowSuccess(input, "Tên đăng nhập hoặc mật khẩu không đúng");
  }
}

document.addEventListener("submit", function (e) {
  e.preventDefault();
  CheckEpmtyError(username);
  CheckEpmtyError(password);
  CheckLogin(password);
});
