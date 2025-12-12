// lấy các phần tử từ localStorage
let dsBaiViet = JSON.parse(localStorage.getItem("ds_bai")) || [];
let dsLuotThich = JSON.parse(localStorage.getItem("ds_thich")) || {};
let dsBinhLuan = JSON.parse(localStorage.getItem("ds_binh_luan")) || {};
let users = JSON.parse(localStorage.getItem("ds_tk")) || [];
let tenNguoiDungHienTai = (
  JSON.parse(localStorage.getItem("tk_dang_nhap")) || {}
).username;

// Kiểm tra phiên bản
if (!tenNguoiDungHienTai) {
  alert("Cần đăng nhập để vào trang !");
  window.location.href = "index.html";
}

// tính tổng số người dùng
let tongUser = 0;
for (const user of users) {
  if (user.role === "user") {
    tongUser++;
  }
}
document.getElementById("tonguser").innerText = tongUser;

// tính tổng số bài viết
document.getElementById("tongbaidang").innerText = dsBaiViet.length;
//tổng bài public
let tongBaiPublic = 0;
for (let bai of dsBaiViet) {
  if (bai.cheDo === "Công khai") {
    tongBaiPublic++;
  }
}
document.getElementById("baipublic").innerText = tongBaiPublic;
//tổng bài private
let tongBaiPrivate = 0;
for (let bai of dsBaiViet) {
  if (bai.cheDo === "Private") {
    tongBaiPrivate++;
  }
}
document.getElementById("baiprivate").innerText = tongBaiPrivate;
// tính tổng số lượt thích
let tongLuotThichTatCa = 0;
for (let bai of dsBaiViet) {
  tongLuotThichTatCa += dsLuotThich[bai.id] || 0;
}
document.getElementById("luotthich").innerText = tongLuotThichTatCa;
// tính tổng số bình luận
let tongBinhLuanTatCa = 0;
for (let bai of dsBaiViet) {
  tongBinhLuanTatCa += dsBinhLuan[bai.id] ? dsBinhLuan[bai.id].length : 0;
}
document.getElementById("binhluan").innerText = tongBinhLuanTatCa;
