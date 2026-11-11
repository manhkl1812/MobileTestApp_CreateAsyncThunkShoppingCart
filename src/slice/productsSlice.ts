import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  title: string; 
  price: number;
  description?: string;
  category?: string;
  image?: string;
}

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const API_URL = 'https://fakestoreapi.com/products';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Lỗi tải dữ liệu');
  return (await response.json()) as Product[];
});

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (newProduct: Omit<Product, 'id'>) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    if (!response.ok) throw new Error('Lỗi thêm sản phẩm');
    return (await response.json()) as Product;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product: Product) => {
    const response = await fetch(`${API_URL}/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Lỗi cập nhật');
    return (await response.json()) as Product;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Lỗi xóa');
    return id; 
  }
);

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Lỗi tải dữ liệu';
      })
      // ADD
      .addCase(addProduct.fulfilled, (state, action) => {
        // fakestoreapi trả về id mới, ta đẩy vào đầu danh sách cho dễ thấy
        state.items.unshift(action.payload);
      })
      // UPDATE
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      // DELETE
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;