let dataList = JSON.parse(localStorage.getItem("noidungList")) || [];
// Lưu vào LocalStorage
function saveToLocal() {
  localStorage.setItem("noidungList", JSON.stringify(dataList));
}

// Load lại danh sách khi mở trang
function loadFromLocal() {
  dataList.forEach((item) => renderItem(item));
}

// Hàm để tránh XSS
window.onload = loadFromLocal;

// Hàm lưu nội dung bài đăng
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

// hàm hiển thị nội dung bài đăng
function renderItem(item) {
  const dsnoidung = document.getElementById("dsnoidung");
  const li = document.createElement("div");

  li.className = "p-3 shadow rounded mt-3 border";
  li.setAttribute("data-id", item.id);

  li.innerHTML = `
    <h4>${item.username}</h4>
    <h5>${item.tieude}</h5>
    <p class="overflow-y-auto " style=" max-height:100px;" >${item.noidung}</p>
    <div class="d-flex gap-2 align-items-center">
      <p class="small">Chủ đề: ${item.chude}</p>
      <p class="small">Mô tả: ${item.mota}</p>
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

  //bài đăng private
  if (item.role === "Private") {
    li.querySelector("h4").textContent = "Bài đăng riêng tư";
    li.querySelector("h5").textContent = "Bài đăng riêng tư";
    li.querySelector("p").textContent = "Nội dung bài đăng này là riêng tư.";
  }
  //ẩn bài private nếu không phải người tạo
  if (
    item.role === "Private" &&
    item.username !==
      (JSON.parse(localStorage.getItem("tk_dang_nhap")) || {}).username
  ) {
    li.style.display = "none";
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
  // lưu số lượt thích vào localstorage
  let savedLikes = JSON.parse(localStorage.getItem("likeCounts")) || {};
  if (savedLikes[item.id]) {
    likeCount = savedLikes[item.id];
    likeCountDisplay.textContent = `Lượt thích: ${likeCount}`;
  }
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
    savedLikes[item.id] = likeCount;
    localStorage.setItem("likeCounts", JSON.stringify(savedLikes));
  };

  //thêm bình luận
  // Lấy tất cả bình luận từ Local
  let allComments = getComments();
  let commentList = allComments[item.id] || [];

  // Vùng hiển thị bình luận
  const commentSection = document.createElement("div");
  commentSection.className = "mt-2 overflow-y-auto flex-wrap ";
  commentSection.style.maxHeight = "200px";
  li.appendChild(commentSection);

  // Hiển thị bình luận đã lưu
  commentList.forEach((c) => {
    const p = document.createElement("p");
    if (c && typeof c === "object") {
      p.textContent = `${c.user}: ${c.text}`;
    }
    commentSection.appendChild(p);
  });

  // Người bình luận
  const commenter = (JSON.parse(localStorage.getItem("tk_dang_nhap")) || {})
    .username;

  // Nút bình luận (hiển thị trong danh sách)
  const commentBtn = document.createElement("button");
  commentBtn.className = "btn btn-sm btn-secondary ms-2";
  commentBtn.textContent = "Bình luận";
  li.appendChild(commentBtn);

  // Xử lý khi nhấn nút bình luận
  check = false;
  commentBtn.onclick = function () {
    // tránh tạo nhiều input
    if (check) {
      input.remove();
      send.remove();
      check = false;
      return;
    }

    // tạo input bình luận
    const input = document.createElement("input");
    input.className = "form-control my-2";
    input.placeholder = "Viết bình luận...";
    li.appendChild(input);
    // tạo nút gửi bình luận
    const send = document.createElement("button");
    send.className = "btn btn-sm btn-primary";
    send.textContent = "Gửi";
    li.appendChild(send);
    check = true;

    // Gửi bình luận
    send.onclick = function () {
      if (input.value.trim() === "") {
        input.remove();
        send.remove();
        check = false;
        return;
      }
      // Hiển thị
      const p = document.createElement("p");
      p.textContent = `${commenter}: ${input.value}`;
      commentSection.appendChild(p);

      // Lưu dưới dạng object {user, text}
      commentList.push({ user: commenter, text: input.value });
      allComments[item.id] = commentList;
      saveComments(allComments);
      // Xóa input và nút gửi
      check = false;
      input.remove();
      send.remove();
    };
  };

  // nút popup xem chi tiết bài viết
  const detailBtn = document.createElement("button");
  detailBtn.className = "btn btn-sm btn-info ms-2";
  detailBtn.textContent = "Xem chi tiết";
  li.appendChild(detailBtn);

  // Xử lý khi nhấn nút xem chi tiết
  detailBtn.onclick = function () {
    let popup = document.getElementById("detailPopup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "detailPopup";
      popup.style =
        "position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.45); z-index:9999;";

      const box = document.createElement("div");
      box.style =
        "background:#fff; padding:18px; border-radius:8px; max-width:720px; width:92%; position:relative; box-shadow:0 8px 24px rgba(0,0,0,0.2);";

      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.textContent = "×";
      closeBtn.style =
        "position:absolute; right:10px; top:6px; font-size:20px; border:none; background:transparent; cursor:pointer;";
      closeBtn.addEventListener("click", () => popup.remove());
      box.appendChild(closeBtn);

      const message = document.createElement("div");
      message.id = "detailPopupMessage";
      box.appendChild(message);

      popup.appendChild(box);
      document.body.appendChild(popup);

      // đóng khi click ra ngoài
      popup.addEventListener("click", (e) => {
        if (e.target === popup) popup.remove();
      });
    }

    const popupMessage = document.getElementById("detailPopupMessage");
    if (popupMessage) {
      // Nội dung + khu vực like + comments
      popupMessage.innerHTML = `
        <h4>${item.username || "Người dùng"}</h4>
        <h5>${item.tieude}</h5>
        <p class="overflow-y-auto flex-wrap " style=" max-height:200px;">${
          item.noidung
        }</p>
        <div class="d-flex gap-2 align-items-center">
          <p class="small">Chủ đề: ${item.chude}</p>
          <p class="small">${item.time}</p>
          <p class="btn btn-sm btn-light border rounded-pill px-3">${
            item.role
          }</p>
        </div>
        <div class="mt-3">
          <button id="detailLikeBtn" class="btn btn-sm btn-primary">Thích</button>
          <span id="detailLikeCount" class="ms-2">0 lượt thích</span>
        </div>
        <hr />
        <div id="detailCommentsSection">
          <h6>Bình luận</h6>
          <div id="detailCommentsList" class="overflow-y-auto flex-wrap " style=" max-height:200px;" ></div>
          <div class="mt-2 d-flex gap-2">
            <input id="detailCommentInput" class="form-control" placeholder="Viết bình luận..." />
            <button id="detailCommentSend" class="btn btn-sm btn-primary">Gửi</button>
          </div>
        </div>
      `;

      // Thiết lập like count từ localStorage
      const savedLikes2 = JSON.parse(localStorage.getItem("likeCounts")) || {};
      const likeCountEl = document.getElementById("detailLikeCount");
      const likeBtn = document.getElementById("detailLikeBtn");
      let count = savedLikes2[item.id] || 0;
      if (likeCountEl) likeCountEl.textContent = `${count} lượt thích`;

      // Toggle like (lưu chỉ là count global)
      if (likeBtn) {
        likeBtn.addEventListener("click", () => {
          const saved = JSON.parse(localStorage.getItem("likeCounts")) || {};
          let c = saved[item.id] || 0;
          const liked = likeBtn.dataset.liked === "1";
          if (!liked) {
            c++;
            likeBtn.dataset.liked = "1";
            likeBtn.classList.remove("btn-primary");
            likeBtn.classList.add("btn-success");
            likeBtn.textContent = "Đã thích";
          } else {
            c = Math.max(0, c - 1);
            likeBtn.dataset.liked = "0";
            likeBtn.classList.remove("btn-success");
            likeBtn.classList.add("btn-primary");
            likeBtn.textContent = "Thích";
          }
          saved[item.id] = c;
          localStorage.setItem("likeCounts", JSON.stringify(saved));
          if (likeCountEl) likeCountEl.textContent = `${c} lượt thích`;
          // cập nhật phần hiển thị trong danh sách nếu có
          const entry = document.querySelector(`[data-id="${item.id}"]`);
          if (entry) {
            const span = entry.querySelector("span.ms-2");
            if (span) span.textContent = `Lượt thích: ${c}`;
          }
        });
      }

      // Hiển thị danh sách bình luận hiện có
      const allComments2 = getComments();
      const comments = allComments2[item.id] || [];
      const commentsListEl = document.getElementById("detailCommentsList");
      if (commentsListEl) {
        commentsListEl.innerHTML = "";
        comments.forEach((c) => {
          const p = document.createElement("p");
          p.textContent = `${c.user}: ${c.text}`;
          commentsListEl.appendChild(p);
        });
      }

      // Gửi bình luận từ popup
      const sendBtn = document.getElementById("detailCommentSend");
      const inputComment = document.getElementById("detailCommentInput");
      if (sendBtn && inputComment) {
        sendBtn.addEventListener("click", () => {
          const text = inputComment.value.trim();
          if (!text) return;
          const commenter2 =
            (JSON.parse(localStorage.getItem("tk_dang_nhap")) || {}).username ||
            "Ẩn danh";
          // lưu comment object
          const all2 = getComments();
          const list = all2[item.id] || [];
          list.push({ user: commenter2, text });
          all2[item.id] = list;
          saveComments(all2);

          // cập nhật UI popup
          if (commentsListEl) {
            const p = document.createElement("p");
            p.textContent = `${commenter2}: ${text}`;
            commentsListEl.appendChild(p);
          }

          // cập nhật UI trong danh sách chính nếu có
          const entry = document.querySelector(`[data-id="${item.id}"]`);
          if (entry) {
            const cs = entry.querySelector(".mt-2");
            if (cs) {
              const p = document.createElement("p");
              p.textContent = `${commenter2}: ${text}`;
              cs.appendChild(p);
            }
          }

          inputComment.value = "";
        });
      }
    }
  };

  dsnoidung.appendChild(li);
}

// Các hàm lưu/đọc bình luận
function getComments() {
  return JSON.parse(localStorage.getItem("allComments")) || {};
}
function saveComments(comments) {
  localStorage.setItem("allComments", JSON.stringify(comments));
}

const exitBtn = document.getElementById("exit");
exitBtn.addEventListener("click", function () {
  // Xóa thông tin tài khoản đang đăng nhập khỏi localStorage
  localStorage.removeItem("tk_dang_nhap");
  // Chuyển hướng về trang đăng nhập
  window.location.href = "index.html";
});
