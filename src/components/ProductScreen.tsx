import { useEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, deleteProduct, fetchProducts, updateProduct } from '../slice/productsSlice';
import { AppDispatch, RootState } from '../store';

export default function ProductScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const handleAdd = async () => {
    const result = await dispatch(addProduct({ title: 'Áo phông mới', price: 15 }));
    if (addProduct.fulfilled.match(result)) {
      Alert.alert('Thành công', 'Đã thêm sản phẩm mới!');
    }
  };

  const handleUpdate = async (id: number) => {
    const itemToUpdate = items.find(i => i.id === id);
    if (!itemToUpdate) return;
    
    const result = await dispatch(updateProduct({ ...itemToUpdate, title: 'Đã sửa tên', price: 10 }));
    if (updateProduct.fulfilled.match(result)) {
      Alert.alert('Thành công', 'Đã cập nhật sản phẩm!');
    }
  };

  const handleDelete = async (id: number) => {
    const result = await dispatch(deleteProduct(id));
    if (deleteProduct.fulfilled.match(result)) {
      Alert.alert('Thành công', 'Đã xóa sản phẩm!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Quản Lý Sản Phẩm</Text>

      <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
        <Text style={styles.addBtnText}>+ Thêm sản phẩm mới</Text>
      </TouchableOpacity>

      {status === 'loading' && <ActivityIndicator size="large" color="#007AFF" style={{marginVertical: 20}} />}
      {status === 'failed' && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.productText} numberOfLines={1}>
              {item.title} (${item.price})
            </Text>
            
            <View style={styles.btnGroup}>
              <TouchableOpacity style={styles.editBtn} onPress={() => handleUpdate(item.id)}>
                <Text style={styles.btnText}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.delBtn} onPress={() => handleDelete(item.id)}>
                <Text style={styles.btnText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#333' },
  addBtn: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  error: { textAlign: 'center', color: 'red', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  productText: { flex: 1, fontSize: 15, marginRight: 10, color: '#333' },
  btnGroup: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#2196F3', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  delBtn: { backgroundColor: '#F44336', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '600' }
});