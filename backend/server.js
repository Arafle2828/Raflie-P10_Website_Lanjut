const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

// Fungsi untuk membuat data dummy
const buatPengguna = (id) => ({
  id,
  nama: `Pengguna ${id}`,
  email: `pengguna${id}@contoh.com`,
  umur: Math.floor(Math.random() * 50) + 18
});

// Data generator dengan pagination
const generateDataPerPage = (halaman, jumlahPerHalaman) => {
  const offset = (halaman - 1) * jumlahPerHalaman;
  return Array.from({ length: jumlahPerHalaman }, (_, i) => 
    buatPengguna(offset + i + 1)
  );
};

// Endpoint untuk mengambil daftar pengguna dengan pagination
app.get('/api/pengguna', async (req, res) => {
  const jumlah = parseInt(req.query.jumlah) || 50;
  const halaman = parseInt(req.query.halaman) || 1;
  
  // Simulasi waktu proses server
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  
  const daftarPengguna = generateDataPerPage(halaman, jumlah);
  res.json(daftarPengguna);
});

// Endpoint untuk stream pengguna satu per satu
app.get('/api/pengguna-stream', (req, res) => {
  const jumlah = parseInt(req.query.jumlah) || 50;
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');
  
  let count = 0;
  
  // Fungsi untuk mengirim pengguna satu per satu
  const sendNextUser = () => {
    if (count < jumlah) {
      const user = buatPengguna(count + 1);
      
      // Kirim data sebagai bagian dari JSON array (dengan format yang benar)
      const prefix = count === 0 ? '[' : ',';
      const suffix = count === jumlah - 1 ? ']' : '';
      
      res.write(`${prefix}${JSON.stringify(user)}${suffix}`);
      count++;
      
      // Simulasi delay antar pengguna
      setTimeout(sendNextUser, 100);
    } else {
      res.end();
    }
  };
  
  sendNextUser();
});

app.listen(3000, () => console.log('Server berjalan di http://localhost:3000'));