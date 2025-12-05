let dataList = JSON.parse(localStorage.getItem("noidungList")) || [];

// Lưu vào LocalStorage
function saveToLocal() {
  localStorage.setItem("noidungList", JSON.stringify(dataList));
}

// Load lại danh sách khi mở trang
function loadFromLocal() {
  dataList.forEach((item) => renderItem(item));
}
window.onload = loadFromLocal;
function luund() {
  const tk_dang_nhap = JSON.parse(localStorage.getItem("tk_dang_nhap")) || {};
  const user = tk_dang_nhap.username;
  const tieude = document.getElementById("tieude").value;
  const chude = document.getElementById("chude").value;
  const mota = document.getElementById("mota").value;
  const noidung = document.getElementById("noidung").value;

  if (tieude === "" || chude === "" || mota === "" || noidung === "") {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  const newItem = {
    id: Date.now(),
    username: user,
    tieude,
    chude,
    mota,
    noidung,
    role: document.getElementById("role").value,
    time: new Date().toLocaleString(),
  };

  dataList.push(newItem);
  saveToLocal();
  renderItem(newItem);

  // Xóa form
  document.getElementById("tieude").value = "";
  document.getElementById("chude").value = "";
  document.getElementById("mota").value = "";
  document.getElementById("noidung").value = "";

  alert("Lưu nội dung thành công!");
}
function renderItem(item) {
  const dsnoidung = document.getElementById("dsnoidung");
  const li = document.createElement("div");

  li.className = "p-3 shadow rounded mt-3 border";
  li.setAttribute("data-id", item.id);

  li.innerHTML = `
    <h4>${item.username}</h4>
    <h5>${item.tieude}</h5>
    <p>${item.noidung}</p>
    <div class="d-flex gap-2 align-items-center">
      <p class="small">Chủ đề: ${item.chude}</p>
      <p class="small">${item.time}</p>
      <p class="btn btn-sm btn-light border rounded-pill px-3">${item.role}</p>
    </div>
    <button class="btn btn-sm btn-warning">Chỉnh sửa</button>
    <button class="btn btn-sm btn-danger">Xóa</button>
  `;

  // XÓA VÀ SỬA CHỈ HIỂN THỊ NẾU LÀ NGƯỜI TẠO
  if (
    item.username !==
    (JSON.parse(localStorage.getItem("tk_dang_nhap")) || {}).username
  ) {
    li.querySelector(".btn-warning").style.display = "none";
    li.querySelector(".btn-danger").style.display = "none";
  }
  // XÓA
  li.querySelector(".btn-danger").onclick = function () {
    li.remove();
    dataList = dataList.filter((x) => x.id !== item.id);
    saveToLocal();
  };

  // SỬA
  li.querySelector(".btn-warning").onclick = function () {
    document.getElementById("tieude").value = item.tieude;
    document.getElementById("chude").value = item.chude;
    document.getElementById("mota").value = item.mota;
    document.getElementById("noidung").value = item.noidung;

    // Xóa bản cũ
    li.remove();
    dataList = dataList.filter((x) => x.id !== item.id);
    saveToLocal();
  };
  //bài đăng ẩn danh
  if (item.role === "Ẩn danh") {
    li.querySelector("h4").textContent = "Người dùng ẩn danh";
  }

  //like
  const likeBtn = document.createElement("button");
  likeBtn.className = "btn btn-sm btn-primary";
  likeBtn.textContent = "Thích";
  likeBtn.onclick = function () {
    alert("Bạn đã thích bài đăng này!");
  };
  li.appendChild(likeBtn);
  // đếm like
  let likeCount = 0;
  const likeCountDisplay = document.createElement("span");
  likeCountDisplay.className = "ms-2";
  likeCountDisplay.textContent = `Lượt thích: ${likeCount}`;
  li.appendChild(likeCountDisplay);

  likeBtn.onclick = function () {
    likeCount++;
    likeCountDisplay.textContent = `Lượt thích: ${likeCount}`;
  };

  //togle nút like
  likeBtn.onclick = function () {
    if (likeBtn.classList.contains("btn-primary")) {
      likeBtn.classList.remove("btn-primary");
      likeBtn.classList.add("btn-success");
      likeBtn.textContent = "Đã thích";
      likeCount++;
    } else {
      likeBtn.classList.remove("btn-success");
      likeBtn.classList.add("btn-primary");
      likeBtn.textContent = "Thích";
      likeCount--;
    }
    likeCountDisplay.textContent = `Lượt thích: ${likeCount}`;
  };

  dsnoidung.appendChild(li);
}

const exitBtn = document.getElementById("exit");
exitBtn.addEventListener("click", function () {
  // Xóa thông tin tài khoản đang đăng nhập khỏi localStorage
  localStorage.removeItem("tk_dang_nhap");
  // Chuyển hướng về trang đăng nhập
  window.location.href = "index.html";
});
