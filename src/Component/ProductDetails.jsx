import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function removeDot(value) {
    if (typeof value !== 'string') {
        return value; // Trả về nguyên giá trị nếu không phải là chuỗi
    }
    return value.replace(/\./g, ''); // Loại bỏ dấu chấm từ chuỗi và trả về kết quả
}

function ProductDetails() {
    const { id } = useParams(); // Lấy id từ URL sử dụng useParams hook
    const [product, setProduct] = useState(null); // State để lưu thông tin sản phẩm
    const [showEditModal, setShowEditModal] = useState(false); // State để hiển thị modal chỉnh sửa
    const [newProduct, setNewProduct] = useState({
        id: '',
        name: '',
        description: '',
        currentPrice: '',
        price: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('/product.json')
            .then((response) => {
                if (response.data && response.data.products) {
                    // Tìm sản phẩm có id tương ứng trong danh sách sản phẩm từ API
                    const foundProduct = response.data.products.find(p => p.id === id);
                    if (foundProduct) {
                        setProduct(foundProduct); // Cập nhật thông tin sản phẩm nếu tìm thấy
                    } else {
                        console.error(`Product with ID ${id} not found.`);
                    }
                } else {
                    console.error("API response format is incorrect");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]); // Phụ thuộc vào id để fetch dữ liệu khi id thay đổi

    const handleShowEditModal = () => {
        // Kiểm tra xem product có tồn tại và product.image có tồn tại để xử lý đường dẫn hình ảnh
        const imagePath = (product && product.image) ? `/images/${product.image}` : '';
    
        // Cập nhật newProduct với thông tin sản phẩm hiện tại
        setNewProduct({
            id: product.id,
            image: imagePath, // Chắc chắn rằng image được cập nhật đúng đường dẫn
            name: product.name,
            description: product.description,
            currentPrice: removeDot(product.currentPrice.toString()), // Loại bỏ dấu chấm
            price: removeDot(product.price.toString()) // Loại bỏ dấu chấm
        });
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setNewProduct({
            id: '',
            name: '',
            description: '',
            currentPrice: '',
            price: ''
        });
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditProduct = () => {
    if (!newProduct.name || !newProduct.description || !isValidPrice(newProduct.currentPrice) || !isValidPrice(newProduct.price)) {
        setError('Please fill in all fields with valid numbers');
        return;
    }

    const updatedProduct = {
        ...product, // Keep other properties unchanged
        name: newProduct.name,
        description: newProduct.description,
        currentPrice: parseFloat(removeDot(newProduct.currentPrice)), // Convert to number
        price: parseFloat(removeDot(newProduct.price)) // Convert to number
    };

    setProduct(updatedProduct); // Update the product state with edited data

    setShowEditModal(false);
    setNewProduct({
        id: '',
        name: '',
        description: '',
        currentPrice: '',
        price: ''
    });
    setError('');
};

    

    const isValidPrice = (value) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
    };

    function calculateDiscount(currentPrice, price) {
        const parsedCurrentPrice = parseFloat(removeDot(currentPrice));
        const parsedPrice = parseFloat(removeDot(price));
        const discount = ((parsedPrice - parsedCurrentPrice) / parsedPrice) * 100;
        return discount.toFixed(2); // Giới hạn đến 2 chữ số thập phân
    }

    if (!product) {
        return <div className="text-center text-white">Loading...</div>;
    }

    return (
        <div className='bg-dark min-vh-100'>
            <Container className="py-5">
                <Row>
                    <Col md={6}>
                        <Card>
                            <Card.Img variant="top" src={`/images/${product.image}`} alt={product.name} />
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card>
                            <Card.Body className='p-5'>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>{product.description}</Card.Text>
                                <Card.Text>Current Price: {formatCurrency(product.currentPrice)}</Card.Text>
                                <Card.Text>Price: {formatCurrency(product.price)}</Card.Text>
                                <Card.Text>Discount: {calculateDiscount(product.currentPrice, product.price)}%</Card.Text>
                                <Link to="/" className="btn btn-danger m-2">Back Home</Link>
                                <Button variant="warning" onClick={handleShowEditModal}>Edit</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Edit Product Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formProductName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter product name" name="name" value={newProduct.name} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formProductDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Enter product description" name="description" value={newProduct.description} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formProductCurrentPrice">
                            <Form.Label>Current Price</Form.Label>
                            <Form.Control type="text" placeholder="Enter current price" name="currentPrice" value={newProduct.currentPrice} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formProductPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="text" placeholder="Enter price" name="price" value={newProduct.price} onChange={handleChange} />
                        </Form.Group>
                        {error && <p className="text-danger">{error}</p>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditProduct}>
                        Edit Product
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ProductDetails;
