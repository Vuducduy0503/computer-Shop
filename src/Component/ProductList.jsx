import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import CardProduct from './CardProduct';
import {Link} from 'react-router-dom';
function ProductList(props) {
    return (
        <div className='bg-dark min-vh-100'>
            <div className='w-100 text-center text-white display-5 bold p-5 fw-medium'>
                Product List
            </div>
            <Link to="/products-list" className='w-100 d-flex justify-content-center align-items-center  text-decoration-none'>
                <button className='btn btn-danger m-5'>View Product List Table</button>
            </Link>
            <div>
                <CardProduct />
            </div>
        </div>
    );
}

export default ProductList;