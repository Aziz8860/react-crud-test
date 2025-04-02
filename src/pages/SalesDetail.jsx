import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const SalesDetail = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load sale data from localStorage
    const storedSales = JSON.parse(localStorage.getItem('sales') || '[]');
    const foundSale = storedSales.find(s => s.invoiceCode === id);
    
    setSale(foundSale || null);
    setLoading(false);
  }, [id]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('id-ID');
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!sale) {
    return <div className="container mx-auto p-4">Faktur tidak ditemukan</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detail Faktur</h1>
        <div className="flex space-x-2">
          <Link 
            to="/" 
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Kembali
          </Link>
          <Link 
            to={`/edit/${id}`} 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Kode Faktur</p>
            <p className="font-medium">{sale.invoiceCode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tanggal Faktur</p>
            <p className="font-medium">{formatDate(sale.invoiceDate)}</p>
          </div>
        </div>

        <h2 className="text-lg font-medium mb-3">Items</h2>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">No.</th>
                <th className="py-2 px-4 border-b text-left">Nama Produk</th>
                <th className="py-2 px-4 border-b text-center">Kuantitas</th>
                <th className="py-2 px-4 border-b text-right">Harga</th>
                <th className="py-2 px-4 border-b text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{item.productName}</td>
                  <td className="py-2 px-4 border-b text-center">{item.qty}</td>
                  <td className="py-2 px-4 border-b text-right">
                    Rp. {item.price.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    Rp. {(item.qty * item.price).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-full md:w-1/3">
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>
                  Rp. {sale.items.reduce((sum, item) => sum + (item.qty * item.price), 0).toLocaleString('id-ID')}
                </span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Diskon</span>
                <span>Rp. {sale.discount.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="flex justify-between font-bold pt-2 border-t border-gray-300 mt-2">
                <span>TOTAL</span>
                <span>Rp. {sale.grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDetail;
