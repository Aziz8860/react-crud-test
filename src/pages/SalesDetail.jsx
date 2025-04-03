import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Grid,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SalesDetail = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load sale data from localStorage
    const storedSales = JSON.parse(localStorage.getItem("sales") || "[]");
    const foundSale = storedSales.find((s) => s.invoiceCode === id);

    setSale(foundSale || null);
    setLoading(false);
  }, [id]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("id-ID");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!sale) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6">Faktur tidak ditemukan</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Detail Faktur
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Kembali
          </Button>
          <Button
            component={Link}
            to={`/edit/${id}`}
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        </Stack>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Kode Faktur
              </Typography>
              <Typography variant="body1">{sale.invoiceCode}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Tanggal Faktur
              </Typography>
              <Typography variant="body1">
                {formatDate(sale.invoiceDate)}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }} align="left">
            Items
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Nama Produk</TableCell>
                  <TableCell align="center">Kuantitas</TableCell>
                  <TableCell align="right">Harga</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sale.items.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell align="center">{item.qty}</TableCell>
                    <TableCell align="right">
                      Rp. {item.price.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell align="right">
                      Rp. {(item.qty * item.price).toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Paper sx={{ p: 2, width: { xs: "100%", md: "33%" } }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">
                  Rp.{" "}
                  {sale.items
                    .reduce((sum, item) => sum + item.qty * item.price, 0)
                    .toLocaleString("id-ID")}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1">Diskon</Typography>
                <Typography variant="body1">
                  Rp. {sale.discount.toLocaleString("id-ID")}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight="bold">
                  TOTAL
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Rp. {sale.grandTotal.toLocaleString("id-ID")}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SalesDetail;
