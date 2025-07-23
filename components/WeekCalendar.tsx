import React, { useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

// Функция для получения дней недели
const getWeekDays = (date: Date) => {
  const days = [];
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  
  // Находим понедельник текущей недели
  const monday = new Date(date);
  monday.setDate(date.getDate() - (date.getDay() || 7) + 1);
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    days.push({
      name: dayNames[day.getDay()],
      date: day.getDate(),
      fullDate: day
    });
  }
  return days;
};

interface WeekCalendarProps {
  onWeekChange?: (newDate: Date) => void;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({ onWeekChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeekDays(new Date()));
  const panX = useRef(new Animated.Value(0)).current;

  const handleSwipe = (direction: 'left' | 'right') => {

  setTimeout(() => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'left' ? 7 : -7));
    setCurrentDate(newDate);
    setCurrentWeek(getWeekDays(newDate));
    onWeekChange?.(newDate);
  }, 150); // Совпадает с длительностью анимации
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      panX.setValue(gestureState.dx); // Следим за движением пальца
    },
    // Вариант 1
    // onPanResponderRelease: (_, gestureState) => {
    //   if (Math.abs(gestureState.dx) > width / 4) {
    //     handleSwipe(gestureState.dx > 0 ? 'right' : 'left');
    //   }

    //   Animated.spring(panX, {
    //     toValue: 0,
    //     //stiffness: 400,  // Настраиваем жёсткость
    //     //damping: 15,     // Настраиваем затухание
    //     stiffness: 250,
    //     damping: 10,
    //     useNativeDriver: true,
    //   }).start();

    // },

    // Вариант 2
    // onPanResponderRelease: (_, gestureState) => {
    //   if (Math.abs(gestureState.dx) > width / 4) {
    //   const direction = gestureState.dx > 0 ? 'right' : 'left';
    
    // // Сначала завершаем текущую анимацию
    // panX.stopAnimation(() => {
    //   // Затем меняем неделю
    //   handleSwipe(direction);
      
    //   // И только потом запускаем возврат
    //       Animated.spring(panX, {
    //           toValue: 0,
    //           stiffness: 250,
    //           damping: 10, 
    //           useNativeDriver: true,
    //         }).start();
    //       });
    //     } else {
    //     // Просто возвращаем на место если свайп слабый
    //     Animated.spring(panX, {
    //       toValue: 0,
    //       useNativeDriver: true,
    //     }).start();
    //   }
    // }

    // Вариант 3
    onPanResponderRelease: (_, gestureState) => {
      // Уменьшаем порог срабатывания
      if (Math.abs(gestureState.dx) > 50) {// Было width/4 (примерно 100px), стало 50px
        const direction = gestureState.dx > 0 ? 'right' : 'left';
        handleSwipe(direction);

        // Добавляем анимацию "перепрывагивания" на новую неделю
        Animated.timing(panX, {
          toValue: direction === 'right' ? width : -width,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          panX.setValue(0) // Сброс после анимации 
        });
      } else {
        // Если свайп слабый - возвращаем на место
        Animated.spring(panX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateX: panX }],
        }}
        {...panResponder.panHandlers}
      >
        <View style={styles.weekRow}>
          {currentWeek.map((day) => (
            <View key={`${day.date}-${day.name}`} style={[
              styles.dayCell,
              day.fullDate.toDateString() === new Date().toDateString() && styles.currentDayCell
              ]} >
              <Text style={styles.dayName}>{day.name}</Text>
              <Text style={styles.dayDate}>{day.date}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dayCell: {
    alignItems: 'center',
    width: 40,
  },
  currentDayCell: { // Добавляем отдельный стиль для текущего дня
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  dayName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dayDate: {
    fontSize: 16,
  },
});

export default WeekCalendar;

// import React, { useRef, useState } from 'react';
// import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';

// const { width } = Dimensions.get('window');

// // 1. Переносим getWeekDays ВПЕРЁД всех функций, которые её используют
// const getWeekDays = (date: Date) => {
//   const days = [];
//   const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  
//   for (let i = 0; i < 7; i++) {
//     const day = new Date(date);
//     day.setDate(date.getDate() - date.getDay() + i + 1);
//     days.push({
//       name: dayNames[day.getDay()],
//       date: day.getDate(),
//       fullDate: day
//     });
//   }
//   return days;
// };

// interface WeekCalendarProps {
//   onWeekChange?: (newDate: Date) => void;
// }

// const WeekCalendar: React.FC<WeekCalendarProps> = ({ onWeekChange }) => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const panX = useRef(new Animated.Value(0)).current;
  
//   // 2. Теперь getWeeks может использовать getWeekDays
//   const getWeeks = (centerDate: Date) => {
//     return {
//       prev: getWeekDays(new Date(centerDate.getTime() - 7 * 24 * 60 * 60 * 1000)),
//       current: getWeekDays(centerDate),
//       next: getWeekDays(new Date(centerDate.getTime() + 7 * 24 * 60 * 60 * 1000)),
//     };
//   };

//   const [weeks, setWeeks] = useState(getWeeks(currentDate));

//   // ... остальной код без изменений
//   const panResponder = PanResponder.create({
//     // ...
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderMove: (_, gestureState) => {
//       panX.setValue(gestureState.dx);
//     },
//     onPanResponderRelease: (_, gestureState) => {
//       if (Math.abs(gestureState.dx) > width / 4) {
//         const direction = gestureState.dx > 0 ? -1 : 1;
//         const newDate = new Date(currentDate);
//         newDate.setDate(newDate.getDate() + direction * 7);
        
//         setCurrentDate(newDate);
//         setWeeks(getWeeks(newDate));
//         onWeekChange?.(newDate);
//       }
      
//       Animated.spring(panX, {
//         toValue: 0,
//         useNativeDriver: true,
//       }).start();
//     },
//   });

//   return (
//     // ... JSX без изменений
//     <View style={styles.container}>
//        <Animated.View
//         style={{
//           flexDirection: 'row',
//           transform: [{ translateX: panX }],
//         }}
//         {...panResponder.panHandlers}
//       >
//         {/* Предыдущая неделя (слева) */}
//         <View style={styles.weekContainer}>
//           {weeks.prev.map((day) => (
//             <DayCell key={`prev-${day.date}`} day={day} isCurrent={false} />
//           ))}
//         </View>

//         {/* Текущая неделя (по центру) */}
//         <View style={styles.weekContainer}>
//           {weeks.current.map((day) => (
//             <DayCell key={`current-${day.date}`} day={day} isCurrent={true} />
//           ))}
//         </View>

//         {/* Следующая неделя (справа) */}
//         <View style={styles.weekContainer}>
//           {weeks.next.map((day) => (
//             <DayCell key={`next-${day.date}`} day={day} isCurrent={false} />
//           ))}
//         </View>
//       </Animated.View>
//     </View>
//   );
// };

// const DayCell = ({ day, isCurrent }: { day: any; isCurrent: boolean }) => (
//   // ... без изменений
//   <View style={[
//     styles.dayCell, 
//     isCurrent && styles.currentDayCell
//   ]}>
//     <Text style={styles.dayName}>{day.name}</Text>
//     <Text style={styles.dayDate}>{day.date}</Text>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     height: 80,
//     overflow: 'hidden',
//   },
//   weekContainer: {
//     width: Dimensions.get('window').width,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   dayCell: {
//     alignItems: 'center',
//     width: 40,
//     opacity: 0.6,
//   },
//   currentDayCell: {
//     opacity: 1,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     paddingVertical: 8,
//   },
//   dayName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   dayDate: {
//     fontSize: 16,
//   },
// });

// export default WeekCalendar;
