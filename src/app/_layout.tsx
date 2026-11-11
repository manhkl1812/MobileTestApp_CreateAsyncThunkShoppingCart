import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../store'; // Đảm bảo đường dẫn này trỏ đúng tới file store.ts

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </Provider>
  );
}