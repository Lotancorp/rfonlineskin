// Fungsi untuk meng-handle file upload dan menampilkan tabel
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const rows = content.split("\n").map(row => row.split("\t"));
            displayTable(rows);
        };
        reader.readAsText(file);
        // Menyimpan nama file yang diunggah
        window.uploadedFileName = file.name; // Simpan nama file untuk digunakan saat menyimpan
    } else {
        alert("Please upload a valid .txt file.");
    }
}

// Fungsi untuk menampilkan tabel dengan data yang diimpor
function displayTable(data) {
    const tableContainer = document.getElementById("tableContainer");
    let tableHTML = "<table>";
    data.forEach((row, index) => {
        tableHTML += "<tr>";
        row.forEach(cell => {
            tableHTML += index === 0 ? `<th>${cell.trim()}</th>` : `<td contenteditable="false">${cell.trim()}</td>`;
        });
        tableHTML += "</tr>";
    });
    tableHTML += "</table>";
    tableContainer.innerHTML = tableHTML;
}

// Fungsi untuk toggle mode edit menggunakan switch
function toggleEditMode() {
    const isEditable = document.getElementById("editSwitch").checked;
    const cells = document.querySelectorAll("#tableContainer td");

    cells.forEach(cell => {
        cell.contentEditable = isEditable;
    });
}

// Fungsi untuk menyimpan file sebagai .txt saat ini
function saveData() {
    const rows = [];
    const tableRows = document.querySelectorAll("#tableContainer tr");

    tableRows.forEach((row, index) => {
        const rowData = [];
        const cells = row.querySelectorAll(index === 0 ? "th" : "td");
        
        cells.forEach(cell => {
            rowData.push(cell.innerText);
        });
        
        rows.push(rowData.join("\t"));
    });

    const fileContent = rows.join("\n");
    const blob = new Blob([fileContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = window.uploadedFileName || "EffectFileList.txt"; // Gunakan nama file yang diunggah atau nama default
    link.click();
}

// Fungsi untuk menambahkan kolom baru
function addColumn() {
    const table = document.querySelector("#tableContainer table");
    if (!table) return;

    table.querySelectorAll("tr").forEach((row, index) => {
        const newCell = document.createElement(index === 0 ? "th" : "td");
        newCell.contentEditable = "true";
        newCell.textContent = ""; // Set cell kosong
        row.appendChild(newCell);
    });
}

// Fungsi untuk menambahkan baris baru
function addRow() {
    const table = document.querySelector("#tableContainer table");
    if (!table) return;

    const newRow = document.createElement("tr");
    const columns = table.rows[0].cells.length;

    for (let i = 0; i < columns; i++) {
        const newCell = document.createElement("td");
        newCell.contentEditable = "true";
        newRow.appendChild(newCell);
    }
    table.appendChild(newRow);
}

// Fungsi pencarian pada tabel
function searchTable() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const table = document.querySelector("#tableContainer table");
    const rows = table.getElementsByTagName("tr");

    let found = false;
    for (let i = 1; i < rows.length; i++) { 
        const cells = rows[i].getElementsByTagName("td");
        for (let j = 0; j < cells.length; j++) {
            if (cells[j].innerText.toLowerCase().includes(searchTerm)) {
                rows[i].scrollIntoView({ behavior: "smooth", block: "center" });
                rows[i].style.backgroundColor = "#ffff99";
                found = true;
                break;
            } else {
                rows[i].style.backgroundColor = "";
            }
        }
        if (found) break;
    }

    if (!found) {
        alert("No results found.");
    }
}

// Event listener untuk pencarian dengan tombol Enter
document.getElementById("searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchTable();
    }
});

