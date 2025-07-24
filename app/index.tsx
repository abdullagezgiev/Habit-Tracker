import WeekCalendar from '@/components/WeekCalendar';
import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const HabitTracker = () => {
  // Инициализация уведомлений
  React.useEffect(() => {
    const setupNotifications = async () => {
      try {
         await Notifications.setNotificationHandler({
          handleNotification: async () => ({
          shouldShowAlert: true, // Показывать всплывающее окно
          shouldPlaySound: true, // Проигрывать звук
          shouldSetBadge: true, // Показывать бейдж (число на иконке)
        }) as Notifications.NotificationBehavior, // Это TypeScript, явно указывает тип для триггера.
      });

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('habits', {
          name: 'Habit reminders',
          importance: Notifications.AndroidImportance.HIGH,
          // sound: true,
        });
      }
      } catch (error) {
        console.error('Ошибка настройки уведомлений:', error);
      }
    };

    setupNotifications();
  }, []);
  const [habits, setHabits] = useState<Array<{id: string, name: string, notificationId: string | null}>>([]);
  const [newHabit, setNewHabit] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [newHabitTime, setNewHabitTime] = useState('10:00');

  // Функция добавления привычки
  const addHabit = async () => {
    if (!newHabit.trim()) {
      Alert.alert('Ошибка', 'Введите название привычки');
      return;
    }
    
    try {
      const newHabitData = {
        id: Math.random().toString(36).substr(2, 9),
        name: newHabit.trim(),
        notificationId: null as string | null,
      };

      // Планируем уведомление
      newHabitData.notificationId = await scheduleHabitNotification(newHabitData.name) as string;
      
      setHabits([...habits, newHabitData]);
      setNewHabit('');
      setIsAdding(false);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить привычку');
    }
  };

  // Подтверждение удаления
  const confirmDelete = (id: string) => {
    setHabitToDelete(id);
    Alert.alert(
      'Удаление привычки',
      'Вы уверены, что хотите удалить эту привычку?',
      [
        {
          text: 'Отмена',
          onPress: () => setHabitToDelete(null),
          style: 'cancel',
        },
        {
          text: 'Удалить',
          onPress: () => deleteHabit(id),
          style: 'destructive',
        },
      ],
    );
  };

  // Функция удаления привычки
  // const deleteHabit = async (idToDelete: string) => {
  //   try {
  //     const habit = habits.find(h => h.id === idToDelete);
      
  //     if (habit?.notificationId) {
  //       await cancelHabitNotification(habit.notificationId);
  //     }

  //     setHabits(habits.filter(h => h.id !== idToDelete));
  //     setHabitToDelete(null);
  //   } catch (error) {
  //     Alert.alert('Ошибка', 'Не удалось удалить привычку');
  //   }
  // };
const deleteHabit = async (idToDelete: string) => {
  try {
    const habit = habits.find(h => h.id === idToDelete);
    
    if (habit?.notificationId) {
      await cancelHabitNotification(habit.notificationId);
    }

    setHabits(prev => prev.filter(h => h.id !== idToDelete));
    setHabitToDelete(null); /*  Сброс habitToDelete. Чтобы окно подтверждения не «зависло».
    Теперь состояние полностью «чистое», и Alert будет работать корректно для следующих действий.*/
  } catch (error) {
    Alert.alert('Ошибка', 'Не удалось удалить привычку');
  }
};

  /* ЗАПОМНИ! Это обычная практика при разработке: когда функция еще не релизована, но 
  ее нужно вызвать или она нужна для структуры кода, ставят такую заглушку. Она напоминает,
  что эту функцию нужно дописать.*/
  function handleWeekChange(newDate: Date): void {
    // throw new Error('Function not implemented.');
  }

  // Добавим эти функции перед return
  //   const scheduleHabitNotification = async (name: string): Promise<string> => {
  //   const trigger = { hour: 12, minute: 0, repeats: true};

  //   const notificationId = await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "Напоминание",
  //       body: `Пора выполнить: ${name}`,
  //       sound: true,
  //     },
  //     trigger,
  //   });
  //   return notificationId;
  // }
const scheduleHabitNotification = async (habitName: string) => {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Напоминание о привычке",
      body: `Пора выполнить: ${habitName}`,
      sound: true,
    },
    trigger: {
      // hour: 10, // Можно сделать настраиваемым
      hour: parseInt(newHabitTime.split(':')[0]),
      minute: parseInt(newHabitTime.split(':')[1]),
      repeats: true,
    } as Notifications.CalendarTriggerInput, // Это TypeScript, явно указывает тип для триггера.
  });
  console.log('Notification ID type:', typeof notificationId);
  return notificationId;
};

const cancelHabitNotification = async (notificationId: string) => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

  return (
    <ScrollView style={styles.container}>

       <View style={styles.header}>
        <Text style={styles.periodText}>All ▼</Text>
        <Text style={styles.todayText}>Today</Text>
        {/* Placeholder для иконки в правом верхнем углу, если она есть */}
        <View style={{ width: 24, height: 24 }} />
       </View>

       <WeekCalendar onWeekChange={handleWeekChange} />
      {/* Список привычек */}
      {habits.map(habit => (
        <View key={habit.id} style={styles.habitItem}>
          <Text style={styles.habitText}>{habit.name}</Text>
          <TouchableOpacity 
            onPress={() => confirmDelete(habit.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Форма добавления новой привычки */}
      {isAdding ? (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            value={newHabit}
            onChangeText={setNewHabit}
            placeholder="Название привычки"
            autoFocus
          />

          <TextInput
            style={styles.input}
            value={newHabitTime}
            onChangeText={setNewHabitTime}
            placeholder="Время (HH:MM)"
            keyboardType="numeric"
          />


          <TouchableOpacity 
            style={styles.addButton}
            onPress={addHabit}
          >
            <Text style={styles.addButtonText}>Добавить</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.newHabitButton}
          onPress={() => setIsAdding(true)} // Нажимает на кнопку → setIsAdding(true) → форма появляется.
        >
          <Text style={styles.newHabitButtonText}>+ Новая привычка</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    paddingTop: 50, // Для отступа от верхнего края экрана
  },
  periodText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  todayText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  habitText: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 18,
    color: 'red',
  },
  addForm: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  newHabitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  newHabitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
export default HabitTracker;
// function cancelHabitNotification(notificationId: number) {
//   throw new Error('Function not implemented.');
// }