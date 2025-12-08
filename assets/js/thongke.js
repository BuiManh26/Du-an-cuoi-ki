// Thong ke cho trang User
// Đọc dữ liệu từ localStorage và đổ vào các phần tử trong User conten.html

(function(){
  // Helpers
  function readJSON(key){
    try{ return JSON.parse(localStorage.getItem(key)) || null; }catch(e){ return null; }
  }

  const posts = readJSON('noidungList') || [];
  const likeCounts = readJSON('likeCounts') || {};
  const allComments = readJSON('allComments') || {};

  // Người dùng đang đăng nhập
  const current = (readJSON('tk_dang_nhap')) || {};
  const username = current.username || null;

  // Tính toán chỉ số cho người dùng (nếu username null -> tính cho tất cả)
  const userPosts = username ? posts.filter(p => p.username === username) : posts.slice();

  const total = userPosts.length;
  const publicCount = userPosts.filter(p => (p.role || '').toLowerCase() === 'công khai' || (p.role || '').toLowerCase() === 'public').length;
  const privateCount = total - publicCount;

  // Lượt thích nhận: tổng lượt thích đã lưu cho tất cả bài của user
  let likesReceived = 0;
  userPosts.forEach(p => {
    const id = p.id;
    const c = likeCounts[id] || 0;
    likesReceived += Number(c) || 0;
  });

  // Bình luận nhận: tổng số bình luận cho bài của user
  let commentsReceived = 0;
  userPosts.forEach(p => {
    const list = allComments[p.id] || [];
    commentsReceived += list.length;
  });

  // Xếp theo chủ đề
  const byTopic = {};
  userPosts.forEach(p => {
    const topic = (p.chude || 'Không có chủ đề').trim();
    byTopic[topic] = (byTopic[topic] || 0) + 1;
  });

  // Điền vào DOM (nếu tồn tại) — giữ nguyên tiêu đề (h5) trong HTML, chỉ cập nhật <p>
  function setText(id, text){
    const el = document.getElementById(id);
    if(!el) return;
    // tìm phần <p> con để ghi số, nếu không có thì ghi vào element chính
    const p = el.querySelector('p');
    if(p) p.innerText = text;
    else el.innerText = text;
  }

  // When DOM ready
  function applyStats(){
    setText('tongbaidang', total);
    setText('baipublic', publicCount);
    setText('baiprivate', privateCount);
    setText('luotthich', likesReceived);
    setText('binhluan', commentsReceived);

    // Ghi số chủ đề (số loại chủ đề) vào ô `xepchude` — giữ nguyên tiêu đề
    const topicsEl = document.getElementById('xepchude');
    const topicCount = Object.keys(byTopic).length;
    if(topicsEl){
      const p = topicsEl.querySelector('p');
      if(p) p.innerText = topicCount;
      else topicsEl.innerText = topicCount;
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') applyStats();
  else document.addEventListener('DOMContentLoaded', applyStats);

})();
