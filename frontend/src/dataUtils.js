// Fungsi untuk mengolah data di thread utama (mirip dengan Web Worker)
export const processData = (data, operasi, filter, sortBy, sortOrder) => {
    const startTime = performance.now();
    
    let hasil = [...data];
    
    // Lakukan filter jika diperlukan
    if (operasi === 'filter' || operasi === 'both') {
      if (filter.umurMin) {
        hasil = hasil.filter(p => p.umur >= filter.umurMin);
      }
      if (filter.umurMax) {
        hasil = hasil.filter(p => p.umur <= filter.umurMax);
      }
      if (filter.nama) {
        hasil = hasil.filter(p => p.nama.toLowerCase().includes(filter.nama.toLowerCase()));
      }
    }
    
    // Lakukan sorting jika diperlukan
    if (operasi === 'sort' || operasi === 'both') {
      if (sortBy === 'nama') {
        hasil.sort((a, b) => {
          const comparison = a.nama.localeCompare(b.nama);
          return sortOrder === 'asc' ? comparison : -comparison;
        });
      } else if (sortBy === 'umur') {
        hasil.sort((a, b) => {
          const comparison = a.umur - b.umur;
          return sortOrder === 'asc' ? comparison : -comparison;
        });
      }
    }
    
    const endTime = performance.now();
    
    return {
      hasil: hasil,
      waktuProses: endTime - startTime
    };
  };
  
  // Fungsi untuk memeriksa apakah cache masih valid
  export const isCacheValid = (timestamp) => {
    const now = new Date().getTime();
    const cacheTime = parseInt(timestamp);
    const expiryTime = 5 * 60 * 1000; // 5 menit dalam milidetik
    
    return now - cacheTime < expiryTime;
  };