function addFolder(parentUL = null, name = null) {
    
    // Nếu gọi từ nút "Thêm thư mục"
    if (!name) {
        name = document.getElementById("thumuc").value.trim();
        if (name === "") {
            alert("Vui lòng nhập tên thư mục!");
            return;
        }
    }

    if (!parentUL) parentUL = document.getElementById("dsthumuc");

    let li = document.createElement("li");

    // Tên thư mục
    let title = document.createElement("span");
    title.className = "folder-name";
    title.textContent = "📁 " + name;
    saveData();

    // Khối con
    let childUL = document.createElement("ul");
    childUL.style.display = "none";
    saveData(); 

    // Toggle mở/đóng thư mục
    title.onclick = function () {
        childUL.style.display = childUL.style.display === "none" ? "block" : "none";
    };

    // Nút thêm file
    let btnFile = document.createElement("button");
    btnFile.textContent = "+File";
    btnFile.onclick = function () {
        addFile(childUL);
        saveData();
    };

    // Nút thêm thư mục con
    let btnFolder = document.createElement("button");
    btnFolder.textContent = "+Folder";
    btnFolder.onclick = function () {
        let tenMoi = prompt("Tên thư mục con:");
        if (tenMoi) addFolder(childUL, tenMoi);
        saveData();
    };

    // Nút sửa
    let btnEdit = document.createElement("button");
    btnEdit.textContent = "Sửa";
    btnEdit.onclick = function () {
        let newName = prompt("Tên mới:", name);
        if (newName) {
            name = newName;
            title.textContent = "📁 " + name;
            saveData();
        }
    };

    // Nút xóa
    let btnDelete = document.createElement("button");
    btnDelete.textContent = "Xóa";
    btnDelete.onclick = function () {
        li.remove();
        saveData();
    };

    li.appendChild(title);
    li.appendChild(btnFile);
    li.appendChild(btnFolder);
    li.appendChild(btnEdit);
    li.appendChild(btnDelete);
    li.appendChild(childUL);

    parentUL.appendChild(li);
    document.getElementById("thumuc").value = "";
    saveData();
}

function addFile(parentUL) {
    let input = document.createElement("input");
    input.type = "file";

    input.onchange = function () {
        if (input.files.length === 0) return;

        let file = input.files[0];

        // Tạo URL tạm (Blob URL)
        let fileURL = URL.createObjectURL(file);

        // Tạo thẻ <li>
        let li = document.createElement("li");

        // Tạo thẻ <a> để click mở file
        let a = document.createElement("a");
        a.href = fileURL;
        a.textContent = "📄 " + file.name;
        a.target = "_blank"; // mở tab mới
        a.download = file.name; // cho phép tải về nếu muốn

        li.appendChild(a);
        parentUL.appendChild(li);
        saveData();
    };

    input.click();
}



function themfile() {
    const fileInput = document.getElementById("newfile");

    if (fileInput.files.length === 0) {
        alert("Vui lòng chọn file!");
        return;
    }

    const file = fileInput.files[0];
    const fileName = file.name;

    // Tạo URL tạm cho file
    const fileURL = URL.createObjectURL(file);

    // Tạo thẻ <li> chứa <a>
    const li = document.createElement("li");
    const link = document.createElement("a");

    link.innerText = fileName;
    link.href = fileURL;
    link.target = "_blank";   // mở tab mới

    li.appendChild(link);
    document.getElementById("dsthumuc").appendChild(li);

    // Reset input
    fileInput.value = "";
    saveData();

}
function saveData() {
    const root = document.getElementById("dsthumuc");

    function parseList(ul) {
        let arr = [];

        ul.querySelectorAll(":scope > li").forEach(li => {
            let title = li.querySelector(".folder-name");

            // Nếu là thư mục
            if (title) {
                let folderName = title.textContent.replace("📁 ", "");
                let childUL = li.querySelector("ul");

                arr.push({
                    type: "folder",
                    name: folderName,
                    children: parseList(childUL)
                });
            } 
            else {
                // Là file
                let a = li.querySelector("a");
                arr.push({
                    type: "file",
                    name: a.textContent.replace("📄 ", ""),
                    url: a.href
                });
            }
        });

        return arr;
    }

    const data = parseList(root);
    localStorage.setItem("file_tree", JSON.stringify(data));
}

function loadData() {
    let data = localStorage.getItem("file_tree");
    if (!data) return;

    data = JSON.parse(data);
    let root = document.getElementById("dsthumuc");

    function buildList(arr, parentUL) {
        arr.forEach(item => {
            if (item.type === "folder") {
                addFolder(parentUL, item.name); 

                // Lấy UL con vừa tạo
                let lastLI = parentUL.lastElementChild;
                let childUL = lastLI.querySelector("ul");

                buildList(item.children, childUL);
            }
            else if (item.type === "file") {
                let li = document.createElement("li");

                let a = document.createElement("a");
                a.href = item.url;
                a.textContent = "📄 " + item.name;
                a.target = "_blank";
                a.download = item.name;

                li.appendChild(a);
                parentUL.appendChild(li);
            }
        });
    }

    buildList(data, root);
}
window.onload = function () {
    loadData();
};
