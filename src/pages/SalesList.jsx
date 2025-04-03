import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  IconButton,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Daftar Faktur
        </Typography>
        <Button 
          component={Link} 
          to="/add" 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
        >
          Tambah Faktur
        </Button>
      </Box>

      {sales.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            Belum ada faktur. Silakan buat faktur pertama Anda!
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No. Faktur</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell align="right">Jumlah Item</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.invoiceCode} hover>
                  <TableCell>{sale.invoiceCode}</TableCell>
                  <TableCell>{formatDate(sale.invoiceDate)}</TableCell>
                  <TableCell align="right">{sale.items.length}</TableCell>
                  <TableCell align="right">
                    Rp. {sale.grandTotal.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton 
                        component={Link} 
                        to={`/detail/${sale.invoiceCode}`}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(sale.invoiceCode)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default SalesList;
