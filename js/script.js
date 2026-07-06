// =========================================================================
// PENTING: Ganti teks di bawah ini dengan URL Web App dari Google Apps Script
// =========================================================================
const URL_API_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbzX2v6kNoMlCDzM0ZQ19hR5gvKJu1FqKxWFANdvpeWCYAquwGZlHYWurJ0vGJ_p8q0E1Q/exec";

// Elemen Tampilan (Views)
const view1 = document.getElementById('view-1-welcome');
const view2 = document.getElementById('view-2-rsvp');
const view3 = document.getElementById('view-3-food');
const view4 = document.getElementById('view-4-thankyou');

// Elemen Form & Tombol
const form = document.getElementById('form-rsvp');
const btnLanjut1 = document.getElementById('btn-lanjut-1');
const btnHadir = document.getElementById('btn-hadir');
const btnTidakHadir = document.getElementById('btn-tidak-hadir');
const btnAction = document.getElementById('btn-action');
const kehadiranHidden = document.getElementById('kehadiran-hidden');
const namaInputEl = document.getElementById('nama');
const cloudTransition = document.getElementById('cloud-transition');
const tombolKirim = document.getElementById('tombol-kirim');
const pesanStatus = document.getElementById('pesan-status');
const btnBackTo1 = document.getElementById('btn-back-to-1');
const btnBackTo2 = document.getElementById('btn-back-to-2');
const bgMusic = document.getElementById('bg-music');
const musicContainer = document.getElementById('music-container');

document.addEventListener('DOMContentLoaded', () => {
    createPetals('petal-container');
    createPetals('petal-container-2');

    // Coba putar musik secara otomatis saat web dimuat
    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            musicContainer.classList.remove('paused');
        }).catch(e => {
            console.log("Autoplay ditahan oleh browser, musik akan diputar otomatis setelah tombol ditekan.");
        });
    }
});

// Fungsi untuk membuat efek kelopak bunga jatuh
function createPetals(containerId) {
    const petalContainer = document.getElementById(containerId);
    if (!petalContainer) return;

    const petalImages = [
        'assets/images/kelopak1.png',
        'assets/images/kelopak2.png',
        'assets/images/kelopak3.png'
    ];
    const swayAnimations = ['sway1', 'sway2', 'sway3'];

    // Buat 200 kelopak bunga untuk efek yang jauh lebih ramai
    const numPetals = 300;

    for (let i = 0; i < numPetals; i++) {
        let petal = document.createElement('img');

        // Pilih gambar kelopak acak
        petal.src = petalImages[Math.floor(Math.random() * petalImages.length)];
        petal.classList.add('petal');

        // Posisi awal horizontal acak (melebar agar tidak kumpul di tengah)
        petal.style.left = (Math.random() * 120 - 10) + 'vw';

        // Ukuran acak (menciptakan ilusi kedalaman)
        let size = Math.random() * 15 + 15; // 15px - 30px
        petal.style.width = size + 'px';

        // Kecepatan jatuh acak (5s - 12s)
        let fallDuration = Math.random() * 7 + 5;

        // Gaya putaran dan goyangan acak
        let swayAnim = swayAnimations[Math.floor(Math.random() * swayAnimations.length)];
        let swayDuration = Math.random() * 3 + 3; // 3s - 6s

        // Jeda muncul acak agar tidak jatuh bersamaan (0s - 10s)
        let delay = Math.random() * 10;

        // Terapkan animasi (menggabungkan jatuh lurus + goyangan)
        petal.style.animation = `falling ${fallDuration}s linear infinite ${delay}s, ${swayAnim} ${swayDuration}s ease-in-out infinite alternate ${delay}s`;

        petalContainer.appendChild(petal);
    }
}

// Mencegah form disubmit secara default (karena kita pakai Fetch API kustom)
form.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Fungsi bantuan untuk berpindah tampilan dengan efek awan
function showView(viewToShow) {
    // 1. Munculkan elemen awan (mulai di pinggir layar)
    cloudTransition.classList.remove('hidden');

    // Beri jeda sangat kecil agar browser me-render elemen sebelum animasi dimulai
    setTimeout(() => {
        // Memicu awan untuk bergerak ke tengah (menutup)
        cloudTransition.classList.add('closing');
    }, 50);

    // 2. Tunggu awan menutup rapat (1.2 detik), lalu ganti layarnya di belakang awan
    setTimeout(() => {
        // Sembunyikan semua layar
        view1.classList.add('hidden');
        view2.classList.add('hidden');
        view3.classList.add('hidden');
        view4.classList.add('hidden');

        // Tampilkan layar yang dituju
        viewToShow.classList.remove('hidden');

        // Atur kemunculan tombol musik (muncul selain di laman utama)
        if (viewToShow === view1) {
            musicContainer.classList.add('hidden');
        } else {
            musicContainer.classList.remove('hidden');
        }

        // 3. Buka kembali awannya
        cloudTransition.classList.remove('closing');

        // 4. Setelah awan terbuka penuh, sembunyikan kembali elemen awan agar tidak menghalangi klik
        setTimeout(() => {
            cloudTransition.classList.add('hidden');
        }, 1200); // 1.2 detik waktu membuka

    }, 1200); // 1.2 detik waktu menutup
}

