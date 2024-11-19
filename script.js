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

    // Sembunyikan dropdown saat mengklik di luar dropdown
    document.addEventListener('click', function() {
        profileDropdown.style.display = 'none';
    });

    // Mencegah penutupan dropdown saat mengklik di dalam dropdown
    profileDropdown.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const visitorCard = document.getElementById("visitorCard");
    const feedbackSection = document.getElementById("visitorFeedbackSection");
    const feedbackList = document.getElementById("feedbackList");
    const submitBtn = document.getElementById("submitBtn");
    const nameField = document.getElementById("name");
    const messageField = document.getElementById("message");
    const modal = document.getElementById("feedbackModal");
  
    // Fungsi untuk menutup modal
    function closeModal() {
      modal.style.display = "none";
      nameField.value = "";
      messageField.value = "";
    }
  
    // Menyimpan feedback ke Firebase
    submitBtn.addEventListener("click", function (event) {
      event.preventDefault();
  
      const name = nameField.value.trim();
      const comment = messageField.value.trim();
  
      if (name === "" || comment === "") {
        alert("Harap isi semua kolom.");
        return;
      }
  
      // Simpan ke Firebase
      saveFeedbackToFirebase(name, comment);
  
      // Bersihkan form
      closeModal();
    });
  
    // Muat feedback dari Firebase dan tampilkan di kolom
    loadFeedbackFromFirebase((feedbackListData) => {
      feedbackList.innerHTML = ""; // Hapus data lama
      feedbackListData.forEach((feedback) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${feedback.name}: ${feedback.comment}`;
        feedbackList.appendChild(listItem);
      });
    });
  
    // Toggle Feedback Section
    visitorCard.addEventListener("click", function () {
      if (feedbackSection.style.display === "none" || feedbackSection.style.display === "") {
        feedbackSection.style.display = "block";
      } else {
        feedbackSection.style.display = "none";
      }
    });
  });
  



document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('feedbackModal');
    const anonymousBtn = document.getElementById('anonymousBtn');

    // Fungsi untuk menutup modal
    function closeModal() {
        modal.classList.remove('active'); // Menghapus class active
        modal.style.display = 'none'; // Menyembunyikan modal
    }

    // Event listener untuk tombol "Login as Anonymous"
    anonymousBtn.addEventListener('click', function (event) {
        event.preventDefault();
        console.log('User logged in as Anonymous.');
        closeModal(); // Menutup modal
    });
});


// Array untuk menyimpan semua data visitor
const visitorData = [];

