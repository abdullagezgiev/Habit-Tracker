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
  console.log(`[DEBUG] Scheduling notification for habit:`, habit);
  // Валидация времени
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(habit.time)) {
    throw new Error('Неверный формат времени. Используйте HH:MM');
  }

  const [hours, minutes] = habit.time.split(':').map(Number);
  
  console.log(`[DEBUG] Parsed time - hours: ${hours}, minutes: ${minutes}`);

  if (hours > 23 || minutes > 59) {
    throw new Error('Неверное время. Часы должны быть 0-23, минуты 0-59');
  }

  // Проверяем, не прошло ли уже время сегодня
  const now = new Date();
  const notificationTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes
  );

  console.log(`[DEBUG] Current time: ${now}`);
  console.log(`[DEBUG] Notification time: ${notificationTime}`);

  // Если время уже прошло сегодня, планируем на завтра
  let trigger: Notifications.NotificationTriggerInput;
  if (notificationTime <= now) {
    console.log(`[DEBUG] Time already passed today, scheduling for tomorrow`);
    trigger = {
      hour: hours,
      minute: minutes,
      repeats: true,
      channelId: 'habits',
    };
  } else {
    console.log(`[DEBUG] Time is in the future today`);
    trigger = {
      hour: hours,
      minute: minutes,
      repeats: true,
      channelId: 'habits',
    };
  }

  console.log(`[DEBUG] Final trigger:`, trigger);

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Напоминание о привычке",
      body: `Пора выполнить: ${habit.title}`,
      sound: true,
    },
    trigger,
  });

  console.log(`[DEBUG] Notification scheduled with ID: ${notificationId}`);
  return notificationId;
};

// Удаление напоминания
export const cancelHabitNotification = async (notificationId: string) => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};