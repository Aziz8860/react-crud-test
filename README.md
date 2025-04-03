# Faktur Digital App

A simple web application for managing digital sales invoices (faktur). Built with React and styled using Material UI with a Brutalist design aesthetic.

## Features

- **Create, Read, Update, Delete (CRUD):** Manage sales invoice records.
- **Brutalist UI:** High-contrast, bold typography, sharp edges, and functional design implemented via Material UI theme customization.
- **Field Validation:** Input fields in the sales form include basic validation to ensure data integrity (e.g., required fields, numeric checks).
- **Local Persistence:** Invoice data is saved to the browser's `localStorage`, allowing data to persist across page refreshes and browser sessions. (Alternatively, standard React `useState` could be used if data persistence is not required).
- **Responsive Design:** The layout adapts to different screen sizes.

## Tech Stack

- **Frontend Framework:** [React](https://react.dev/) (v19)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **UI Library:** [Material UI (MUI)](https://mui.com/) (v7)
- **Routing:** [React Router](https://reactrouter.com/) (v7)
- **Icons:** [Material Icons](https://mui.com/material-ui/material-icons/)
- **Font:** [Lato](https://fonts.google.com/specimen/Lato) (via Fontsource)
- **Language:** JavaScript (with JSX)
- **Styling:** CSS + Material UI `sx` prop and `createTheme`

## Design Philosophy

The application adopts a **Brutalist** design style, characterized by:

- Minimal ornamentation
- Raw, exposed structure (visible borders)
- High contrast (primarily black, white, and yellow accents)
- Bold, uppercase typography (Lato font)
- Sharp edges (minimal border-radius)
- Clear visual hierarchy

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm (usually comes with Node.js)

### Installation & Running

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Aziz8860/react-crud-test.git
    cd react-crud-test
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will typically be available at `http://localhost:5173`.

## State Management Note

This application currently uses `localStorage` to store the sales data. This makes the data persistent locally in the user's browser. If you were to switch to using only React's `useState` without `localStorage`, the data would be lost every time the page is refreshed or the browser is closed.

## Technical Specifications

The application follows these technical specifications for the sales data structure:

```javascript
sales: {
  invoiceCode: string, max 32 character
  invoiceDate: epoch timestamp, must be after year 2020
  items: array of {
    productName: string, max 32 character,
    qty: positive number, max 1,000
    price: positive number, max 1,000,000
  }
  discount: non negative number
  grandTotal: sum of qty * price in items - discount, read-only
}
```

## Data Storage Format

The data is stored in `localStorage` in the following JSON format:

```json
[
  {
    "invoiceCode": "121212",
    "invoiceDate": 1745452800000,
    "items": [
      {
        "productName": "Panadol Biru",
        "qty": 1,
        "price": 12000
      },
      {
        "productName": "Sidomuncul",
        "qty": 1,
        "price": 10000
      }
    ],
    "discount": 0,
    "grandTotal": 22000
  },
  {
    "invoiceCode": "121c111cw2",
    "invoiceDate": 1745366400000,
    "items": [
      {
        "productName": "Hemaviton",
        "qty": 2,
        "price": 5000
      },
      {
        "productName": "Vitamin D",
        "qty": 4,
        "price": 6000
      },
      {
        "productName": "Vitamin C",
        "qty": 1,
        "price": 4000
      }
    ],
    "discount": 5000,
    "grandTotal": 33000
  }
]
```
