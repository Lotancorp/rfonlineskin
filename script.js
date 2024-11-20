// script.js

// Akses Firebase
var database = firebase.database();
var auth = firebase.auth();

// Fungsi untuk menampilkan satu section dan menyembunyikan yang lain
function showSection(sectionId) {
    var sections = ['cardsContainer', 'portfolioPlaceholder', 'applicationPlaceholder', 'databasePlaceholder'];
    sections.forEach(function(id) {
        var element = document.getElementById(id);
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
document.getElementById('portofolioLink').addEventListener('click', function(event) {
    event.preventDefault();
    showSection('portfolioPlaceholder');
});

document.getElementById('applicationLink').addEventListener('click', function(event) {
    event.preventDefault();
    showSection('applicationPlaceholder');
});

document.getElementById('databaseLink').addEventListener('click', function(event) {
    event.preventDefault();
    showSection('databasePlaceholder');
});

document.getElementById('homeLink').addEventListener('click', function() {
    showSection('cardsContainer'); // Tampilkan Dashboard
});

// Event listener untuk membuka halaman saat card diklik
document.getElementById('effectFileCard').addEventListener('click', function() {
    window.open('Effect/EffectFileList.html', '_blank'); // Membuka di tab baru
});
document.getElementById('ItemEffectlistCard').addEventListener('click', function() {
    window.open('Item/ItemEffectList.html', '_blank'); // Membuka di tab baru
});
document.getElementById('partcileiniCard').addEventListener('click', function() {
    window.open('Particle/particle.html', '_blank'); // Membuka di tab baru
});

// Fungsi untuk slider
var slideIndex = 0;
var totalSlides = document.getElementsByClassName("slide").length;

function moveSlide(n) {
    slideIndex = (slideIndex + n + totalSlides) % totalSlides;
    showSlides();
}

function showSlides() {
    var sliderWrapper = document.querySelector(".slider-wrapper");
    sliderWrapper.style.transform = 'translateX(-' + (slideIndex * 100) + '%)';
}

setInterval(function() {
    moveSlide(1);
}, 5000);

showSlides(); // Inisialisasi tampilan slide pertama

// Toggle dropdown notifikasi
document.getElementById("notificationBell").addEventListener("click", function(event) {
    event.stopPropagation();
    var dropdown = document.getElementById("notificationDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

// Tutup dropdown jika klik di luar area dropdown
document.addEventListener("click", function(event) {
    var dropdown = document.getElementById("notificationDropdown");
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    }
});

// Toggle dropdown profil
document.addEventListener('DOMContentLoaded', function() {
    var profileButton = document.getElementById('profileButton');
    var profileDropdown = document.getElementById('profileDropdown');

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
    var selectedFile = document.getElementById("fileSelect").value;

    // Buat link download dengan path ke folder databaseFiles
    var link = document.createElement("a");
    link.href = 'databaseFiles/' + selectedFile; // Path ke folder databaseFiles
    link.download = selectedFile; // Nama file yang diunduh

    // Tambahkan link ke DOM, klik secara otomatis, lalu hapus
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Script untuk modal feedback dan validasi form
document.addEventListener("DOMContentLoaded", function () {
    var visitorCard = document.getElementById("visitorCard");
    var feedbackSection = document.getElementById("visitorFeedbackSection");
    var feedbackList = document.getElementById("feedbackList");
    var submitBtn = document.getElementById("submitBtn");
    var anonymousBtn = document.getElementById("anonymousBtn");
    var nameField = document.getElementById("name");
    var messageField = document.getElementById("message");
    var phoneField = document.getElementById("phone");
    var socialField = document.getElementById("social");
    var promotionConsent = document.getElementById("promotionConsent");
    var modal = document.getElementById("feedbackModal");
    var leaveFeedbackBtn = document.getElementById("leaveFeedbackBtn");

    // Fungsi untuk menampilkan modal
    function openModal() {
        modal.style.display = "flex"; // Pastikan menggunakan "flex" agar modal muncul sesuai CSS
    }

    // Fungsi untuk menutup modal
    function closeModal() {
        console.log("closeModal dipanggil");
        modal.style.display = "none";
        document.getElementById("visitorFeedbackForm").reset();
        validateForm(); // Update status tombol submit
    }

    // Event listener untuk membuka/menutup feedback section saat visitorCard diklik
    visitorCard.addEventListener("click", function () {
        if (feedbackSection.style.display === "none" || feedbackSection.style.display === "") {
            feedbackSection.style.display = "block";
            // Muat data dari Firebase
            loadFeedbackFromFirebase(function(feedbackListData) {
                feedbackList.innerHTML = ""; // Bersihkan daftar lama
                feedbackListData.forEach(function(feedback) {
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
        console.log("Tombol 'Login as Anonymous' diklik");
        loginAsAnonymous();
    });

    // Fungsi untuk menambahkan feedback ke daftar
    function addFeedbackToList(name, comment) {
        var feedbackContainer = document.getElementById("feedbackList");
    
        // Membuat elemen card untuk feedback
        var feedbackCard = document.createElement("div");
        feedbackCard.className = "feedback-card";
    
        // Nama pengunjung
        var feedbackName = document.createElement("h4");
        feedbackName.textContent = name;
        feedbackName.className = "feedback-name";
    
        // Komentar pengunjung
        var feedbackComment = document.createElement("p");
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
        var name = nameField.value.trim();
        var comment = messageField.value.trim();
        var isChecked = promotionConsent.checked;
      
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
        console.log("Tombol Submit diklik");
    
        var name = nameField.value.trim();
        var phone = phoneField.value.trim();
        var social = socialField.value.trim();
        var comment = messageField.value.trim();
    
        // Simpan feedback ke Firebase
        saveFeedbackToFirebase(name, phone, social, comment)
            .then(function() {
                console.log("Feedback berhasil disimpan ke Firebase");
                // Tambahkan nama dan komentar ke daftar lokal
                addFeedbackToList(name, comment);
    
                // Bersihkan form dan tutup modal
                closeModal();
                alert("Feedback berhasil dikirim. Terima kasih!");
            })
            .catch(function(error) {
                console.error("Error menyimpan feedback:", error);
                alert("Terjadi kesalahan saat menyimpan feedback.");
            });
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
    var feedbackRef = database.ref("feedback");
    return feedbackRef.push({
        name: name,
        phone: phone,
        social: social,
        comment: comment
    });
}

// Fungsi untuk memuat feedback dari Firebase
function loadFeedbackFromFirebase(callback) {
    var feedbackRef = database.ref("feedback");
    feedbackRef.on("value", function(snapshot) {
        var feedback = snapshot.val();
        var feedbackList = [];
        for (var id in feedback) {
            feedbackList.push(feedback[id]);
        }
        callback(feedbackList);
    });
}

// Fungsi Login Anonim dan Simpan IP
function loginAsAnonymous() {
    auth.signInAnonymously()
        .then(function(userCredential) {
            var user = userCredential.user;

            console.log("Login sukses, UID:", user.uid);

            // Mendapatkan IP pengguna
            fetch('https://api.ipify.org?format=json')
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    var userIP = data.ip;

                    console.log("IP Pengguna:", userIP);

                    // Simpan IP ke Firebase Realtime Database
                    var anonymousUserRef = database.ref("anonymousUsers/" + user.uid);
                    anonymousUserRef.push({
                        uid: user.uid,
                        ip: userIP,
                        timestamp: new Date().toISOString()
                    });

                    // Menutup modal
                    closeModal();

                    alert("Login sukses sebagai Anonymous!");
                })
                .catch(function(error) {
                    console.error("Error mendapatkan IP:", error);
                    alert("Terjadi kesalahan saat mendapatkan IP.");
                });
        })
        .catch(function(error) {
            console.error("Login gagal:", error);
            alert("Login gagal: " + error.message);
        });
}
