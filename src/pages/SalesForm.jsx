import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Divider,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? "Edit Faktur" : "Tambah Faktur"}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3} mb={3}>
              {/* Invoice Code */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Kode Faktur"
                  name="invoiceCode"
                  value={formData.invoiceCode}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  inputProps={{ maxLength: 32 }}
                  error={!!errors.invoiceCode}
                  helperText={errors.invoiceCode}
                  disabled={isEditMode}
                />
              </Grid>

              {/* Invoice Date */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tanggal Faktur"
                  name="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: "2020-01-01" }}
                  error={!!errors.invoiceDate}
                  helperText={errors.invoiceDate}
                />
              </Grid>
            </Grid>

            {/* Items Section */}
            <Box mb={3}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" gutterBottom align="left">
                  Items
                </Typography>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={addItem}
                  >
                    Tambah Item
                  </Button>
                </Box>
              </Box>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 2 }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>No.</TableCell>
                      <TableCell>Nama Produk</TableCell>
                      <TableCell align="center">Kuantitas</TableCell>
                      <TableCell align="right">Harga</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      <TableCell align="center">Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.items.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <TextField
                            value={item.productName}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "productName",
                                e.target.value
                              )
                            }
                            placeholder="Nama produk"
                            fullWidth
                            required
                            inputProps={{ maxLength: 32 }}
                            error={!!errors[`items[${index}].productName`]}
                            helperText={errors[`items[${index}].productName`]}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            value={item.qty.toString()}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              // Allow empty input for better UX
                              if (inputValue === "") {
                                handleItemChange(index, "qty", "");
                              } else {
                                const numValue = Number(inputValue);
                                if (!isNaN(numValue)) {
                                  handleItemChange(index, "qty", numValue);
                                }
                              }
                            }}
                            onBlur={() => {
                              // When field loses focus, ensure value is at least 1
                              if (item.qty === "" || item.qty < 1) {
                                handleItemChange(index, "qty", 1);
                              }
                            }}
                            inputProps={{
                              min: 1,
                              max: 1000,
                              step: "1",
                            }}
                            error={!!errors[`items[${index}].qty`]}
                            helperText={errors[`items[${index}].qty`]}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            value={
                              item.price === 0 ? "" : item.price.toString()
                            }
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              // Allow empty input for better UX
                              if (inputValue === "") {
                                handleItemChange(index, "price", 0);
                              } else {
                                const numValue = Number(inputValue);
                                if (!isNaN(numValue)) {
                                  handleItemChange(index, "price", numValue);
                                }
                              }
                            }}
                            inputProps={{
                              min: 1,
                              max: 1000000,
                              step: "any",
                            }}
                            error={!!errors[`items[${index}].price`]}
                            helperText={errors[`items[${index}].price`]}
                            size="small"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  Rp.
                                </InputAdornment>
                              ),
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          Rp. {(item.qty * item.price).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell align="center">
                          {formData.items.length > 1 && (
                            <IconButton
                              onClick={() => removeItem(index)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Summary Section */}
            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Paper sx={{ p: 2, width: { xs: "100%", md: "33%" } }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1">
                    Rp.{" "}
                    {formData.items
                      .reduce((sum, item) => sum + item.qty * item.price, 0)
                      .toLocaleString("id-ID")}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  mb={1}
                  alignItems="center"
                >
                  <Typography variant="body1">Diskon</Typography>
                  <TextField
                    type="number"
                    name="discount"
                    value={formData.discount === 0 ? "" : formData.discount}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : Number(e.target.value);
                      handleInputChange({
                        target: {
                          name: "discount",
                          value,
                        },
                      });
                    }}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">Rp.</InputAdornment>
                      ),
                    }}
                    inputProps={{ min: 0, step: "any" }}
                    error={!!errors.discount}
                    helperText={errors.discount}
                    sx={{ width: "150px" }}
                  />
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight="bold">
                    TOTAL
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Rp. {formData.grandTotal.toLocaleString("id-ID")}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </CardContent>
        </Card>

        {/* Form Buttons */}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() =>
                isEditMode ? navigate(`/detail/${id}`) : navigate("/")
              }
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
            >
              Simpan
            </Button>
          </Stack>
        </Box>
      </form>
    </Container>
  );
};

export default SalesForm;
