// Lấy dữ liệu đã lưu
let danhSachBaiViet = JSON.parse(localStorage.getItem("ds_bai")) || [];
let danhSachLuotThichTheoBai =
  JSON.parse(localStorage.getItem("ds_thich")) || {};
let danhSachBinhLuanTheoBai =
  JSON.parse(localStorage.getItem("ds_binh_luan")) || {};
let dangSuaId = null;
// Lưu danh sách postId mà mỗi user đã like: { username: [postId,...] }
let danhSachNguoiThichTheoUser =
  JSON.parse(localStorage.getItem("user_likes")) || {};

let tenNguoiDungHienTai = (
  JSON.parse(localStorage.getItem("tk_dang_nhap")) || {}
).username;

// Kiểm tra phiên bản
if (!tenNguoiDungHienTai) {
  alert("Cần đăng nhập để vào trang !");
  window.location.href = "index.html";
}

// Lưu dữ liệu
function luuDanhSachBaiViet() {
  localStorage.setItem("ds_bai", JSON.stringify(danhSachBaiViet));
}
function luuDanhSachLuotThich() {
  localStorage.setItem("ds_thich", JSON.stringify(danhSachLuotThichTheoBai));
}
function luuDanhSachNguoiThich() {
  localStorage.setItem(
    "user_likes",
    JSON.stringify(danhSachNguoiThichTheoUser)
  );
}
function luuDanhSachBinhLuan() {
  localStorage.setItem("ds_binh_luan", JSON.stringify(danhSachBinhLuanTheoBai));
}

function getLikeCount(id) {
  const v = danhSachLuotThichTheoBai[id];
  // Nếu nhỡ có mảng (dữ liệu cũ) thì trả về độ dài,
  // nhưng hệ thống giờ lưu là số nguyên (count).
  if (Array.isArray(v)) return v.length;
  if (typeof v === "number") return v;
  return 0;
}

// Chuẩn hóa dữ liệu ds_thich nếu trước đó lưu mảng
for (let id in danhSachLuotThichTheoBai) {
  if (Array.isArray(danhSachLuotThichTheoBai[id])) {
    danhSachLuotThichTheoBai[id] = danhSachLuotThichTheoBai[id].length;
  }
}
// Lưu lại nếu có thay đổi
luuDanhSachLuotThich();

// Hiển thị bài viết khi tải trang
window.onload = function () {
  for (let i = 0; i < danhSachBaiViet.length; i++) {
    hienThiMotBaiViet(danhSachBaiViet[i]);
  }
};

// Thêm bài viết mới
function themBaiViet() {
  let tieuDeNhap = document.getElementById("tieude").value.trim();
  let chuDeNhap = document.getElementById("chude").value.trim();
  let moTaNhap = document.getElementById("mota").value.trim();
  let noiDungNhap = document.getElementById("noidung").value.trim();
  let cheDoNhap = document.getElementById("role").value;
  if (!tieuDeNhap || !chuDeNhap || !moTaNhap || !noiDungNhap) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (dangSuaId) {
    // Cập nhật bài đã có (giữ nguyên id để bảo toàn like/comment)
    for (let i = 0; i < danhSachBaiViet.length; i++) {
      if (danhSachBaiViet[i].id === dangSuaId) {
        danhSachBaiViet[i].tieude = tieuDeNhap;
        danhSachBaiViet[i].chude = chuDeNhap;
        danhSachBaiViet[i].mota = moTaNhap;
        danhSachBaiViet[i].noidung = noiDungNhap;
        danhSachBaiViet[i].cheDo = cheDoNhap;
        // không thay đổi thoiGianTao để giữ lịch sử tạo
        luuDanhSachBaiViet();
        hienThiMotBaiViet(danhSachBaiViet[i]);
        break;
      }
    }
    dangSuaId = null;
  } else {
    let baiVietMoi = {
      id: Date.now(),
      nguoiDang: tenNguoiDungHienTai,
      tieude: tieuDeNhap,
      chude: chuDeNhap,
      mota: moTaNhap,
      noidung: noiDungNhap,
      cheDo: cheDoNhap,
      thoiGianTao: new Date().toLocaleString(),
    };

    danhSachBaiViet.push(baiVietMoi);
    luuDanhSachBaiViet();
    hienThiMotBaiViet(baiVietMoi);
  }

  tieude.value = "";
  chude.value = "";
  mota.value = "";
  noidung.value = "";

  alert("Đã lưu bài!");
}

