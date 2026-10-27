import React from 'react';
import { Provider } from 'react-redux';
import store from '../store'; 
import ProductScreen from '../components/ProductScreen';

export default function Page() {
  return (
    <Provider store={store}>
      <ProductScreen />
    </Provider>
  );
}