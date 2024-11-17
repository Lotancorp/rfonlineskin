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
    link.download = window.uploadedFileName || "ItemEffectList.txt"; // Gunakan nama file yang diunggah atau nama default
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
function inputItemEffect() {
    // Memastikan bahwa file yang diimpor adalah "ItemEffectList.txt"
    const importedFile = document.getElementById('importFile').files[0];
    if (!importedFile || importedFile.name !== "ItemEffectList.txt") {
        alert("Please import 'ItemEffectList.txt' file to proceed.");
        return;
    }

    // Mendefinisikan nilai-nilai untuk Race
    const raceValues = {
        Accretia: 400,
        Bellato: 700,
        Cora: 800
    };

    // Mendefinisikan nilai-nilai untuk Type Skin
    const skinValues = {
        BOOSTER: 6,
        MASK: 0,
        GLOVES: 4,
        ARMOR: null // ARMOR akan memiliki logika khusus
    };

    // Mendapatkan elemen-elemen input
    const raceAccretia = document.getElementById("accretiaCheckbox").checked ? raceValues.Accretia : null;
    const raceBellato = document.getElementById("bellatoCheckbox").checked ? raceValues.Bellato : null;
    const raceCora = document.getElementById("coraCheckbox").checked ? raceValues.Cora : null;

    const skinType = document.getElementById("skinTypeDropdown").value;
    const jumlahSet = parseInt(document.getElementById("jumlahSet").value);

    const meshID1 = document.getElementById("meshID1").value.toUpperCase();
    const meshID2 = document.getElementById("meshID2").value.toUpperCase();
    const meshID3 = document.getElementById("meshID3").value.toUpperCase();

    const eff1 = document.getElementById("eff1").value;
    const eff2 = document.getElementById("eff2").value;
    const eff3 = document.getElementById("eff3").value;

    // Mengumpulkan semua race yang dipilih
    const selectedRaces = [];
    if (raceAccretia) selectedRaces.push(raceAccretia);
    if (raceBellato) selectedRaces.push(raceBellato);
    if (raceCora) selectedRaces.push(raceCora);

    // Menghasilkan data berdasarkan jumlah set
    const data = [];
    selectedRaces.forEach(raceValue => {
        if (skinType === "ARMOR") {
            // Logika khusus untuk ARMOR
            const allowedArmorCodes = [0, 2, 3, 4, 5]; // Tidak menyertakan kode 1
            for (let setNumber = 1; setNumber <= jumlahSet; setNumber++) {
                let meshID, effValue;

                // Menentukan MeshID dan EFF berdasarkan jumlah set
                if (setNumber === 1) {
                    meshID = meshID1;
                    effValue = eff1;
                } else if (setNumber === 2) {
                    meshID = meshID2;
                    effValue = eff2;
                } else if (setNumber === 3) {
                    meshID = meshID3;
                    effValue = eff3;
                }

                // Menambahkan lima baris per kombinasi Race dan MeshID untuk ARMOR tanpa kode 1
                allowedArmorCodes.forEach(armorCode => {
                    const combinedRaceSkinMesh = `${raceValue}${armorCode}${meshID}`;
                    
                    const formattedRow = [
                        combinedRaceSkinMesh, // Kolom 1: Race + ArmorCode + MeshID
                        "",                   // Kolom 2: Kolom kosong
                        effValue,             // Kolom 3: EFF
                        0, 0, 0, 0,           // Kolom 4-7: Semua 0
                        effValue              // Kolom 8: EFF
                    ];
                    data.push(formattedRow);
                });
            }
        } else {
            // Logika umum untuk BOOSTER, MASK, dan GLOVES
            for (let setNumber = 1; setNumber <= jumlahSet; setNumber++) {
                let meshID, effValue;

                // Menentukan MeshID dan EFF berdasarkan jumlah set
                if (setNumber === 1) {
                    meshID = meshID1;
                    effValue = eff1;
                } else if (setNumber === 2) {
                    meshID = meshID2;
                    effValue = eff2;
                } else if (setNumber === 3) {
                    meshID = meshID3;
                    effValue = eff3;
                }

                // Menggabungkan nilai Race, Type Skin, dan MeshID
                const combinedRaceSkinMesh = `${raceValue}${skinValues[skinType]}${meshID}`;
                
                const formattedRow = [
                    combinedRaceSkinMesh, // Kolom 1: Race + Skin + MeshID
                    "",                   // Kolom 2: Kolom kosong
                    effValue,             // Kolom 3: EFF
                    0, 0, 0, 0,           // Kolom 4-7: Semua 0
                    effValue              // Kolom 8: EFF
                ];
                data.push(formattedRow);
            }
        }
    });

    // Menambahkan data ke tabel di bawah
    const tableContainer = document.getElementById("tableContainer");
    if (tableContainer) {
        const table = tableContainer.querySelector("table");

        if (table) {
            data.forEach(rowData => {
                const newRow = table.insertRow(-1);
                
                rowData.forEach(cellData => {
                    const cell = newRow.insertCell();
                    cell.innerText = cellData;
                });
            });
        } else {
            alert("Table not found. Please ensure a table is displayed.");
        }
    }
}

