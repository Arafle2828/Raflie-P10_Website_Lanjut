import React from 'react';

const MetricsDisplay = ({ metrics }) => {
  const formatTime = (time) => {
    if (!time && time !== 0) return 'N/A';
    return `${time.toFixed(2)} ms`;
  };
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(parseInt(timestamp));
    return date.toLocaleTimeString();
  };
  
  const calculateExpiry = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(parseInt(timestamp));
    date.setMinutes(date.getMinutes() + 5); // Cache berlaku 5 menit
    return date.toLocaleTimeString();
  };
  
  return (
    <div className="metrics-container" style={{ 
      backgroundColor: '#f0f8ff', 
      padding: '15px', 
      borderRadius: '8px', 
      marginBottom: '20px',
      fontSize: '14px'
    }}>
      <h3>Metrik Performa</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <h4>Waktu Pengambilan Data</h4>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            <li><strong>Promise.all:</strong> {formatTime(metrics.promiseAllTime)}</li>
            <li><strong>Promise.allSettled:</strong> {formatTime(metrics.promiseAllSettledTime)}</li>
            <li><strong>Sumber Data:</strong> {metrics.dataSource || 'N/A'}</li>
          </ul>
        </div>
        
        <div>
          <h4>Waktu Pemrosesan Data</h4>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            <li><strong>Metode:</strong> {metrics.useWorker ? 'Web Worker (Thread Terpisah)' : 'Thread Utama'}</li>
            <li><strong>Waktu Proses:</strong> {formatTime(metrics.processingTime)}</li>
            <li><strong>Total Data:</strong> {metrics.totalData || 0} pengguna</li>
            <li><strong>Data Terfilter:</strong> {metrics.filteredData || 0} pengguna</li>
          </ul>
        </div>
      </div>
      
      {metrics.dataSource === 'Cache' && (
        <div style={{ marginTop: '10px' }}>
          <h4>Informasi Cache</h4>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            <li><strong>Cache Dibuat:</strong> {formatTimestamp(metrics.cacheTimestamp)}</li>
            <li><strong>Cache Kedaluwarsa:</strong> {calculateExpiry(metrics.cacheTimestamp)}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MetricsDisplay;