// Navigasi: Tampilan 1 -> Tampilan 2
btnLanjut1.addEventListener('click', () => {
    // Mulai putar musik saat tombol NEXT ditekan (karena browser butuh interaksi agar bisa putar suara)
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log("Autoplay terblokir oleh browser."));
        musicContainer.classList.remove('paused');
    }

    showView(view2);
});

// Logika Tombol Musik (Play/Pause)
musicContainer.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicContainer.classList.remove('paused');
        musicContainer.classList.add('playing');
    } else {
        bgMusic.pause();
        musicContainer.classList.remove('playing');
        musicContainer.classList.add('paused'); // Menambahkan efek TERCORET
    }
});

// Logika Pemilihan Kehadiran (Tampilan 2)
function handleKehadiranClick(isHadir) {
    const namaValue = namaInputEl.value.trim();
    if (!namaValue) {
        alert("Please enter your name before selecting your attendance.");
        return;
    }

    if (isHadir) {
        btnHadir.classList.add('active');
        btnTidakHadir.classList.remove('active');
        kehadiranHidden.value = "Hadir";
        btnAction.innerText = "Pick your dinner plate!";
    } else {
        btnTidakHadir.classList.add('active');
        btnHadir.classList.remove('active');
        kehadiranHidden.value = "Tidak Hadir";
        btnAction.innerText = "NEXT";
    }

    // Munculkan tombol aksi di bawahnya dengan animasi fade
    btnAction.classList.add('show');
}

btnHadir.addEventListener('click', () => handleKehadiranClick(true));
btnTidakHadir.addEventListener('click', () => handleKehadiranClick(false));

// Navigasi: Tampilan 2 -> Tampilan 3 (Atau 4 jika tidak hadir)
btnAction.addEventListener('click', () => {
    if (kehadiranHidden.value === "Hadir") {
        showView(view3);
    } else {
        kirimDataRSVP();
        showView(view4);
    }
});

// Event Kirim: Tampilan 3 -> Tampilan 4 (Kirim Data Makanan)
tombolKirim.addEventListener('click', () => {
    // Cek apakah makanan sudah dipilih
    const makananPilihan = document.querySelector('input[name="makanan"]:checked');
    if (!makananPilihan) {
        alert("Please select one of the food menus provided.");
        return;
    }

    // Ubah teks tombol loading
    tombolKirim.disabled = true;
    tombolKirim.innerText = "Loading...";

    kirimDataRSVP();
    showView(view4);
});

// Logika Tombol Kembali (Back Buttons)
if (btnBackTo1) {
    btnBackTo1.addEventListener('click', () => {
        showView(view1); // Kembali ke laman utama
    });
}

if (btnBackTo2) {
    btnBackTo2.addEventListener('click', () => {
        showView(view2); // Kembali ke laman registrasi/RSVP
    });
}

// Fungsi untuk mengirim data ke Google Sheets via Fetch API
function kirimDataRSVP() {
    pesanStatus.innerText = "YOUR DATA IS BEING PROCESSED...";
    pesanStatus.style.color = "#333";

    const formData = new FormData(form);

    fetch(URL_API_APPS_SCRIPT, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                pesanStatus.style.color = "green";
                pesanStatus.innerText = "THANK YOU! YOUR RSVP IS SUCCESSFUL.";
                form.reset(); // Mengosongkan form
            } else {
                pesanStatus.style.color = "red";
                pesanStatus.innerText = "FAILED TO SEND YOUR DATA" + data.message;
            }
        })
        .catch(error => {
            pesanStatus.style.color = "red";
            pesanStatus.innerText = "Connection error. Please check your internet connection.";
            console.error('Error Detail:', error);
        })
        .finally(() => {
            tombolKirim.disabled = false;
            tombolKirim.innerText = "CONFIRM!";
        });
}