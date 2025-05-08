import React, { useState, useEffect } from 'react';

const StreamPengguna = () => {
  const [pengguna, setPengguna] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  
  const startStream = async () => {
    setLoading(true);
    setPengguna([]);
    setError(null);
    setMessage('Memulai pengambilan data streaming...');
    
    try {
      const response = await fetch('http://localhost:3000/api/pengguna-stream?jumlah=20');
      
      if (!response.body) {
        throw new Error('ReadableStream tidak didukung di browser ini');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      const processChunks = async () => {
        while (true) {
          const { value, done } = await reader.read();
          
          if (done) {
            // Proses sisa buffer jika masih ada
            if (buffer) {
              try {
                const finalData = JSON.parse(buffer);
                setPengguna(prev => [...prev, ...(Array.isArray(finalData) ? finalData : [finalData])]);
              } catch (e) {
                console.error('Error parsing final buffer:', e);
              }
            }
            setMessage('Pengambilan data streaming selesai');
            setLoading(false);
            return;
          }
          
          // Tambahkan chunk baru ke buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Coba untuk mendapatkan JSON yang valid
          try {
            // Ini adalah pendekatan sederhana - di kasus nyata, perlu lebih robust
            // untuk menangani JSON yang terpotong
            const data = JSON.parse(buffer);
            setPengguna(data);
            buffer = '';
            setMessage(`Menerima data: ${data.length} pengguna`);
          } catch (e) {
            // Belum valid JSON, tunggu chunk berikutnya
            setMessage('Menerima data...');
          }
        }
      };
      
      processChunks();
    } catch (err) {
      setError(`Error: ${err.message}`);
      setLoading(false);
    }
  };
  
  return (
    <div className="stream-container" style={{ 
      backgroundColor: '#fff9e6', 
      padding: '15px', 
      borderRadius: '8px', 
      marginTop: '20px' 
    }}>
      <h3>Streaming API Demo</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={startStream}
          disabled={loading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#ff9800', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? 'Streaming...' : 'Mulai Streaming'}
        </button>
        
        {message && (
          <div style={{ marginTop: '10px', color: '#666' }}>
            {message}
          </div>
        )}
        
        {error && (
          <div style={{ marginTop: '10px', color: 'red' }}>
            {error}
          </div>
        )}
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
        gap: '10px' 
      }}>
        {pengguna.map((p, index) => (
          <div 
            key={p.id || index} 
            style={{ 
              backgroundColor: '#fff',
              border: '1px solid #ffcc80',
              borderRadius: '8px',
              padding: '10px',
              animation: 'fadeIn 0.5s ease-in-out',
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
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StreamPengguna;