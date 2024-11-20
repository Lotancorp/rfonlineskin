// script.js

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

// Event listener untuk membuka halaman saat card diklik
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
document.getElementById("notificationBell").addEventListener("click", (event) => {
    event.stopPropagation();
    const dropdown = document.getElementById("notificationDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

// Tutup dropdown jika klik di luar area dropdown
document.addEventListener("click", (event) => {
    const dropdown = document.getElementById("notificationDropdown");
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    }
});

// Toggle dropdown profil
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

// Script untuk modal feedback dan validasi form
document.addEventListener("DOMContentLoaded", function () {
    const visitorCard = document.getElementById("visitorCard");
    const feedbackSection = document.getElementById("visitorFeedbackSection");
    const feedbackList = document.getElementById("feedbackList");
    const submitBtn = document.getElementById("submitBtn");
    const anonymousBtn = document.getElementById("anonymousBtn");
    const nameField = document.getElementById("name");
    const messageField = document.getElementById("message");
    const phoneField = document.getElementById("phone");
    const socialField = document.getElementById("social");
    const promotionConsent = document.getElementById("promotionConsent");
    const modal = document.getElementById("feedbackModal");
    const leaveFeedbackBtn = document.getElementById("leaveFeedbackBtn");

    // Fungsi untuk menampilkan modal
    function openModal() {
        modal.style.display = "flex"; // Pastikan menggunakan "flex" agar modal muncul sesuai CSS
    }

    // Fungsi untuk menutup modal
    function closeModal() {
        modal.style.display = "none";
        document.getElementById("visitorFeedbackForm").reset();
        validateForm(); // Update status tombol submit
    }

    // Event listener untuk membuka/menutup feedback section saat visitorCard diklik
    visitorCard.addEventListener("click", function () {
        if (feedbackSection.style.display === "none" || feedbackSection.style.display === "") {
            feedbackSection.style.display = "block";
            // Muat data dari Firebase
            loadFeedbackFromFirebase((feedbackListData) => {
                feedbackList.innerHTML = ""; // Bersihkan daftar lama
                feedbackListData.forEach((feedback) => {
                    addFeedbackToList(feedback.name, feedback.comment);
                });
            });
        } else {
            feedbackSection.style.display = "none";
        }
    });

    // Event listener untuk tombol "Leave Feedback" dalam feedback section
    leaveFeedbackBtn.addEventListener("click", function () {
        openModal();
    });

    // Event listener untuk tombol "Login as Anonymous"
    anonymousBtn.addEventListener('click', function (event) {
        event.preventDefault();
        loginAsAnonymous(); // Memanggil fungsi loginAsAnonymous
    });

    // Fungsi untuk menambahkan feedback ke daftar
    function addFeedbackToList(name, comment) {
        const feedbackContainer = document.getElementById("feedbackList");
    
        // Membuat elemen card untuk feedback
        const feedbackCard = document.createElement("div");
        feedbackCard.className = "feedback-card";
    
        // Nama pengunjung
        const feedbackName = document.createElement("h4");
        feedbackName.textContent = name;
        feedbackName.className = "feedback-name";
    
        // Komentar pengunjung
        const feedbackComment = document.createElement("p");
        feedbackComment.textContent = comment;
        feedbackComment.className = "feedback-comment";
    
        // Menambahkan elemen ke dalam card
        feedbackCard.appendChild(feedbackName);
        feedbackCard.appendChild(feedbackComment);
    
        // Menambahkan card ke dalam container
        feedbackContainer.appendChild(feedbackCard);
    }
    
    // Fungsi validasi form
    function validateForm() {
        const name = nameField.value.trim();
        const comment = messageField.value.trim();
        const isChecked = promotionConsent.checked;
      
        console.log("Name:", name);
        console.log("Comment:", comment);
        console.log("Checkbox Checked:", isChecked);
      
        if (name && comment && isChecked) {
          submitBtn.disabled = false;
        } else {
          submitBtn.disabled = true;
        }
    }

    // Panggil validateForm setiap kali ada perubahan pada input
    nameField.addEventListener("input", validateForm);
    messageField.addEventListener("input", validateForm);
    promotionConsent.addEventListener("change", validateForm);

    // Panggil validateForm saat halaman dimuat
    validateForm();

    // Event listener untuk tombol Submit
    submitBtn.addEventListener("click", function (event) {
        event.preventDefault();
    
        const name = nameField.value.trim();
        const phone = phoneField.value.trim();
        const social = socialField.value.trim();
        const comment = messageField.value.trim();
    
        // Simpan feedback ke Firebase
        saveFeedbackToFirebase(name, phone, social, comment);
    
        // Tambahkan nama dan komentar ke daftar lokal
        addFeedbackToList(name, comment);
    
        // Bersihkan form dan tutup modal
        closeModal();
        alert("Feedback berhasil dikirim. Terima kasih!");
    });

    // Event listener untuk menutup modal saat mengklik di luar area modal
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
});

// Fungsi untuk menyimpan feedback ke Firebase
function saveFeedbackToFirebase(name, phone, social, comment) {
    const feedbackRef = database.ref("feedback");
    feedbackRef.push({
        name,
        phone,
        social,
        comment
    })
    .then(() => console.log("Feedback berhasil disimpan"))
    .catch((error) => console.error("Error menyimpan feedback:", error));
}

// Fungsi untuk memuat feedback dari Firebase
function loadFeedbackFromFirebase(callback) {
    const feedbackRef = database.ref("feedback");
    feedbackRef.on("value", (snapshot) => {
        const feedback = snapshot.val();
        const feedbackList = [];
        for (const id in feedback) {
            feedbackList.push(feedback[id]);
        }
        callback(feedbackList);
    });
}

// Fungsi Login Anonim dan Simpan IP
async function loginAsAnonymous() {
    try {
        const userCredential = await auth.signInAnonymously();
        const user = userCredential.user;

        console.log("Login sukses, UID:", user.uid);

        // Mendapatkan IP pengguna
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;

        console.log("IP Pengguna:", userIP);

        // Simpan IP ke Firebase Realtime Database
        const anonymousUserRef = database.ref(`anonymousUsers/${user.uid}`);
        anonymousUserRef.push({
            uid: user.uid,
            ip: userIP,
            timestamp: new Date().toISOString()
        });

        // Menutup modal
        closeModal();

        alert("Login sukses sebagai Anonymous!");
    } catch (error) {
        console.error("Login gagal:", error);
        alert("Login gagal: " + error.message);
    }
}

// Pastikan fungsi closeModal dapat diakses oleh loginAsAnonymous
function closeModal() {
    const modal = document.getElementById("feedbackModal");
    modal.style.display = "none";
    document.getElementById("visitorFeedbackForm").reset();
    validateForm(); // Update status tombol submit
}
