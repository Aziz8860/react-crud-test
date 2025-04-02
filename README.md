# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

- buat web app mirip seperti app todo list
- tetapi item nya adalah penjualan barang dengan skema seperti di bawah
- bisa create, update, delete, show detail, show list
- tidak perlu backend, simpan di local state saja cukup
- perlu ada validasi field input

sales: {
invoiceCode: string, max 32 character
invoiceDate: epoch timestamp, must be after year 2020
items: array of {
productName: string, max 32 character,
qty: positive number, max 1 000
price: positive number, max 1 000 000
}
discount: non negative number
grandTotal: sum of qty \* price in items - discount, hanya ditampilkan tidak bisa diedit
}
