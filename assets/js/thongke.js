// Thống kê cho trang User

// Đọc dữ liệu từ localStorage
const posts = JSON.parse(localStorage.getItem("noidungList") || "[]");
const likeCounts = JSON.parse(localStorage.getItem("likeCounts") || "{}");
const allComments = JSON.parse(localStorage.getItem("allComments") || "{}");
const current = JSON.parse(localStorage.getItem("tk_dang_nhap") || "{}");

// Người dùng đang đăng nhập
const username = current.username || null;

// Lọc bài đăng của user hiện tại (nếu không có user -> lấy tất cả)
const userPosts = username
  ? posts.filter((p) => p && p.username === username)
  : posts.filter((p) => p);

// Tính toán thống kê
const total = userPosts.length;

const publicCount = userPosts.filter(
  (p) =>
    p.role &&
    (p.role.toLowerCase().trim() === "công khai" ||
      p.role.toLowerCase().trim() === "public")
).length;

const privateCount = total - publicCount;

// Lượt thích nhận
let likesReceived = 0;
userPosts.forEach((p) => {
  if (p && p.id) {
    likesReceived += Number(likeCounts[p.id] || 0);
  }
});

// Bình luận nhận
let commentsReceived = 0;
userPosts.forEach((p) => {
  if (p && p.id) {
    const list = allComments[p.id] || [];
    commentsReceived += Array.isArray(list) ? list.length : 0;
  }
});

// Xếp theo chủ đề
const byTopic = {};
userPosts.forEach((p) => {
  if (p) {
    const topic = (p.chude || "Không có chủ đề").trim();
    byTopic[topic] = (byTopic[topic] || 0) + 1;
  }
});

const topicCount = Object.keys(byTopic).length;

// Hàm cập nhật DOM
function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const p = el.querySelector("p");
  if (p) {
    p.innerText = value;
  } else {
    el.innerText = value;
  }
}

// Cập nhật khi DOM ready
function applyStats() {
  setText("tongbaidang", total);
  setText("baipublic", publicCount);
  setText("baiprivate", privateCount);
  setText("luotthich", likesReceived);
  setText("binhluan", commentsReceived);
  setText("xepchude", topicCount);
}

// Chạy khi DOM sẵn sàng
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyStats);
} else {
  applyStats();
}
