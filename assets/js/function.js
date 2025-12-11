// hiển thị lỗi lên màn hình
function hienthiloi(input, loi) {
  const parent = input.parentElement;
  const small = document.createElement("small");
  small.innerText = loi;
  small.className = "error";
  parent.appendChild(small);
}

// xóa lỗi nhất định
function xoaloi(input, loi) {
  const parent = input.parentElement;
  const small = parent.querySelectorAll("small");
  for (let i = 0; i < small.length; i++) {
    if (small[i].innerText === loi) {
      small[i].remove();
    }
  }
}

//xóa các lỗi trong form
function xoaloiall(input) {
  const parent = input.parentElement;
  const small = parent.querySelectorAll("small");
  for (let i = 0; i < small.length; i++) {
    small[i].remove();
  }
}

//kt có bỏ trống ko
function kttrong(input) {
  input.value = input.value.trim();
  if (input.value === "") {
    return false;
  } else {
    return true;
  }
}

//kt do dai min
function ktdodaimin(input, min) {
  input.value = input.value.trim();
  if (input.value.length < min) {
    return false;
  } else {
    return true;
  }
}

//kt do dai max
function ktdodaimax(input, max) {
  input.value = input.value.trim();
  if (input.value.length > max) {
    return false;
  } else {
    return true;
  }
}

//kt email
function ktemail(input) {
  input.value = input.value.trim();
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regexEmail.test(input.value)) {
    return true;
  } else {
    return false;
  }
}

//kt mat  khau
function ktmktrung(input1, input2) {
  input1.value = input1.value.trim();
  input2.value = input2.value.trim();
  if (input1.value !== input2.value) {
    return false;
  } else {
    return true;
  }
}

//kt chữ cái đầu có phải chữ cái ko
function ktchucaidau(input) {
  input.value = input.value.trim();
  const chucai = input.value.charAt(0);
  const test = /[A-Za-z]/.test(chucai);
  return test;
}

//kt điều kiện tối thiểu
function ktmkmanh(input) {
  input.value = input.value.trim();
  const val = input.value;
  // dùng regex để kiểm tra
  const ktchucai = /[A-Za-z]/.test(val);
  const ktchuso = /\d/.test(val);
  const ktdacbiet = /[!@#$%^&*(),.?":{}|<>~`_\-\\\/\[\];'=+;:]/.test(val);
  if (ktchucai && ktchuso && ktdacbiet) {
    return true;
  } else {
    return false;
  }
}

//kt username trùng
function kt_trung_username(input) {
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk")) || [];
  const newUsername = input.value.trim();
  let check = true;
  if (newUsername === "") return check;
  for (let i = 0; i < ds_tk.length; i++) {
    if (ds_tk[i].username === newUsername) {
      check = false;
      break;
    }
  }
  return check;
}

//kt email trùng
function kt_trung_email(input) {
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk")) || [];
  const newUsername = input.value.trim();
  let check = true;
  if (newUsername === "") return check;
  for (let i = 0; i < ds_tk.length; i++) {
    if (ds_tk[i].email === newUsername) {
      check = false;
      break;
    }
  }
  return check;
}

//dao danh sach tai khoan dang nhap
function tk_dang_nhap(input) {
  const ds_tk = JSON.parse(localStorage.getItem("ds_tk") || "[]");
  const username = input.value.trim();
  for (let i = 0; i < ds_tk.length; i++) {
    if (username === ds_tk[i].username) {
      const tk_dang_nhap = {
        id: ds_tk[i].id,
        username: username,
        role: ds_tk[i].role,
      };
      localStorage.setItem("tk_dang_nhap", JSON.stringify(tk_dang_nhap));
    }
  }
}
