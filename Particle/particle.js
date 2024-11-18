// Array untuk menyimpan nomor yang diekstraksi
let extractedNumbers = [];

// Fungsi untuk meng-handle file upload dan menampilkan tabel
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && (file.type === "text/plain" || file.name.endsWith(".ini"))) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const rows = content.split("\n");

            // Memproses setiap baris, hanya mengambil nomor dari baris yang sesuai format [PARTICLE####]
            extractedNumbers = []; // Reset extractedNumbers setiap kali file baru diunggah
            const formattedRows = rows.map(row => {
                const particleMatch = row.match(/\[PARTICLE(\d+)\]/);
                if (particleMatch) {
                    const number = parseInt(particleMatch[1], 10);
                    extractedNumbers.push(number); // Tambahkan nomor ke extractedNumbers
                }
                return [row.trim()]; // Selalu kembalikan array dengan satu elemen
            });

            // Memanggil fungsi untuk menampilkan tabel dengan data yang diformat
            displayTable(formattedRows);
        };
        reader.readAsText(file);
    } else {
        alert("Please upload a valid .ini file.");
    }
}


// Fungsi untuk menampilkan tabel dengan data yang diimpor
function displayTable(data) {
    const tableContainer = document.getElementById("tableContainer");
    let tableHTML = "<table>";
    data.forEach((row, index) => {
        tableHTML += "<tr>";
        row.forEach(cell => {
            tableHTML += `<td contenteditable="false">${cell.trim()}</td>`;
        });
        tableHTML += "</tr>";
    });
    tableHTML += "</table>";
    tableContainer.innerHTML = tableHTML;
}


// Fungsi untuk membuka window Availability dan menampilkan data berdasarkan extractedNumbers
function checkAvailability() {
    if (extractedNumbers.length === 0) {
        alert("No data available. Please import a valid .ini file first.");
        return;
    }

    // Membuat window baru
    const availabilityWindow = window.open("", "AvailabilityWindow", "width=400,height=600");
    availabilityWindow.document.write(`
        <html>
            <head>
                <title>Availability Checker</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 10px;
                    }
                    .search-box, .filter-box {
                        margin-bottom: 10px;
                    }
                    .search-box input, .filter-box select {
                        padding: 5px;
                        font-size: 14px;
                    }
                    .number-list {
                        max-height: 450px;
                        overflow-y: auto;
                    }
                    .number-item {
                        padding: 5px;
                        border-bottom: 1px solid #ddd;
                        font-weight: bold;
                    }
                    .available {
                        color: green;
                        background-color: white;
                    }
                    .not-available {
                        color: black;
                        background-color: pink;
                    }
                </style>
            </head>
            <body>
                <div class="search-box">
                    <label for="searchInput">Search Number: </label>
                    <input type="number" id="searchInput" placeholder="Enter number..." oninput="window.searchNumber()">
                </div>
                <div class="filter-box">
                    <label for="filterSelect">Filter: </label>
                    <select id="filterSelect" onchange="window.applyFilter()">
                        <option value="all">All</option>
                        <option value="available">Avail</option>
                        <option value="not-available">N/A</option>
                    </select>
                </div>
                <div class="number-list" id="numberList"></div>
                <script>
                    // Data hasil ekstraksi dari parent window
                    const extractedNumbers = ${JSON.stringify(extractedNumbers)};

                    function displayNumbers(filter = "all") {
                        const numberList = document.getElementById('numberList');
                        numberList.innerHTML = "";
                        for (let i = 1; i <= 3073; i++) {
                            const isAvailable = !extractedNumbers.includes(i); // Avail jika tidak ada di extractedNumbers
                            if ((filter === "available" && isAvailable) || (filter === "not-available" && !isAvailable) || filter === "all") {
                                const item = document.createElement('div');
                                item.className = 'number-item ' + (isAvailable ? 'available' : 'not-available');
                                item.textContent = i;
                                item.setAttribute("data-number", i); // Set data attribute for search
                                numberList.appendChild(item);
                            }
                        }
                    }
                    
                    function searchNumber() {
                        const searchInput = document.getElementById('searchInput').value;
                        const numberList = document.getElementById('numberList');
                        const targetItem = numberList.querySelector('[data-number="' + searchInput + '"]');
                        if (targetItem) {
                            targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            targetItem.style.backgroundColor = 'yellow';
                        }
                    }
                    
                    function applyFilter() {
                        const filter = document.getElementById('filterSelect').value;
                        displayNumbers(filter);
                    }
                    
                    displayNumbers();
                    
                    window.searchNumber = searchNumber;
                    window.applyFilter = applyFilter;
                </script>
            </body>
        </html>
    `);
}



// Fungsi untuk toggle mode edit menggunakan switch
function toggleEditMode() {
    const isEditable = document.getElementById("editSwitch").checked;
    const cells = document.querySelectorAll("#tableContainer td");

    cells.forEach(cell => {
        cell.contentEditable = isEditable;
    });
}

