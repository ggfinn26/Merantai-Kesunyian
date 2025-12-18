const supabaseUrl = 'https://fnltpxqupmjesprihfvr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZubHRweHF1cG1qZXNwcmloZnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Njk0MDMsImV4cCI6MjA4MTU0NTQwM30.e8sIIvNXS6ndMd6b8GUPsv7g98WGcJKS2rbpMgRYgT0'
// Pastikan variabel global supabase tersedia (dari CDN)
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

let currentStep = 1;
const totalSteps = 24;

// --- FUNGSI UNTUK KATEGORI LAINNYA ---
function toggleLainnyaContainer() {
    const checkbox = document.getElementById('checkbox-lainnya');
    const container = document.getElementById('lainnya-container');
    const inputs = container.querySelectorAll('input[name="kategori-lainnya[]"]');

    if (checkbox.checked) {
        container.classList.remove('hidden');
        // Set required pada input pertama
        if (inputs.length > 0) {
            inputs[0].required = true;
        }
    } else {
        container.classList.add('hidden');
        // Hapus required dari semua input lainnya
        inputs.forEach(input => {
            input.required = false;
        });
    }
}

function addLainnyaInput() {
    const container = document.getElementById('lainnya-inputs');
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.name = 'kategori-lainnya[]';
    newInput.className = 'form-input dark:text-white dark:border-white';
    newInput.placeholder = 'Sebutkan kategori lainnya...';
    container.appendChild(newInput);
}

// --- ENTER KEY NAVIGATION ---
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('daftarForm');
    if (!form) return;

    form.addEventListener('keydown', (e) => {
        // Hanya untuk input text, email, tel, number (bukan textarea)
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            e.preventDefault();

            // Cari step saat ini
            const currentStepElement = e.target.closest('[id^="step-"]');
            if (!currentStepElement) return;

            const stepId = currentStepElement.id;
            const stepNumber = parseInt(stepId.replace('step-', ''));

            // Cari semua tombol dan ambil yang terakhir (Lanjutkan/Submit)
            const buttons = currentStepElement.querySelectorAll('button[onclick*="nextStep"], button[onclick*="submitForm"]');
            if (buttons.length > 0) {
                buttons[buttons.length - 1].click();
            }
        }
    });
});

