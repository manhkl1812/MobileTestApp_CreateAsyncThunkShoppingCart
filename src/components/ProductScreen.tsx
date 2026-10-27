import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../slice/productsSlice'; // ⚠️ Kiểm tra lại đường dẫn slice
import { RootState, AppDispatch } from '../store';

export default function ProductScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Quản Lý Sản Phẩm</Text>

      <Button 
        title="+ Thêm sản phẩm mới" 
        onPress={() => dispatch(addProduct({ title: 'Áo phông mới', price: 15 }))} 
      />

      {status === 'loading' && <Text style={styles.loading}>Đang tải dữ liệu...</Text>}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.productText} numberOfLines={1}>
              {item.title} (${item.price})
            </Text>
            
            <View style={styles.btnGroup}>
              <Button 
                title="Sửa" 
                onPress={() => dispatch(updateProduct({ id: item.id, title: 'Đã sửa', price: 10 }))} 
              />
              <Button 
                title="Xóa" 
                color="red" 
                onPress={() => dispatch(deleteProduct(item.id))} 
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#ffffff' 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 16 
  },
  loading: { 
    textAlign: 'center', 
    marginVertical: 10, 
    color: 'gray' 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  productText: { 
    flex: 1, 
    fontSize: 15, 
    marginRight: 10 
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 8,
  }
});