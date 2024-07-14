import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import "../index.css";

function CardProduct() {
    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        axios.get('/product.json')
            .then((response) => {
                if (response.data && response.data.products) {
                    setProducts(response.data.products);
                } else {
                    console.error("API response format is incorrect");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    if (products.length === 0) {
        return <div className="text-center text-white">No products found.</div>;
    }

    return (
        <div className="container">
            <div className="row">
                {products.map((product) => (
                    <div className="col-md-3 mb-4" key={product.id}>
                        <Card className="card-custom">
                            <Card.Img variant="top" src={`/images/${product.image}`} alt={product.name} />
                            <Card.Body>
                                <Card.Title className='text-danger mt-4 mb-3'>{product.name}</Card.Title>
                                <Card.Text>{product.description}</Card.Text>
                                <div className=''>
                                    <Card.Text className="fw-medium text-center text-muted text-decoration-line-through ">{product.price} đ</Card.Text>
                                </div>
                                <div className=''>
                                    <Card.Text className="fw-medium text-danger text-center">{product.currentPrice} đ</Card.Text>
                                </div>
                                <div className='w-100  mt-4 d-flex justify-content-center align-items-center'>
                                    <Link to={`/products-details/${product.id}`} className='btn btn-danger' >View Details</Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CardProduct;
