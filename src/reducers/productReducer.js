const initialState = {
    products: []
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PRODUCTS':
            return {
                ...state,
                products: action.payload
            };
        case 'ADD_PRODUCT':
            return {
                ...state,
                products: [...state.products, action.payload]
            };
        case 'EDIT_PRODUCT':
            return {
                ...state,
                products: state.products.map(product =>
                    product.id === action.payload.id ? action.payload : product
                )
            };
        case 'DELETE_PRODUCT':
            //Hành động này xóa một sản phẩm khỏi danh sách. Nó sử dụng filter() để lọc ra các sản phẩm mà id không trùng khớp với action.payload.
            return {
                ...state,
                products: state.products.filter(product => product.id !== action.payload)
            };
        default:
            return state;
    }
};

export default productReducer;
