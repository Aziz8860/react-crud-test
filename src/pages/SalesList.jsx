import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SalesList = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    // Load sales data from localStorage
    const storedSales = localStorage.getItem('sales');
    if (storedSales) {
      setSales(JSON.parse(storedSales));
    }
  }, []);

  const handleDelete = (invoiceCode) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      const updatedSales = sales.filter(sale => sale.invoiceCode !== invoiceCode);
      setSales(updatedSales);
      localStorage.setItem('sales', JSON.stringify(updatedSales));
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('id-ID');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Faktur</h1>
        <Link 
          to="/add" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tambah Faktur
        </Link>
      </div>

      {sales.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded">
          <p>Belum ada faktur. Silakan buat faktur pertama Anda!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">No. Faktur</th>
                <th className="py-2 px-4 border-b text-left">Tanggal</th>
                <th className="py-2 px-4 border-b text-right">Jumlah Item</th>
                <th className="py-2 px-4 border-b text-right">Total</th>
                <th className="py-2 px-4 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.invoiceCode} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{sale.invoiceCode}</td>
                  <td className="py-2 px-4 border-b">{formatDate(sale.invoiceDate)}</td>
                  <td className="py-2 px-4 border-b text-right">{sale.items.length}</td>
                  <td className="py-2 px-4 border-b text-right">
                    Rp. {sale.grandTotal.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <div className="flex justify-center space-x-2">
                      <Link 
                        to={`/detail/${sale.invoiceCode}`} 
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Lihat
                      </Link>
                      <button 
                        onClick={() => handleDelete(sale.invoiceCode)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesList;
