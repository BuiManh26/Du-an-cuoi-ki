// thống kê tổng user (role = "user") trong hệ thống
const ds_tk = JSON.parse(localStorage.getItem("ds_tk") || "[]");
const tongUser = ds_tk.filter(
  (account) =>
    account && account.role && 
    account.role.toLowerCase().trim() === "user"
).length;
document.getElementById("tonguser").innerText = tongUser;

//thống kê tổng bài đăng
const noidungList = JSON.parse(localStorage.getItem("noidungList")) || [];
const tongBaiDang = noidungList.length;
document.getElementById("tongbaidang").innerText = tongBaiDang;

//thống kê bài public
const baiPublic = noidungList.filter(
  (item) =>
    item.role.toLowerCase() === "công khai" ||
    item.role.toLowerCase() === "public"
).length;
document.getElementById("baipublic").innerText = baiPublic;

//thống kê lượt thích
const likeCounts = JSON.parse(localStorage.getItem("likeCounts")) || {};
let tongLuotThich = 0;
noidungList.forEach((item) => {
  const id = item.id;
  const count = likeCounts[id] || 0;
  tongLuotThich += Number(count) || 0;
});
document.getElementById("tongluotthich").innerText = tongLuotThich;

//thống kê bình luận
const allComments = JSON.parse(localStorage.getItem("allComments")) || {};
let tongBinhLuan = 0;
noidungList.forEach((item) => {
  const id = item.id;
  const comments = allComments[id] || [];
  tongBinhLuan += comments.length;
});
document.getElementById("tongbinhluan").innerText = tongBinhLuan;

//thống kê bài private
const baiPrivate = tongBaiDang - baiPublic;
document.getElementById("baiprivate").innerText = baiPrivate;

// Hàm tiện ích để điền text vào phần tử có id
function setText(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  const p = ensureP(el);
  if (p) p.innerText = String(text);
  else el.innerText = String(text);
}

// Hàm đảm bảo phần tử có một thẻ <p> con để điền text vào
function ensureP(el) {
  if (!el) return null;
  // tìm p con đầu tiên
  let p = el.querySelector("p");
  if (p) return p;
  // nếu có h5, chèn sau h5, ngược lại append
  const h5 = el.querySelector("h5");
  p = document.createElement("p");
  p.innerText = "";
  if (h5) h5.insertAdjacentElement("afterend", p);
  else el.appendChild(p);
  return p;
}

// Áp dụng thống kê khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", applyStats);
function applyStats() {
  setText("tonguser", tongUser);
  setText("tongbaidang", tongBaiDang);
  setText("baipublic", baiPublic);
  setText("baiprivate", baiPrivate);
  setText("tongluotthich", tongLuotThich);
  setText("tongbinhluan", tongBinhLuan);
}
