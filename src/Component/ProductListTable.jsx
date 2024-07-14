import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, addProduct, editProduct, deleteProduct } from '../actions/productActions';
import { Link } from 'react-router-dom';

function ProductListTable() {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.product.products);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        id: '',
        name: '',
        description: '',
        currentPrice: '',
        price: ''
    });
    const [editProductId, setEditProductId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('/product.json')
            .then((response) => {
                if (response.data && response.data.products) {
                    const productsFormatted = response.data.products.map((product, index) => ({
                        ...product,
                        id: index + 1, // Assuming index starts from 0, adjust accordingly if it starts from 1
                        currentPrice: removeDot(product.currentPrice.toString()),
                        price: removeDot(product.price.toString())
                    }));
                    dispatch(setProducts(productsFormatted));
                } else {
                    console.error("API response format is incorrect");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [dispatch]);

    const handleDelete = (id) => {
        return () => {
            if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
                return;
            }

            dispatch(deleteProduct(id));

            // Update IDs after deletion
            const updatedProducts = products.filter(product => product.id !== id).map((product, index) => ({
                ...product,
                id: index + 1
            }));

            dispatch(setProducts(updatedProducts));
        };
    };

    const handleShowAddModal = () => {
        setShowAddModal(true);
        setNewProduct({
            id: products.length + 1,
            name: '',
            description: '',
            currentPrice: '',
            price: ''
        });
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setNewProduct({
            id: '',
            name: '',
            description: '',
            currentPrice: '',
            price: ''
        });
        setError('');
    };

    const handleShowEditModal = (id) => {
        const productToEdit = products.find(product => product.id === id);
        if (productToEdit) {
            setEditProductId(id);
            setNewProduct({
                id: productToEdit.id,
                name: productToEdit.name,
                description: productToEdit.description,
                currentPrice: productToEdit.currentPrice.toString(),
                price: productToEdit.price.toString()
            });
            setShowEditModal(true);
        }
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditProductId(null);
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

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.description || !isValidPrice(newProduct.currentPrice) || !isValidPrice(newProduct.price)) {
            setError('Vui lòng điền đầy đủ các trường với số hợp lệ');
            return;
        }

        const productToAdd = {
            id: newProduct.id,
            name: newProduct.name,
            description: newProduct.description,
            currentPrice: parseFloat(newProduct.currentPrice),
            price: parseFloat(newProduct.price)
        };

        dispatch(addProduct(productToAdd));
        setShowAddModal(false);
        setNewProduct({
            id: '',
            name: '',
            description: '',
            currentPrice: '',
            price: ''
        });
        setError('');
    };

    const handleEditProduct = () => {
        if (!newProduct.name || !newProduct.description || !isValidPrice(newProduct.currentPrice) || !isValidPrice(newProduct.price)) {
            setError('Vui lòng điền đầy đủ các trường với số hợp lệ');
            return;
        }

        const updatedProduct = {
            id: editProductId,
            name: newProduct.name,
            description: newProduct.description,
            currentPrice: parseFloat(newProduct.currentPrice),
            price: parseFloat(newProduct.price)
        };

        dispatch(editProduct(updatedProduct));
        setShowEditModal(false);
        setEditProductId(null);
        setNewProduct({
            id: '',
            name: '',
            description: '',
            currentPrice: '',
            price: ''
        });
        setError('');
    };

    const isValidPrice = (price) => {
        return /^\d+(\.\d{1,2})?$/.test(price);
    };

    const removeDot = (value) => {
        return value.replace(/\./g, '');
    };

    const formatCurrency = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <div className=" bg-dark min-vh-100">
            <div className="row">
                <div className="col-12 d-flex justify-content-center align-items-center mb-4">
                    <h1 className='text-white'>Product List</h1>
                </div>
            </div>
            <div className="row m-2">
                <div className='col-6 d-flex justify-content-start align-items-center mt-3 mb-3'>
                    <button className="btn btn-warning" onClick={handleShowAddModal}>Add product</button>
                </div>
                <div className='col-6 d-flex justify-content-end align-items-center mt-3 mb-3'>
                    <Link to="/" className="btn btn-danger" >Home</Link>
                </div>
                <div className="col-12">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>PriceCurrent</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{formatCurrency(product.currentPrice)}</td>
                                    <td>{formatCurrency(product.price)}</td>
                                    <td>
                                        <div className='w-100 d-flex justify-content-center align-items-center'>
                                            <button className="btn btn-danger" onClick={handleDelete(product.id)}>Xóa</button>
                                        </div>
                                        <div className='w-100 d-flex justify-content-center align-items-center mt-2'>
                                            <button className="btn btn-warning" onClick={() => handleShowEditModal(product.id)}>Sửa</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Thêm Sản Phẩm */}
            <Modal show={showAddModal} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formProductName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Nhập Name sản phẩm" name="name" value={newProduct.name} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formProductDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Nhập Description sản phẩm" name="description" value={newProduct.description} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formProductCurrentPrice">
                            <Form.Label>PriceCurrent</Form.Label>
                            <Form.Control type="text" placeholder="Nhập PriceCurrent" name="currentPrice" value={newProduct.currentPrice} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formProductPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="text" placeholder="Nhập Price" name="price" value={newProduct.price} onChange={handleChange} />
                        </Form.Group>
                        {error && <p className="text-danger">{error}</p>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddProduct}>
                        Thêm sản phẩm
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Sửa Sản Phẩm */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formProductName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Nhập Name sản phẩm" name="name" value={newProduct.name} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formProductDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Nhập Description sản phẩm" name="description" value={newProduct.description} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formProductCurrentPrice">
                            <Form.Label>PriceCurrent</Form.Label>
                            <Form.Control type="text" placeholder="Nhập PriceCurrent" name="currentPrice" value={newProduct.currentPrice} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formProductPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="text" placeholder="Nhập Price" name="price" value={newProduct.price} onChange={handleChange} />
                        </Form.Group>
                        {error && <p className="text-danger">{error}</p>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleEditProduct}>
                        Sửa sản phẩm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ProductListTable;