// --- VALIDASI INPUT ---
function validateCurrentStep(stepNumber) {
    const stepElement = document.getElementById('step-' + stepNumber);
    if (!stepElement) return true;

    // Cari semua input yang required di step ini
    const requiredInputs = stepElement.querySelectorAll('input[required], textarea[required], select[required]');

    for (const input of requiredInputs) {
        if (input.type === 'radio') {
            // Untuk radio, cek apakah ada yang dipilih dalam grup
            const radioGroup = stepElement.querySelectorAll(`input[name="${input.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                showError(stepElement, 'Mohon pilih salah satu opsi');
                return false;
            }
        } else if (input.type === 'checkbox') {
            // Untuk checkbox group, cek apakah minimal satu dipilih
            const checkboxGroup = stepElement.querySelectorAll(`input[name="${input.name}"]`);
            const isChecked = Array.from(checkboxGroup).some(cb => cb.checked);
            if (!isChecked) {
                showError(stepElement, 'Mohon pilih minimal satu opsi');
                return false;
            }
        } else {
            // Untuk text, email, tel, dll
            if (!input.value.trim()) {
                showError(stepElement, 'Mohon isi field ini');
                input.focus();
                return false;
            }
        }
    }

    clearError(stepElement);
    return true;
}

function showError(stepElement, message) {
    // Hapus error sebelumnya
    clearError(stepElement);

    // Buat error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-center mt-4 animate-shake';
    errorDiv.textContent = message;

    // Insert before buttons
    const buttonContainer = stepElement.querySelector('.flex.justify-center, .flex.justify-between');
    if (buttonContainer) {
        buttonContainer.parentNode.insertBefore(errorDiv, buttonContainer);
    } else {
        stepElement.appendChild(errorDiv);
    }
}

function clearError(stepElement) {
    const existingError = stepElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// --- LOGIKA NAVIGASI STEP-BY-STEP ---
window.nextStep = function (targetStep) {
    // Validasi step saat ini sebelum pindah ke step berikutnya
    if (targetStep > currentStep) {
        if (!validateCurrentStep(currentStep)) {
            return; // Jangan pindah kalau validasi gagal
        }
    }

    // Sembunyikan SEMUA step
    const allSteps = document.querySelectorAll('[id^="step-"]');
    allSteps.forEach(step => {
        step.classList.add('hidden');
    });

    // Tampilkan target step
    const targetElement = document.getElementById('step-' + targetStep);
    if (targetElement) {
        targetElement.classList.remove('hidden');
        currentStep = targetStep;

        // Update progress bar
        updateProgressBar(targetStep);

        // Scroll ke atas
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.error("Target step tidak ditemukan: " + targetStep);
    }
}

function updateProgressBar(stepNumber) {
    const progressPercentage = (stepNumber / totalSteps) * 100;

    const progressBar = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');

    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
    }
    if (progressText) {
        progressText.innerText = `${Math.round(progressPercentage)}%`;
    }

    // Update section title
    updateSectionTitle(stepNumber);
}

function updateSectionTitle(stepNumber) {
    const sectionTitle = document.getElementById('section-title');
    if (!sectionTitle) return;

    let title = '';

    if (stepNumber >= 1 && stepNumber <= 14) {
        title = 'Bagian 1: Data Diri';
    } else if (stepNumber >= 15 && stepNumber <= 17) {
        title = 'Bagian 2: Kriteria';
    } else if (stepNumber >= 18 && stepNumber <= 20) {
        title = 'Bagian 3: Minat & Motivasi';
    } else if (stepNumber >= 21 && stepNumber <= 23) {
        title = 'Bagian 4: Komitmen Waktu';
    } else if (stepNumber === 24) {
        title = 'Penutup';
    }

    sectionTitle.textContent = title;
}

// --- LOGIKA SUBMIT FORM ---
async function submitForm() {
    console.log("Mengirim data...");

    // Validasi step terakhir sebelum submit
    if (!validateCurrentStep(23)) {
        return;
    }

    // 1. Ambil Data Diri
    const nama = document.getElementById('nama')?.value;
    const email = document.getElementById('email')?.value;
    const whatsapp = document.getElementById('whatsapp')?.value;
    const jenisKelamin = document.querySelector('input[name="jenis-kelamin"]:checked')?.value;

    // Handle Domisili (Radio vs Text Lainnya)
    let domisili = document.querySelector('input[name="domisili"]:checked')?.value;
    if (domisili === 'Lainnya') {
        domisili = document.getElementById('domisili-lainnya')?.value;
    }

    const pekerjaan = document.getElementById('pekerjaan_atau_aktivitas')?.value;
    const instagram = document.getElementById('akun-instagram')?.value;
    const facebook = document.getElementById('akun-facebook')?.value;
    const threads = document.getElementById('akun-threads')?.value;
    const x = document.getElementById('akun-x')?.value;
    const medium = document.getElementById('akun-medium')?.value;
    const blog = document.getElementById('blog-url')?.value;
    const usia = document.getElementById('usia')?.value;
    const pendidikan = document.querySelector('input[name="pendidikan"]:checked')?.value;

    // 2. Ambil Jawaban
    const kriteria1 = document.querySelector('input[name="pertanyaan-kriteria-pertama"]:checked')?.value;
    const kriteria2 = document.querySelector('input[name="pertanyaan-kriteria-kedua"]:checked')?.value;

    // Perbaikan pengambilan Checkbox Kriteria 3
    const kriteria3_elements = document.querySelectorAll('input[name="pertanyaan-kriteria-ketiga"]:checked');
    let kriteria3 = Array.from(kriteria3_elements).map(el => el.value).join(', ');

    // Cek kalau ada input text "Lainnya" di checkbox (multiple inputs)
    const lainnyaChecked = Array.from(kriteria3_elements).some(el => el.value === 'Lainnya');
    if (lainnyaChecked) {
        const lainnyaInputs = document.querySelectorAll('input[name="kategori-lainnya[]"]');
        const lainnyaValues = Array.from(lainnyaInputs).map(el => el.value.trim()).filter(v => v);
        if (lainnyaValues.length > 0) {
            kriteria3 = kriteria3.replace('Lainnya', `Lainnya: ${lainnyaValues.join(', ')}`);
        }
    }

    const minat1 = document.getElementById('minat-essay')?.value;
    const minat2 = document.querySelector('input[name="pertanyaan-minat-motivasi-kedua"]:checked')?.value;
    const minat3 = document.querySelector('input[name="pertanyaan-minat-motivasi-ketiga"]:checked')?.value;

    const komitmen1 = document.querySelector('input[name="pertanyaan-komitmen-waktu-pertama"]:checked')?.value;
    const komitmen2 = document.querySelector('input[name="pertanyaan-komitmen-waktu-kedua"]:checked')?.value;
    const komitmen3 = document.querySelector('input[name="pertanyaan-komitmen-waktu-ketiga"]:checked')?.value;

    // 3. KIRIM KE SUPABASE
    try {
        // Tahap A: Data Diri
        const { data: pendaftarData, error: pendaftarError } = await supabaseClient
            .from('pendaftar')
            .insert([{
                nama_lengkap: nama,
                email: email,
                nomor_whatsapp: whatsapp,
                jenis_kelamin: jenisKelamin,
                domisili: domisili,
                pekerjaan: pekerjaan,
                akun_instagram: instagram,
                akun_facebook: facebook,
                akun_threads: threads,
                akun_x: x,
                akun_medium: medium,
                url_blog: blog,
                usia: usia,
                pendidikan_terakhir: pendidikan
            }])
            .select();

        if (pendaftarError) {
            console.error('Error menyimpan data diri:', pendaftarError);
            alert('Gagal menyimpan data diri: ' + pendaftarError.message);
            return;
        }

        const newPendaftarId = pendaftarData[0].id;

        // Tahap B: Jawaban
        const jawabanObject = {
            kriteria_1: kriteria1,
            kriteria_2: kriteria2,
            kriteria_3: kriteria3,
            minat_1: minat1,
            minat_2: minat2,
            minat_3: minat3,
            komitmen_1: komitmen1,
            komitmen_2: komitmen2,
            komitmen_3: komitmen3
        };

        const { data: jawabanData, error: jawabanError } = await supabaseClient
            .from('daftar_jawaban')
            .insert([{
                id_pendaftar: newPendaftarId,
                jawaban_seleksi: jawabanObject
            }]);

        if (jawabanError) {
            console.error('Error menyimpan jawaban:', jawabanError);
            alert('Data diri tersimpan, tapi gagal menyimpan jawaban (Error Database).');
        } else {
            // Berhasil - tampilkan halaman terima kasih
            nextStep(24);
        }
    } catch (err) {
        console.error('Error koneksi:', err);
        alert('Gagal menghubungi server. Periksa koneksi internet Anda.');
    }
}
