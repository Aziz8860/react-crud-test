import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SalesForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    invoiceCode: "",
    invoiceDate: "",
    items: [{ productName: "", qty: 1, price: 0 }],
    discount: 0,
    grandTotal: 0,
  });

  const [errors, setErrors] = useState({});

  // Load existing data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const storedSales = JSON.parse(localStorage.getItem("sales") || "[]");
      const saleToEdit = storedSales.find((sale) => sale.invoiceCode === id);

      if (saleToEdit) {
        // Convert timestamp to YYYY-MM-DD format for input
        const date = new Date(saleToEdit.invoiceDate);
        const formattedDate = date.toISOString().split("T")[0];

        setFormData({
          ...saleToEdit,
          invoiceDate: formattedDate,
        });
      } else {
        // Redirect if sale not found
        navigate("/");
      }
    }
  }, [id, isEditMode, navigate]);

  // Calculate grand total whenever items or discount change
  useEffect(() => {
    const itemsTotal = formData.items.reduce((sum, item) => {
      return sum + Number(item.qty) * Number(item.price);
    }, 0);

    const grandTotal = Math.max(0, itemsTotal - Number(formData.discount));
    setFormData((prev) => ({ ...prev, grandTotal }));
  }, [formData.items, formData.discount]);

  const validateForm = () => {
    const newErrors = {};

    // Validate invoice code
    if (!formData.invoiceCode) {
      newErrors.invoiceCode = "Kode faktur wajib diisi";
    } else if (formData.invoiceCode.length > 32) {
      newErrors.invoiceCode = "Kode faktur maksimal 32 karakter";
    }

    // Validate invoice date
    if (!formData.invoiceDate) {
      newErrors.invoiceDate = "Tanggal faktur wajib diisi";
    } else {
      const selectedDate = new Date(formData.invoiceDate);
      const minDate = new Date("2020-01-01");
      if (selectedDate < minDate) {
        newErrors.invoiceDate = "Tanggal harus setelah 1 Januari 2020";
      }
    }

    // Validate items
    if (formData.items.length === 0) {
      newErrors.items = "Minimal satu item wajib diisi";
    } else {
      formData.items.forEach((item, index) => {
        if (!item.productName) {
          newErrors[`items[${index}].productName`] = "Nama produk wajib diisi";
        } else if (item.productName.length > 32) {
          newErrors[`items[${index}].productName`] =
            "Nama produk maksimal 32 karakter";
        }

        if (item.qty <= 0) {
          newErrors[`items[${index}].qty`] = "Kuantitas harus lebih dari 0";
        } else if (item.qty > 1000) {
          newErrors[`items[${index}].qty`] = "Kuantitas maksimal 1.000";
        }

        if (item.price <= 0) {
          newErrors[`items[${index}].price`] = "Harga harus lebih dari 0";
        } else if (item.price > 1000000) {
          newErrors[`items[${index}].price`] = "Harga maksimal 1.000.000";
        }
      });
    }

    // Validate discount
    if (formData.discount < 0) {
      newErrors.discount = "Diskon tidak boleh negatif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productName: "", qty: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, items: updatedItems }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Prepare data for saving
      const dataToSave = {
        ...formData,
        invoiceDate: new Date(formData.invoiceDate).getTime(), // Convert to timestamp
      };

      // Get existing sales
      const storedSales = JSON.parse(localStorage.getItem("sales") || "[]");

      if (isEditMode) {
        // Update existing sale
        const updatedSales = storedSales.map((sale) =>
          sale.invoiceCode === id ? dataToSave : sale
        );
        localStorage.setItem("sales", JSON.stringify(updatedSales));

        // Redirect to detail page
        navigate(`/detail/${id}`);
      } else {
        // Check if invoice code already exists
        const codeExists = storedSales.some(
          (sale) => sale.invoiceCode === formData.invoiceCode
        );
        if (codeExists) {
          setErrors({ invoiceCode: "Kode faktur sudah ada" });
          return;
        }

        // Add new sale
        localStorage.setItem(
          "sales",
          JSON.stringify([...storedSales, dataToSave])
        );

        // Redirect back to sales list
        navigate("/");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Faktur" : "Tambah Faktur"}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Invoice Code */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Kode Faktur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="invoiceCode"
              value={formData.invoiceCode}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.invoiceCode ? "border-red-500" : "border-gray-300"
              }`}
              maxLength={32}
              readOnly={isEditMode}
              required
            />
            {errors.invoiceCode && (
              <p className="text-red-500 text-xs mt-1">{errors.invoiceCode}</p>
            )}
          </div>

          {/* Invoice Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tanggal Faktur <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${
                errors.invoiceDate ? "border-red-500" : "border-gray-300"
              }`}
              min="2020-01-01"
              required
            />
            {errors.invoiceDate && (
              <p className="text-red-500 text-xs mt-1">{errors.invoiceDate}</p>
            )}
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-2">Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 mb-3">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">No.</th>
                  <th className="py-2 px-4 border-b text-left">Nama Produk</th>
                  <th className="py-2 px-4 border-b text-center">Kuantitas</th>
                  <th className="py-2 px-4 border-b text-right">Harga</th>
                  <th className="py-2 px-4 border-b text-right">Subtotal</th>
                  <th className="py-2 px-4 border-b text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">
                      <input
                        type="text"
                        value={item.productName}
                        onChange={(e) =>
                          handleItemChange(index, "productName", e.target.value)
                        }
                        className={`w-full p-2 border rounded ${
                          errors[`items[${index}].productName`]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        maxLength={32}
                        required
                      />
                      {errors[`items[${index}].productName`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`items[${index}].productName`]}
                        </p>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          handleItemChange(index, "qty", Number(e.target.value))
                        }
                        className={`w-full p-2 border rounded ${
                          errors[`items[${index}].qty`]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        min="1"
                        max="1000"
                        required
                      />
                      {errors[`items[${index}].qty`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`items[${index}].qty`]}
                        </p>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "price",
                            Number(e.target.value)
                          )
                        }
                        className={`w-full p-2 border rounded ${
                          errors[`items[${index}].price`]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        min="1"
                        max="1000000"
                        required
                      />
                      {errors[`items[${index}].price`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`items[${index}].price`]}
                        </p>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      Rp. {(item.qty * item.price).toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Hapus
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            + Tambah Item
          </button>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div></div>
          <div>
            {/* Totals */}
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span>Sub Total</span>
                <span>
                  Rp.{" "}
                  {formData.items
                    .reduce((sum, item) => sum + item.qty * item.price, 0)
                    .toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Diskon</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className={`w-32 p-2 border rounded ${
                      errors.discount ? "border-red-500" : "border-gray-300"
                    }`}
                    min="0"
                  />
                </div>
              </div>

              <div className="flex justify-between font-bold pt-2 border-t border-gray-300 mt-2">
                <span>TOTAL</span>
                <span>Rp. {formData.grandTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() =>
              isEditMode ? navigate(`/detail/${id}`) : navigate("/")
            }
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesForm;
