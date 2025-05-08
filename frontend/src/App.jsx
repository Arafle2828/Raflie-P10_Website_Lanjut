import React, { useState, useEffect } from 'react'; 
import DaftarPengguna from './components/DaftarPengguna'; 
import UserControls from './components/UserControls'; 
import MetricsDisplay from './components/MetricsDisplay'; 
import StreamPengguna from './components/StreamPengguna'; 
import { processData, isCacheValid } from './dataUtils'; 

const App = () => { 
  // State untuk data dan loading
  const [rawData, setRawData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [loading, setLoading] = useState(false); 
  
  // State untuk filter dan sorting
  const [filter, setFilter] = useState({}); 
  const [sortBy, setSortBy] = useState('nama'); 
  const [sortOrder, setSortOrder] = useState('asc'); 
  const [useWorker, setUseWorker] = useState(true); 
  
  // State untuk metrics
  const [metrics, setMetrics] = useState({ 
    promiseAllTime: null, 
    promiseAllSettledTime: null, 
    processingTime: null, 
    dataSource: null, 
    totalData: 0, 
    filteredData: 0, 
    useWorker: true, 
    cacheTimestamp: null 
  }); 
  
  // Fetch data dari server dengan Promise.all
  const fetchDataWithPromiseAll = async (forceRefresh = false) => { 
    setLoading(true); 
    
    // Periksa cache terlebih dahulu jika tidak forceRefresh
    const cacheKey = 'penggunaDataCache'; 
    const cacheTimestampKey = 'penggunaCacheTimestamp'; 
    const cache = localStorage.getItem(cacheKey); 
    const cacheTimestamp = localStorage.getItem(cacheTimestampKey); 
    
    if (cache && cacheTimestamp && isCacheValid(cacheTimestamp) && !forceRefresh) { 
      const cachedData = JSON.parse(cache); 
      setRawData(cachedData); 
      setFilteredData(cachedData); 
      setMetrics(prev => ({ 
        ...prev, 
        dataSource: 'Cache', 
        totalData: cachedData.length, 
        filteredData: cachedData.length, 
        cacheTimestamp: cacheTimestamp 
      })); 
      setLoading(false); 
      return; 
    } 
    
    try { 
      const startTime = performance.now(); 
      
      // Buat 3 promises untuk 3 halaman berbeda
      const promises = [ 
        fetch('http://localhost:3000/api/pengguna?halaman=1&jumlah=30'), 
        fetch('http://localhost:3000/api/pengguna?halaman=2&jumlah=30'), 
        fetch('http://localhost:3000/api/pengguna?halaman=3&jumlah=30') 
      ]; 
      
      // Gunakan Promise.all untuk mengambil semua data secara paralel
      const responses = await Promise.all(promises); 
      const dataPromises = responses.map(response => response.json()); 
      const dataArrays = await Promise.all(dataPromises); 
      
      // Gabungkan semua array data
      const allData = dataArrays.flat(); 
      const endTime = performance.now(); 
      
      // Simpan data di cache dengan waktu timestamp
      const timestamp = new Date().getTime().toString(); 
      localStorage.setItem(cacheKey, JSON.stringify(allData)); 
      localStorage.setItem(cacheTimestampKey, timestamp); 
      
      setRawData(allData); 
      setFilteredData(allData);
      setMetrics(prev => ({ 
        ...prev, 
        promiseAllTime: endTime - startTime, 
        dataSource: 'Server (Promise.all)', 
        totalData: allData.length, 
        filteredData: allData.length, 
        cacheTimestamp: timestamp 
      })); 
    } catch (err) { 
      console.error('Error fetching data:', err); 
      // Jika gagal dan ada cache, gunakan cache sebagai fallback
      if (cache) {
        const cachedData = JSON.parse(cache);
        setRawData(cachedData);
        setFilteredData(cachedData);
        setMetrics(prev => ({
          ...prev,
          dataSource: 'Cache (Fallback)',
          totalData: cachedData.length,
          filteredData: cachedData.length,
          cacheTimestamp: cacheTimestamp
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data dari server dengan Promise.allSettled
  const fetchDataWithPromiseAllSettled = async () => {
    setLoading(true);
    
    try {
      const startTime = performance.now();
      
      // Buat 3 promises untuk 3 halaman berbeda
      const promises = [
        fetch('http://localhost:3000/api/pengguna?halaman=1&jumlah=30'),
        fetch('http://localhost:3000/api/pengguna?halaman=2&jumlah=30'),
        fetch('http://localhost:3000/api/pengguna?halaman=3&jumlah=30')
      ];
      
      // Gunakan Promise.allSettled untuk mengambil data yang berhasil saja
      const results = await Promise.allSettled(promises);
      const successfulResponses = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
      
      // Ekstrak data JSON dari response yang berhasil
      const dataPromises = successfulResponses.map(response => response.json());
      const dataArrays = await Promise.all(dataPromises);
      
      // Gabungkan semua array data
      const allData = dataArrays.flat();
      const endTime = performance.now();
      
      setRawData(allData);
      setFilteredData(allData);
      setMetrics(prev => ({
        ...prev,
        promiseAllSettledTime: endTime - startTime,
        dataSource: 'Server (Promise.allSettled)',
        totalData: allData.length,
        filteredData: allData.length
      }));
    } catch (err) {
      console.error('Error fetching data with Promise.allSettled:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter dan sorting
  const handleFilter = async () => {
    if (rawData.length === 0) return;
    
    const startTime = performance.now();
    let hasil;
    
    if (useWorker) {
      // Gunakan web worker untuk memproses data
      const worker = new Worker('./worker.js');
      
      try {
        hasil = await new Promise((resolve, reject) => {
          worker.onmessage = (e) => {
            resolve(e.data);
          };
          
          worker.onerror = (e) => {
            reject(e);
          };
          
          worker.postMessage({
            data: rawData,
            operasi: 'both',
            filter,
            sortBy,
            sortOrder
          });
        });
        
        setFilteredData(hasil.hasil);
        setMetrics(prev => ({
          ...prev,
          processingTime: hasil.waktuProses,
          filteredData: hasil.hasil.length,
          useWorker: true
        }));
      } catch (err) {
        console.error('Worker error:', err);
        // Fallback ke proses di thread utama
        const prosesLangsung = processData(rawData, 'both', filter, sortBy, sortOrder);
        setFilteredData(prosesLangsung.hasil);
        setMetrics(prev => ({
          ...prev,
          processingTime: prosesLangsung.waktuProses,
          filteredData: prosesLangsung.hasil.length,
          useWorker: false
        }));
      } finally {
        worker.terminate();
      }
    } else {
      // Proses langsung di thread utama
      const prosesLangsung = processData(rawData, 'both', filter, sortBy, sortOrder);
      setFilteredData(prosesLangsung.hasil);
      setMetrics(prev => ({
        ...prev,
        processingTime: prosesLangsung.waktuProses,
        filteredData: prosesLangsung.hasil.length,
        useWorker: false
      }));
    }
    
    const endTime = performance.now();
    console.log(`Total waktu (termasuk overhead): ${endTime - startTime} ms`);
  };

  // Refresh data
  const handleRefresh = () => {
    fetchDataWithPromiseAll(true);
  };

  // Efek untuk memuat data pertama kali
  useEffect(() => {
    fetchDataWithPromiseAll();
  }, []);

  // Efek untuk filter otomatis saat filter/sort berubah
  useEffect(() => {
    if (rawData.length > 0) {
      handleFilter();
    }
  }, [sortBy, sortOrder]);

  return (
    <div className="app-container" style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px' 
    }}>
      <h1>Eksplorasi Async</h1>
      
      <MetricsDisplay metrics={metrics} />
      
      <UserControls 
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        useWorker={useWorker}
        setUseWorker={setUseWorker}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
      />
      
      <DaftarPengguna 
        pengguna={filteredData} 
        loading={loading} 
      />
      
      <StreamPengguna />
    </div>
  );
};

export default App;