// Hiển thị 1 bài viết
function hienThiMotBaiViet(baiViet) {
  let khung = document.createElement("div");
  khung.className = "p-3 shadow rounded border mt-3";

  if (
    baiViet.cheDo === "Private" &&
    baiViet.nguoiDang !== tenNguoiDungHienTai
  ) {
    khung.style.display = "none";
  }

  let tenHienThi =
    baiViet.cheDo === "Private" ? "Bài đăng riêng tư" : baiViet.nguoiDang;

  khung.innerHTML =
    "<h4>" +
    tenHienThi +
    "</h4>" +
    "<h5>" +
    (baiViet.cheDo === "Private" ? "Nội dung riêng tư" : baiViet.tieude) +
    "</h5>" +
    '<p class="overflow-y-auto flex-wrap " style=" max-height:100px;">' +
    (baiViet.cheDo === "Private"
      ? "Không thể xem nội dung."
      : baiViet.noidung) +
    "</p>" +
    '<div class="d-flex gap-2 small">' +
    "<span>Chủ đề: " +
    baiViet.chude +
    "</span>" +
    "<span>" +
    baiViet.thoiGianTao +
    "</span>" +
    '<span class="px-3 py-1 border rounded-pill">' +
    baiViet.cheDo +
    "</span>" +
    "</div>" +
    '<div class="d-flex align-items-center">' +
    '<button class="btn btn-sm btn-primary mt-2 nut-thich">Thích</button>' +
    '<span class="ms-2 so-luot-thich"></span>' +
    '<button class="btn btn-sm btn-info ms-2 nut-xem">Xem chi tiết</button>' +
    '<button class="btn btn-sm btn-secondary ms-2 nut-binh-luan">Bình luận</button>' +
    "</div>";

  // Hiển thị số lượt thích hiện có (mặc định 0)
  var soHienTai = Number(danhSachLuotThichTheoBai[baiViet.id] || 0);
  var elSo = khung.querySelector(".so-luot-thich");
  if (elSo) elSo.textContent = soHienTai + " lượt thích";

  // Khi người dùng nhấn 'Thích'
  khung.querySelector(".nut-thich").onclick = function () {
    // Lấy danh sách post đã like của user này
    if (!Array.isArray(danhSachNguoiThichTheoUser[tenNguoiDungHienTai])) {
      danhSachNguoiThichTheoUser[tenNguoiDungHienTai] = [];
    }
    var likedPosts = danhSachNguoiThichTheoUser[tenNguoiDungHienTai];

    // Nếu user đã like rồi thì không tăng nữa
    for (var ii = 0; ii < likedPosts.length; ii++) {
      if (likedPosts[ii] === baiViet.id) {
        alert("Bạn đã thích bài này rồi");
        return;
      }
    }

    // Tăng số lượt thích (số nguyên) và ghi nhận user đã like bài này
    var cur = Number(danhSachLuotThichTheoBai[baiViet.id] || 0);
    cur = cur + 1;
    danhSachLuotThichTheoBai[baiViet.id] = cur;
    likedPosts.push(baiViet.id);

    // Lưu cả hai cấu trúc vào localStorage
    luuDanhSachLuotThich();
    luuDanhSachNguoiThich();

    // Cập nhật hiển thị số lượt thích
    if (elSo) elSo.textContent = cur + " lượt thích";
  };

  khung.querySelector(".nut-binh-luan").onclick = function () {
    hienODeNhapBinhLuan(baiViet, khung);
  };

  khung.querySelector(".nut-xem").onclick = function () {
    moHopXemChiTiet(baiViet);
  };

  if (baiViet.nguoiDang === tenNguoiDungHienTai) {
    let nutSua = document.createElement("button");
    nutSua.className = "btn btn-sm btn-warning mt-2 mb-3 ";
    nutSua.textContent = "Sửa";
    nutSua.onclick = function () {
      suaBaiViet(baiViet, khung);
    };

    let nutXoa = document.createElement("button");
    nutXoa.className = "btn btn-sm btn-danger mt-2 ms-2 mb-3";
    nutXoa.textContent = "Xóa";
    nutXoa.onclick = function () {
      xoaBaiViet(baiViet, khung);
    };

    khung.appendChild(nutSua);
    khung.appendChild(nutXoa);
  }

  dsnoidung.appendChild(khung);

  // Hiển thị các bình luận đã lưu (nếu có) dưới mỗi bài
  let dsCmt = danhSachBinhLuanTheoBai[baiViet.id] || [];
  for (let j = 0; j < dsCmt.length; j++) {
    let dong = document.createElement("p");
    dong.style = "margin-bottom:5px;";
    dong.textContent = dsCmt[j].user + ": " + dsCmt[j].text;
    khung.appendChild(dong);
  }
}

