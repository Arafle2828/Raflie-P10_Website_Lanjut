import React from 'react';

const DaftarPengguna = ({ pengguna, loading }) => {
  if (loading) {
    return <p>Sedang memuat data...</p>;
  }
  
  if (!pengguna || pengguna.length === 0) {
    return <p>Tidak ada data pengguna yang tersedia.</p>;
  }
  
  return (
    <div className="user-list-container">
      <h3>Daftar Pengguna ({pengguna.length})</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '15px' 
      }}>
        {pengguna.map((p) => (
          <div 
            key={p.id} 
            style={{ 
              backgroundColor: 'white', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h4 style={{ margin: '0 0 8px 0' }}>{p.nama}</h4>
            <p style={{ margin: '0', color: '#666' }}>
              <strong>Umur:</strong> {p.umur} tahun<br />
              <strong>Email:</strong> {p.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaftarPengguna;