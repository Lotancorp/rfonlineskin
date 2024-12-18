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
    // Buat link download dengan path ke folder databaseFiles di GitHub Pages
    const link = document.createElement("a");
    link.href = `https://lotancorp.github.io/rfonlineskin/databaseFiles/${selectedFile}`; // URL lengkap
    link.download = selectedFile; // Nama file yang diunduh

    // Tambahkan link ke DOM, klik secara otomatis, lalu hapus
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
// Fungsi untuk tombol download Resource
document.getElementById("resourceDownloadButton").addEventListener("click", function () {
    // Dapatkan nama file dari dropdown Resource
    const selectedFile = document.getElementById("resourceFileSelect").value;

    // Buat link download dengan path ke folder databaseFiles
    const link = document.createElement("a");
    link.href = `https://github.com/Lotancorp/rfonlineskin/raw/refs/heads/main/databaseFiles/${selectedFile}`; // URL lengkap
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
        nameField.value = "";
        phoneField.value = "";
        socialField.value = "";
        messageField.value = "";
        promotionConsent.checked = false;
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
        console.log('User logged in as Anonymous.');
        closeModal(); // Menutup modal
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
    

    // Fungsi untuk memvalidasi form
    function validateForm() {
        const name = nameField.value.trim();
        const comment = messageField.value.trim();
        const isChecked = promotionConsent.checked;

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

    // Inisialisasi validasi form saat halaman dimuat
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

        // Tambahkan nama dan komentar saja ke daftar lokal
        addFeedbackToList(name, comment);

        // Bersihkan form dan tutup modal
        closeModal();
    });

    // Event listener untuk menutup modal saat mengklik di luar area modal
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
});

const posts = [
    { img: 'images/GodOfSparta.jpg', title: 'God Of Sparta', date: '14 Aug 2022', link: 'https://lotancorp.github.io/rfonlineskin/Post/GodOfSparta.html' },
    { img: 'images/FutureSkin.jpg', title: 'Future Army Skin', date: '14 Sep 2022', link: 'https://lotancorp.github.io/rfonlineskin/Post/FutureArmySkin.html' },
    { img: 'image3.jpg', title: 'Shadow Armor Skin', date: '15 Oct 2023' },
    { img: 'image4.jpg', title: 'Judul Post 4', date: '30 Sep 2024' },
    { img: 'image5.jpg', title: 'Judul Post 5', date: '1 Oct 2024' },
    { img: 'image6.jpg', title: 'Judul Post 6', date: '2 Oct 2024' },
    { img: 'image7.jpg', title: 'Judul Post 7', date: '3 Oct 2024' },
];

document.getElementById('cardpost').addEventListener('click', () => {
    const postContainer = document.getElementById('postDetailsContainer');
    if (postContainer.style.display === 'none') {
        postContainer.style.display = 'block'; // Tampilkan kontainer

        // Clear container sebelum memuat ulang (jika sudah ada)
        postContainer.innerHTML = '';

        // Tambahkan daftar post secara dinamis
        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'horizontal-post-card';
            postCard.innerHTML = `
                <img src="${post.img}" alt="${post.title}">
                <div class="post-card-content">
                    <h3>${post.title}</h3>
                    <p>Tanggal dibuat: ${post.date}</p>
                </div>
            `;

            // Menambahkan event listener ke setiap card
            postCard.addEventListener('click', () => {
                if (post.link) {
                    window.open(post.link,'_blank'); // Membuka halaman di tab baru
                }
            });

            // Masukkan card ke dalam kontainer
            postContainer.appendChild(postCard);
        });
    } else {
        postContainer.style.display = 'none'; // Sembunyikan kontainer
    }
});

function searchPosts() {
    const query = document.getElementById('searchInput').value.toLowerCase(); // Ambil nilai input dan ubah menjadi huruf kecil
    const resultsContainer = document.getElementById('searchResults'); // Elemen untuk menampilkan hasil

    // Hapus hasil pencarian sebelumnya
    resultsContainer.innerHTML = '';

    // Jika kotak pencarian kosong, jangan tampilkan apa pun
    if (query.trim() === '') {
        return;
    }

    // Filter data berdasarkan judul yang mengandung query
    const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(query));

    // Jika tidak ada hasil, tampilkan pesan
    if (filteredPosts.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    // Tampilkan hasil pencarian
    filteredPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post'); // Tambahkan kelas untuk styling
        postElement.innerHTML = `
            <img src="${post.img}" alt="${post.title}" style="width: 50px; height: 50px;">
            <div>
                <h3>${post.title}</h3>
                <p>${post.date}</p>
                ${post.link ? `<a href="${post.link}" target="_blank">Read More</a>` : ''}
            </div>
        `;
        resultsContainer.appendChild(postElement);
    });
}


// Event listener untuk memanggil fungsi pencarian saat pengguna mengetik
document.getElementById('searchInput').addEventListener('input', searchPosts);