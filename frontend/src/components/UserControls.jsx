import React from 'react';

const UserControls = ({ 
  filter, 
  setFilter, 
  sortBy, 
  setSortBy, 
  sortOrder, 
  setSortOrder,
  useWorker,
  setUseWorker,
  handleFilter,
  handleRefresh
}) => {
  return (
    <div className="controls-container" style={{ 
      backgroundColor: '#f5f5f5',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3>Filter dan Sortir</h3>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
        <div>
          <label htmlFor="nama">Nama mengandung: </label>
          <input
            type="text"
            id="nama"
            value={filter.nama || ''}
            onChange={(e) => setFilter({...filter, nama: e.target.value})}
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        
        <div>
          <label htmlFor="umurMin">Umur Min: </label>
          <input
            type="number"
            id="umurMin"
            value={filter.umurMin || ''}
            onChange={(e) => setFilter({...filter, umurMin: e.target.value ? parseInt(e.target.value) : ''})}
            style={{ padding: '5px', width: '60px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        
        <div>
          <label htmlFor="umurMax">Umur Max: </label>
          <input
            type="number"
            id="umurMax"
            value={filter.umurMax || ''}
            onChange={(e) => setFilter({...filter, umurMax: e.target.value ? parseInt(e.target.value) : ''})}
            style={{ padding: '5px', width: '60px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        
        <div>
          <label htmlFor="sortBy">Urutkan berdasarkan: </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="nama">Nama</option>
            <option value="umur">Umur</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="sortOrder">Urutan: </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="asc">Naik (A-Z, 1-100)</option>
            <option value="desc">Turun (Z-A, 100-1)</option>
          </select>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div>
          <label>
            <input
              type="checkbox"
              checked={useWorker}
              onChange={(e) => setUseWorker(e.target.checked)}
            />
            {' '}Gunakan Web Worker (proses di thread terpisah)
          </label>
        </div>
        
        <button 
          onClick={handleFilter}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Terapkan Filter
        </button>
        
        <button 
          onClick={handleRefresh}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#2196F3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Segarkan Data
        </button>
      </div>
    </div>
  );
};

export default UserControls;