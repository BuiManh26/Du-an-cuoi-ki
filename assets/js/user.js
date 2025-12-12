// Lấy dữ liệu đã lưu
let danhSachBaiViet = JSON.parse(localStorage.getItem("ds_bai")) || [];
let danhSachLuotThichTheoBai =
  JSON.parse(localStorage.getItem("ds_thich")) || {};
let danhSachBinhLuanTheoBai =
  JSON.parse(localStorage.getItem("ds_binh_luan")) || {};

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
function luuDanhSachBinhLuan() {
  localStorage.setItem("ds_binh_luan", JSON.stringify(danhSachBinhLuanTheoBai));
}

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
    "<p>" +
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
    '<button class="btn btn-sm btn-primary mt-2 nut-thich">Thích</button>' +
    '<span class="ms-2 so-luot-thich"></span>' +
    '<button class="btn btn-sm btn-info ms-2 nut-xem">Xem chi tiết</button>' +
    '<button class="btn btn-sm btn-secondary ms-2 nut-binh-luan">Bình luận</button>';

  if (!danhSachLuotThichTheoBai[baiViet.id]) {
    danhSachLuotThichTheoBai[baiViet.id] = 0;
  }

  khung.querySelector(".so-luot-thich").textContent =
    danhSachLuotThichTheoBai[baiViet.id] + " lượt thích";

  khung.querySelector(".nut-thich").onclick = function () {
    danhSachLuotThichTheoBai[baiViet.id]++;
    khung.querySelector(".so-luot-thich").textContent =
      danhSachLuotThichTheoBai[baiViet.id] + " lượt thích";
    luuDanhSachLuotThich();
  };

  khung.querySelector(".nut-binh-luan").onclick = function () {
    hienODeNhapBinhLuan(baiViet, khung);
  };

  khung.querySelector(".nut-xem").onclick = function () {
    moHopXemChiTiet(baiViet);
  };

  if (baiViet.nguoiDang === tenNguoiDungHienTai) {
    let nutSua = document.createElement("button");
    nutSua.className = "btn btn-sm btn-warning mt-2 ms-2";
    nutSua.textContent = "Sửa";
    nutSua.onclick = function () {
      suaBaiViet(baiViet, khung);
    };

    let nutXoa = document.createElement("button");
    nutXoa.className = "btn btn-sm btn-danger mt-2 ms-2";
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
  for (let i = 0; i < danhSachBaiViet.length; i++) {
    if (danhSachBaiViet[i].id === baiViet.id) {
      danhSachBaiViet.splice(i, 1);
      break;
    }
  }

  khungHTML.remove();
  luuDanhSachBaiViet();
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
    "<p>" +
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
    (danhSachLuotThichTheoBai[baiViet.id] || 0) +
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
