const supabaseUrl = 'https://fnltpxqupmjesprihfvr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZubHRweHF1cG1qZXNwcmloZnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Njk0MDMsImV4cCI6MjA4MTU0NTQwM30.e8sIIvNXS6ndMd6b8GUPsv7g98WGcJKS2rbpMgRYgT0'
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const form = document.getElementById('daftarForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Ambil Data Diri
    const nama = document.getElementById('nama')?.value;
    const email = document.getElementById('email')?.value;
    const whatsapp = document.getElementById('whatsapp')?.value;
    // Gunakan optional chaining (?.) untuk menghindari error jika elemen tidak dipilih
    const jenisKelamin = document.querySelector('input[name="jenis-kelamin"]:checked')?.value;
    const domisili = document.querySelector('input[name="domisili"]:checked')?.value || document.getElementById('domisili-lainnya')?.value;
    const pekerjaan = document.getElementById('pekerjaan_atau_aktivitas')?.value;
    const instagram = document.getElementById('akun-instagram')?.value;
    const facebook = document.getElementById('akun-facebook')?.value;
    const threads = document.getElementById('akun-threads')?.value;
    const x = document.getElementById('akun-x')?.value;
    const medium = document.getElementById('akun-medium')?.value;
    const blog = document.getElementById('blog-url')?.value;
    const usia = document.getElementById('usia')?.value;
    const pendidikan = document.querySelector('input[name="pendidikan"]:checked')?.value;

    // 2. Ambil Jawaban Kriteria & Motivasi
    const kriteria1 = document.querySelector('input[name="pertanyaan-kriteria-pertama"]:checked')?.value;
    const kriteria2 = document.querySelector('input[name="pertanyaan-kriteria-kedua"]:checked')?.value;

    // Checkbox Kriteria 3 (Bisa pilih lebih dari satu, perlu penanganan khusus jika checkbox)
    // Di HTML Anda saat ini checkbox name="pertanyaan-kriteria-ketiga".
    // Kita ambil semua yang dicentang:
    const kriteria3_elements = document.querySelectorAll('input[name="pertanyaan-kriteria-ketiga"]:checked');
    const kriteria3 = Array.from(kriteria3_elements).map(el => el.value).join(', '); // Gabung jadi string

    const minat1 = document.getElementById('pertanyaan-minat-motivasi-pertama')?.value || document.getElementById('minat-essay')?.value;
    const minat2 = document.querySelector('input[name="pertanyaan-minat-motivasi-kedua"]:checked')?.value;
    const minat3 = document.querySelector('input[name="pertanyaan-minat-motivasi-ketiga"]:checked')?.value;

    const komitmen1 = document.querySelector('input[name="pertanyaan-komitmen-waktu-pertama"]:checked')?.value;
    const komitmen2 = document.querySelector('input[name="pertanyaan-komitmen-waktu-kedua"]:checked')?.value;
    const komitmen3 = document.querySelector('input[name="pertanyaan-komitmen-waktu-ketiga"]:checked')?.value;

    // 3. KIRIM KE SUPABASE

    // Tahap A: Simpan Data Diri ke tabel 'pendaftar'
    const { data: pendaftarData, error: pendaftarError } = await supabase
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
        .select(); // Penting: gunakan .select() untuk mendapatkan ID data yang baru dibuat

    if (pendaftarError) {
        console.error('Error menyimpan data diri:', pendaftarError);
        alert('Gagal menyimpan data diri: ' + pendaftarError.message);
        return;
    }

    const newPendaftarId = pendaftarData[0].id;
    console.log("Data diri tersimpan, ID:", newPendaftarId);

    // Tahap B: Simpan Jawaban ke tabel 'daftar_jawaban'
    // Kita simpan sebagai JSON Object supaya rapi dan tidak perlu buat kolom banyak di database
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

    const { data: jawabanData, error: jawabanError } = await supabase
        .from('daftar_jawaban')
        .insert([{
            id_pendaftar: newPendaftarId,
            jawaban_seleksi: jawabanObject
        }]);

    if (jawabanError) {
        console.error('Error menyimpan jawaban:', jawabanError);
        alert('Data diri tersimpan, tapi gagal menyimpan jawaban.');
    } else {
        console.log('Semua data berhasil disimpan!');
        alert('Terima kasih! Formulir Anda berhasil dikirim.');
        // Opsi: redirect ke halaman sukses
        // window.location.href = 'sukses.html';
    }
});
