// Fungsi untuk menampilkan satu section dan menyembunyikan yang lain
function showSection(sectionId) {
    const sections = ['cardsContainer', 'portfolioPlaceholder', 'applicationPlaceholder', 'databasePlaceholder'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = (id === sectionId) ? 'block' : 'none';
            
            // Set display as grid untuk cardsContainer
            if (id === 'cardsContainer' && sectionId === 'cardsContainer') {
                element.style.display = 'grid';
                element.style.gridTemplateColumns = 'repeat(3, 1fr)';
                element.style.gap = '20px';  // Sesuaikan gap sesuai CSS Anda
            }
        }
    });
}

// Event listener untuk masing-masing link di sidebar
document.getElementById('portofolioLink').addEventListener('click', (event) => {
    event.preventDefault();
    showSection('portfolioPlaceholder');
});

document.getElementById('applicationLink').addEventListener('click', (event) => {
    event.preventDefault();
    showSection('applicationPlaceholder');
});

document.getElementById('databaseLink').addEventListener('click', (event) => {
    event.preventDefault();
    showSection('databasePlaceholder');
});

document.getElementById('homeLink').addEventListener('click', () => {
    showSection('cardsContainer'); // Tampilkan Dashboard
});

// Event listener untuk membuka Effect/index.html saat Effectfilelist diklik
document.getElementById('effectFileCard').addEventListener('click', () => {
    window.open('Effect/EffectFileList.html', '_blank'); // Membuka di tab baru
});
document.getElementById('ItemEffectlistCard').addEventListener('click', () => {
    window.open('Item/ItemEffectList.html', '_blank'); // Membuka di tab baru
});
document.getElementById('partcileiniCard').addEventListener('click', () => {
    window.open('Particle/particle.html', '_blank'); // Membuka di tab baru
});

// Fungsi untuk slider
let slideIndex = 0;
const totalSlides = document.getElementsByClassName("slide").length;

function moveSlide(n) {
    slideIndex = (slideIndex + n + totalSlides) % totalSlides;
    showSlides();
}

function showSlides() {
    const sliderWrapper = document.querySelector(".slider-wrapper");
    sliderWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
}

setInterval(() => {
    moveSlide(1);
}, 5000);

showSlides(); // Inisialisasi tampilan slide pertama

// Toggle dropdown notifikasi
document.getElementById("notificationBell").addEventListener("click", () => {
    const dropdown = document.getElementById("notificationDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

// Tutup dropdown jika klik di luar area dropdown
window.addEventListener("click", (event) => {
    const dropdown = document.getElementById("notificationDropdown");
    const bellIcon = document.getElementById("notificationBell");

    if (!dropdown.contains(event.target) && event.target !== bellIcon) {
        dropdown.style.display = "none";
    }
});

// CountAPI untuk visitor count
const namespace = "your-unique-namespace"; // Ganti dengan namespace Anda
const key = "quartz-gallery-visitor"; 

function updateVisitorCount() {
    const url = `https://api.countapi.xyz/hit/${namespace}/${key}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("visitorCount").textContent = data.value;
        })
        .catch(error => {
            console.error("Error fetching visitor count:", error);
            document.getElementById("visitorCount").textContent = "Error";
        });
}

updateVisitorCount(); // Perbarui visitor count saat halaman dimuat

// Fungsi untuk tombol download
document.getElementById("downloadButton").addEventListener("click", function() {
    // Dapatkan nama file dari dropdown
    const selectedFile = document.getElementById("fileSelect").value;

    // Buat link download dengan path ke folder databaseFiles
    const link = document.createElement("a");
    link.href = `databaseFiles/${selectedFile}`; // Path ke folder databaseFiles
    link.download = selectedFile; // Nama file yang diunduh

    // Tambahkan link ke DOM, klik secara otomatis, lalu hapus
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
document.addEventListener('DOMContentLoaded', function() {
    const profileButton = document.getElementById('profileButton');
    const profileDropdown = document.getElementById('profileDropdown');

    // Tampilkan atau sembunyikan dropdown saat tombol profil diklik
    profileButton.addEventListener('click', function(event) {
        event.stopPropagation();
        profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Sembunyikan dropdown saat klik di luar dropdown
    document.addEventListener('click', function(event) {
        if (!profileDropdown.contains(event.target) && event.target !== profileButton) {
            profileDropdown.style.display = 'none';
        }
    });
});

