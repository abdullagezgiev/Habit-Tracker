// В файле навигации (например, app/_layout.tsx)
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // ← Это скроет верхний заголовок
        tabBarActiveTintColor: '#4CAF50', // Цвет активной иконки
        tabBarInactiveTintColor: '#666', // Цвет неактивной иконки
        tabBarLabel: () => null, // Скрывает все подписи
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: '', // Пустая строка вместо текста
          // title: 'Главная', // Необязательно (можно скрыть)
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          headerShown: false, // Скрыть верхний заголовок
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => (
            <Ionicons name='calendar' size={24} color={color}/> 
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}