function saveData() {
    const rows = [];
    const tableRows = document.querySelectorAll("#tableContainer tr");

    tableRows.forEach((row) => {
        const rowData = [];
        const cells = row.querySelectorAll("th, td"); // Ambil <th> atau <td>
        
        cells.forEach(cell => {
            rowData.push(cell.innerText.trim()); // Trim untuk membersihkan spasi tambahan
        });
        
        rows.push(rowData.join("\t"));
    });

    const fileContent = rows.join("\n");
    const blob = new Blob([fileContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Particle.ini"; // Nama file yang diinginkan
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
    for (let i = 0; i < rows.length; i++) { 
        const cell = rows[i].getElementsByTagName("td")[0]; // Hanya ada satu kolom
        if (cell && cell.innerText.toLowerCase().includes(searchTerm)) {
            rows[i].scrollIntoView({ behavior: "smooth", block: "center" });
            rows[i].style.backgroundColor = "#ffff99";
            found = true;
            break;
        } else {
            rows[i].style.backgroundColor = "";
        }
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
function checkParticleNumber() {
    const particleNumberInput = document.getElementById("particleNumber");
    const particleNumberLabel = document.getElementById("particleNumberLabel");
    const particleNumber = parseInt(particleNumberInput.value, 10);
    
    // Periksa apakah nomor yang dimasukkan ada di extractedNumbers
    if (extractedNumbers.includes(particleNumber)) {
        // Jika nomor sudah ada
        particleNumberInput.classList.add("not-available");
        particleNumberInput.classList.remove("available");
        
        particleNumberLabel.textContent = "Nomor sudah ada";
        particleNumberLabel.classList.add("not-available");
        particleNumberLabel.classList.remove("available");
    } else if (!isNaN(particleNumber)) {
        // Jika nomor tersedia
        particleNumberInput.classList.add("available");
        particleNumberInput.classList.remove("not-available");
        
        particleNumberLabel.textContent = "Nomor tersedia";
        particleNumberLabel.classList.add("available");
        particleNumberLabel.classList.remove("not-available");
    } else {
        // Reset jika input kosong atau bukan angka
        particleNumberInput.classList.remove("available", "not-available");
        particleNumberLabel.classList.remove("available", "not-available");
        particleNumberLabel.style.display = "none";
    }
    
    // Tampilkan label jika ada teks di input
    if (particleNumberInput.value.trim() !== "") {
        particleNumberLabel.style.display = "inline";
    } else {
        particleNumberLabel.style.display = "none";
    }
}

function toggleMasterFolder() {
    const qgCheckbox = document.getElementById("qgCheckbox");
    const masterFolderInput = document.getElementById("masterFolder");
    
    if (qgCheckbox.checked) {
        masterFolderInput.value = ""; // Kosongkan input
        masterFolderInput.disabled = true;
    } else {
        masterFolderInput.disabled = false;
    }
}
function handleKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Mencegah aksi default (misalnya submit form)
        submitParticle();
    }
}

function submitParticle() {
    const particleNumberInput = document.getElementById("particleNumber");
    const skinNameInput = document.getElementById("skinName");
    const qgCheckbox = document.getElementById("qgCheckbox");
    const masterFolderInput = document.getElementById("masterFolder");
    const particleTypeSelect = document.getElementById("particleType");
    const folderNameInput = document.getElementById("folderName");
    const sptNameInput = document.getElementById("sptName");
    
    let particleNumber = parseInt(particleNumberInput.value, 10);
    const skinName = skinNameInput.value.trim();
    const isQGChecked = qgCheckbox.checked;
    const masterFolder = masterFolderInput.value.trim();
    const particleType = particleTypeSelect.value.trim();
    const folderName = folderNameInput.value.trim();
    const sptName = sptNameInput.value.trim();
    
    // Validasi input
    if (isNaN(particleNumber) || skinName === "" || folderName === "" || sptName === "") {
        alert("Please fill in all required fields.");
        return;
    }
    
    // Cek apakah particleNumber sudah ada
    if (extractedNumbers.includes(particleNumber)) {
        alert(`Particle Number ${particleNumber} already exists.`);
        return;
    }
    
    // Logika "Main Folder Combine"
    let mainFolderCombine = "";
    if (isQGChecked) {
        mainFolderCombine = "QG\\SPT\\QGN";
    } else {
        if (masterFolder === "") {
            alert("Please enter the Master Folder.");
            return;
        }
        mainFolderCombine = masterFolder;
    }
    
    // Membuat empat baris data
    const line1 = `[PARTICLE${particleNumber}]`;
    const line2 = `INDEX=${particleNumber}                   ;${skinName}`;
    const line3 = `ABSAXIS=0`;
    const line4 = `PARTICLE=.\\Chef\\${mainFolderCombine}\\${particleType}${folderName}\\${sptName}.spt`;
    
    // Menambahkan data ke tabel
    addDataToTable([line1, line2, line3, line4]);
    
    // Menambahkan particleNumber ke extractedNumbers
    extractedNumbers.push(particleNumber);
    
    // Mengincrement Particle Number
    particleNumberInput.value = particleNumber + 1;
    
    // Men-scroll tabel ke bawah
    scrollToBottom();
}
function addDataToTable(lines) {
    let table = document.querySelector("#tableContainer table");
    const tableContainer = document.getElementById("tableContainer");

    if (!table) {
        // Jika tabel belum ada, buat tabel baru
        table = document.createElement("table");
        tableContainer.appendChild(table);
    }
    
    lines.forEach(line => {
        const newRow = document.createElement("tr");
        const newCell = document.createElement("td");
        newCell.contentEditable = "false";
        newCell.textContent = line;
        newRow.appendChild(newCell);
        table.appendChild(newRow);
    });
}
// Fungsi untuk membuka modal
function EditNum() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'block';
}

// Fungsi untuk menutup modal
function closeModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
}