// Sửa bài viết
function suaBaiViet(baiViet, khungHTML) {
  tieude.value = baiViet.tieude;
  chude.value = baiViet.chude;
  mota.value = baiViet.mota;
  noidung.value = baiViet.noidung;
  role.value = baiViet.cheDo;
  // Đánh dấu đang sửa, giữ nguyên id để bảo toàn like + bình luận
  dangSuaId = baiViet.id;
  khungHTML.remove();
}

// Xóa bài viết
function xoaBaiViet(baiViet, khungHTML) {
  for (let i = 0; i < danhSachBaiViet.length; i++) {
    if (danhSachBaiViet[i].id === baiViet.id) {
      danhSachBaiViet.splice(i, 1);
      break;
    }
  }

  khungHTML.remove();
  luuDanhSachBaiViet();
}

// Hiện ô nhập bình luận
function hienODeNhapBinhLuan(baiViet, khungHTML) {
  let oNhap = document.createElement("input");
  oNhap.placeholder = "Viết bình luận...";
  oNhap.className = "form-control mt-2";

  let nutGui = document.createElement("button");
  nutGui.className = "btn btn-sm btn-primary mt-2";
  nutGui.textContent = "Gửi";

  khungHTML.appendChild(oNhap);
  khungHTML.appendChild(nutGui);

  nutGui.onclick = function () {
    let noiDung = oNhap.value.trim();
    if (!noiDung) return;

    let cmt = {
      user: tenNguoiDungHienTai || "Ẩn danh",
      text: noiDung,
    };

    if (!danhSachBinhLuanTheoBai[baiViet.id]) {
      danhSachBinhLuanTheoBai[baiViet.id] = [];
    }

    danhSachBinhLuanTheoBai[baiViet.id].push(cmt);
    luuDanhSachBinhLuan();

    let dong = document.createElement("p");
    dong.style = "margin-bottom:5px;";
    dong.textContent = cmt.user + ": " + cmt.text;
    khungHTML.appendChild(dong);

    oNhap.remove();
    nutGui.remove();
  };
}

// Popup xem chi tiết
function moHopXemChiTiet(baiViet) {
  let nen = document.createElement("div");
  nen.style =
    "position:fixed; inset:0; background:rgba(0,0,0,0.4);" +
    "display:flex; justify-content:center; align-items:center; z-index:9999;";

  let hop = document.createElement("div");
  hop.style =
    "background:#fff; padding:20px; width:90%; max-width:600px; border-radius:8px;";

  hop.innerHTML =
    "<h3>" +
    baiViet.tieude +
    "</h3>" +
    '<p class="overflow-y-auto flex-wrap " style=" max-height:200px;" >' +
    baiViet.noidung +
    "</p>" +
    "<p><b>Chủ đề:</b> " +
    baiViet.chude +
    "</p>" +
    "<p><b>Thời gian:</b> " +
    baiViet.thoiGianTao +
    "</p>" +
    '<button class="btn btn-danger mt-2 nut-dong">Đóng</button>' +
    "<hr>" +
    "<h5>Like: " +
    getLikeCount(baiViet.id) +
    "</h5>" +
    "<h5>Bình luận</h5>" +
    '<div id="khung-binh-luan"></div>';

  let khungCmt = hop.querySelector("#khung-binh-luan");
  let ds = danhSachBinhLuanTheoBai[baiViet.id] || [];

  for (let i = 0; i < ds.length; i++) {
    let dong = document.createElement("p");
    dong.textContent = ds[i].user + ": " + ds[i].text;
    khungCmt.appendChild(dong);
  }

  hop.querySelector(".nut-dong").onclick = function () {
    nen.remove();
  };

  nen.appendChild(hop);
  document.body.appendChild(nen);
}

// Đăng xuất
exit.onclick = function () {
  localStorage.removeItem("tk_dang_nhap");
  location.href = "index.html";
};
