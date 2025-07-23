import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Настройка уведомлений
export const setupNotifications = async () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    } as Notifications.NotificationBehavior),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('habits', {
      name: 'Habit reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'true',
    });
  }
};

// Запрос разрешений
export const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Создание напоминания
// export const scheduleHabitNotification = async (habit: {
//   id: string;
//   title: string;
//   time: string;
// }) => {
//   const [hours, minutes] = habit.time.split(':').map(Number);
  
//   return await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Напоминание о привычке",
//       body: `Пора выполнить: ${habit.title}`,
//       sound: true,
//     },
//     trigger: {
//       hour: hours,
//       minute: minutes,
//       repeats: true
//     } as Notifications.CalendarTriggerInput
//   });
// };
export const scheduleHabitNotification = async (habit: {
  id: string;
  title: string;
  time: string;
}) => {
  // Валидация времени
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(habit.time)) {
    throw new Error('Неверный формат времени. Используйте HH:MM');
  }

  const [hours, minutes] = habit.time.split(':').map(Number);
  
  if (hours > 23 || minutes > 59) {
    throw new Error('Неверное время. Часы должны быть 0-23, минуты 0-59');
  }

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: "Напоминание о привычке",
      body: `Пора выполнить: ${habit.title}`,
      sound: true,
    },
    trigger: {
      hour: hours,
      minute: minutes,
      repeats: true
    } as Notifications.CalendarTriggerInput
  });
};

// Удаление напоминания
export const cancelHabitNotification = async (notificationId: string) => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};