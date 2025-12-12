// lấy dữ liệu đã lưu
let dsbai = JSON.parse(localStorage.getItem("ds_bai")) || [];
let dsthich = JSON.parse(localStorage.getItem("ds_thich")) || {};
let dsbl = JSON.parse(localStorage.getItem("ds_binh_luan")) || {};
let username = (JSON.parse(localStorage.getItem("tk_dang_nhap")) || {})
  .username;

// Kiểm tra phiên bản
if (!username) {
  alert("Cần đăng nhập để vào trang !");
  window.location.href = "index.html";
}
// tính tổng bài đăng của tôi
let tongBaiDang = 0;
for (let bai of dsbai) {
  if (bai.nguoiDang === username) {
    tongBaiDang++;
  }
}
document.getElementById("tongbaidang").innerText = tongBaiDang;
// bài public và private
let baiPublic = 0;
for (let bai of dsbai) {
  if (bai.nguoiDang === username && bai.cheDo === "Công khai") {
    baiPublic++;
  }
}
let baiPrivate = 0;
for (let bai of dsbai) {
  if (bai.nguoiDang === username && bai.cheDo === "Private") {
    baiPrivate++;
  }
}
document.getElementById("baipublic").innerText = baiPublic;
document.getElementById("baiprivate").innerText = baiPrivate;
// tính tổng lượt thích nhận được
let tongLuotThich = 0;
for (let bai of dsbai) {
  if (bai.nguoiDang === username) {
    tongLuotThich += dsthich[bai.id] || 0;
  }
}
document.getElementById("luotthich").innerText = tongLuotThich;
// tính tổng bình luận nhận được
let tongBinhLuan = 0;
for (let bai of dsbai) {
  if (bai.nguoiDang === username) {
    tongBinhLuan += dsbl[bai.id] ? dsbl[bai.id].length : 0;
  }
}
document.getElementById("binhluan").innerText = tongBinhLuan;
// xếp bài đăng theo chủ đề
let baiTheoChuDe = {};
for (let bai of dsbai) {
  if (bai.nguoiDang === username) {
    if (!baiTheoChuDe[bai.chude]) {
      baiTheoChuDe[bai.chude] = 0;
    }
    baiTheoChuDe[bai.chude]++;
  }
}
let xepChuDeText = "";
for (let chuDe in baiTheoChuDe) {
  xepChuDeText += `${chuDe}: ${baiTheoChuDe[chuDe]} bài\n`;
}
document.getElementById("xepchude").innerText = xepChuDeText;