// Fungsi untuk scroll ke atas tabel
function scrollToTop() {
    const tableContainer = document.getElementById("tableContainer");
    tableContainer.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Fungsi untuk scroll ke bawah tabel
function scrollToBottom() {
    const tableContainer = document.getElementById("tableContainer");
    tableContainer.scrollTo({
        top: tableContainer.scrollHeight,
        behavior: "smooth"
    });
}

// Fungsi untuk menangani Enter key pada chef-bar
document.querySelector('.chef-bar').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Mencegah perilaku Enter default
        inputEff(); // Panggil fungsi inputEff
    }
});
function inputEff() {
    // Periksa apakah file yang diimpor adalah "EffectFileList.txt"
    const importedFile = document.getElementById('importFile').files[0];
    if (!importedFile || importedFile.name !== "EffectFileList.txt") {
        alert("Please import 'EffectFileList.txt' file to proceed.");
        return;
    }

    // Ambil nilai dari setiap elemen input
    const effNo = document.getElementById("numEff").value;
    const chef = document.getElementById("chefDropdown1").value;
    const option1 = document.getElementById("chefDropdown2").value;

    // Ubah nilai folder1 menjadi huruf kapital
    let folder1 = document.getElementById("textbox1").value.toUpperCase();

    // Ubah nilai folder2 menjadi huruf kapital dan tambahkan ".EFF" di akhir
    let folder2 = document.getElementById("textbox2").value.toUpperCase();
    folder2 += ".EFF"; // Tambahkan .EFF hanya sekali

    const isQGChecked = document.getElementById("qgCheckbox").checked;

    // Buat path kombinasi dengan backslash setelah titik
    let combinedPath;
    if (isQGChecked) {
        combinedPath = `.\\Chef\\QG\\EFF\\${chef}${option1}\\QG_${folder1}\\QG_${folder2}`;
    } else {
        combinedPath = `.\\Chef\\EFF\\${chef}${option1}\\${folder1}\\${folder2}`;
    }

    // Nilai default untuk kolom ke-3
    const defaultColumn3 = 0;

    // Pastikan tabel sudah ada di dalam #tableContainer
    const tableContainer = document.getElementById("tableContainer");
    if (tableContainer) {
        let table = tableContainer.querySelector("table");

        // Jika tabel belum ada, buat tabel baru
        if (!table) {
            table = document.createElement("table");
            tableContainer.appendChild(table);

            // Buat header kolom untuk tabel
            const headerRow = table.insertRow();
            headerRow.insertCell(0).innerText = "EFF No.";
            headerRow.insertCell(1).innerText = "Path";
            headerRow.insertCell(2).innerText = "Value";
        }

        // Tambahkan baris baru di akhir tabel
        const newRow = table.insertRow(-1);
        newRow.insertCell(0).innerText = effNo;
        newRow.insertCell(1).innerText = combinedPath;
        newRow.insertCell(2).innerText = defaultColumn3;
    } else {
        alert("Table container not found. Please ensure a table is displayed.");
    }
}

const loadButton = document.getElementById('loadEffects');
const saveButton = document.getElementById('saveEffects');
const inputButton = document.getElementById('inputEffects');
const effectListDiv = document.getElementById('effectList');

let effects = [];

loadButton.addEventListener('click', () => {
    fetch('https://raw.githubusercontent.com/Lotancorp/rfonlineskin/main/Effect/effect.txt')
        .then(response => response.text())
        .then(data => {
            effects = data.split('\n');
            renderEffects();
        });
});

saveButton.addEventListener('click', () => {
    const blob = new Blob([effects.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'effect.txt';
    a.click();
    URL.revokeObjectURL(url);
});

inputButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.style.display = 'none'; // Sembunyikan elemen input
    document.body.appendChild(input); // Tambahkan ke DOM
    input.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            effects = e.target.result.split('\n');
            renderEffects();
            document.body.removeChild(input); // Hapus elemen input setelah selesai
        };
        reader.readAsText(file);
    });
    input.click();
});

function renderEffects() {
    effectListDiv.innerHTML = '';
    effects.forEach((effect, index) => {
        const div = document.createElement('div');
        div.className = 'effect-item';
        const input = document.createElement('input');
        input.type = 'text';
        input.value = effect;
        input.onchange = e => {
            effects[index] = e.target.value;
        };
        div.appendChild(input);
        effectListDiv.appendChild(div);
    });
}

