import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProductList from './Component/ProductList';
import ProductListTable from './Component/ProductListTable';
import ProductDetails from './Component/ProductDetails';
const router = createBrowserRouter([
  
  {
    path: '/',
    element: <ProductList />
  },
  {
    path: '/products-list',
    element: <ProductListTable />
  },
  {
    path: '/products-details/:id',
    element: <ProductDetails />
  }
  
]);
function App() {

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