// Fungsi untuk memproses input dan menampilkan output
function editNumberModal() {
    const largeInput = document.getElementById('largeInputModal').value;
    const smallInput = document.getElementById('smallInputModal').value;
    const output = processNumbers(largeInput, smallInput);
    document.getElementById('outputBoxModal').value = output;
}

// Fungsi untuk memasukkan data ke tabel utama dan menutup modal
function insertDataFromEditorModal() {
    const outputData = document.getElementById('outputBoxModal').value;
    insertDataFromEditor(outputData);
    closeModal();
}

// Fungsi pemrosesan data
function processNumbers(largeInput, smallInput) {
    const startingNumber = parseInt(smallInput, 10);
    const newLinePath = document.getElementById('newLineModal').value.trim();
    const changeLog = [];

    if (isNaN(startingNumber)) {
        alert("Please enter a valid number in the 'Nomor awal' field.");
        return '';
    }

    if (!newLinePath) {
        alert("Please provide a new line path in the 'New Line' field.");
        return '';
    }

    // Split input into lines
    const lines = largeInput.split('\n');
    let currentNumber = startingNumber;
    let outputLines = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Replace [PARTICLE****]
        if (line.match(/^\[PARTICLE\d+\]/)) {
            const oldNumber = line.match(/\d+/)[0];
            line = line.replace(/\[PARTICLE\d+\]/, `[PARTICLE${currentNumber}]`);
            changeLog.push(`Change ${oldNumber} to ${currentNumber}`);
        }

        // Replace INDEX =****
        else if (line.match(/^INDEX\s*=\s*\d+/)) {
            const oldIndex = line.match(/\d+/)[0];
            line = line.replace(/INDEX\s*=\s*\d+/, `INDEX =${currentNumber}`);
            changeLog.push(`Change ${oldIndex} to ${currentNumber}`);
            currentNumber++; // Increment after processing INDEX line
        }

        // Replace PARTICLE path
        else if (line.startsWith("PARTICLE=")) {
            line = `PARTICLE=${newLinePath}\\${line.split('\\').pop()}`; // Replace path but keep file name
        }

        outputLines.push(line);
    }

    // Update log box with changes
    document.getElementById('logBoxModal').value = changeLog.join('\n');

    return outputLines.join('\n');
}



// Fungsi untuk memasukkan data ke tabel utama
function insertDataFromEditor(outputData) {
    console.log('insertDataFromEditor called with outputData:', outputData);
    const tableContainer = document.getElementById("tableContainer");
    let table = document.querySelector("#tableContainer table");

    if (!table) {
        // Jika tabel belum ada, buat tabel baru
        table = document.createElement("table");
        tableContainer.appendChild(table);
        console.log('Table created');
    }

    // Jika ada sel yang aktif, gunakan `lastActiveCell` (opsional)
    if (lastActiveCell && (lastActiveCell.tagName === 'TD' || lastActiveCell.tagName === 'TH')) {
        // Implementasi jika ingin menambahkan data mulai dari sel yang aktif
        const lines = outputData.split('\n');
        let currentRow = lastActiveCell.parentElement;
        let rowIndex = Array.prototype.indexOf.call(table.rows, currentRow);

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // If the current row exists, insert into the cell
            if (rowIndex + i < table.rows.length) {
                const row = table.rows[rowIndex + i];
                const cell = row.cells[0]; // Assuming single-column table
                cell.textContent = line;
            } else {
                // Add new row
                const newRow = document.createElement('tr');
                const newCell = document.createElement('td');
                newCell.textContent = line;
                newCell.contentEditable = "false";
                newRow.appendChild(newCell);
                table.appendChild(newRow);
            }
        }
    } else {
        // Jika tidak ada sel aktif, tambahkan data di akhir tabel
        const lines = outputData.split('\n');
        lines.forEach(line => {
            const newRow = document.createElement('tr');
            const newCell = document.createElement('td');
            newCell.textContent = line;
            newCell.contentEditable = "false";
            newRow.appendChild(newCell);
            table.appendChild(newRow);
        });
    }
}

// Event listener untuk klik pada sel tabel (opsional)
let lastActiveCell = null;

document.addEventListener('click', function(event) {
    if (event.target.tagName === 'TD' || event.target.tagName === 'TH') {
        lastActiveCell = event.target;
        console.log('lastActiveCell updated:', lastActiveCell);
    }
});
