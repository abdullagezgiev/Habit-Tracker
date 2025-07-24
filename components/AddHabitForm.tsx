import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// const AddHabitForm = ({ // Компонент принимает два пропса (как аргументы функции)
//   onAdd, // Функция для добавления привычки
//   onCancel, // Функция для отмены
//   defaultTime = '10:00'
// }: { // Это описание типов для пропсов в TypeScript
//   onAdd: (title: string) => Promise<void>; // Promise<void> для onAdd: Потому что добавление привычки обычно асинхронная операция (например, запрос к API или сохранение в БД)
//   onCancel: () => void; // void для onCancel: Отмена — это простое действие, не требующее ожидания
//   defaultTime?: string;
// }) => {
//   const [title, setTitle] = useState('');
//   const [time, setTime] = useState(defaultTime); // Используем переданное значение
  
//   return (
//     <View style={styles.addForm}>
//       <TextInput
//         style={styles.input}
//         placeholder="Введите новую привычку"
//         placeholderTextColor="gray"
//         value={title}
//         onChangeText={setTitle}
//         autoFocus
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Время (HH:MM)"
//         value={time}
//         onChangeText={setTime}
//       />
//       <View style={styles.buttonRow}>
//         <TouchableOpacity
//           style={[styles.button, styles.cancelButton]}
//           onPress={onCancel}
//         >
//           <Text style={styles.buttonText}>Отмена</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.button, styles.addButton]}
//           onPress={() => onAdd(title)}
//         >
//           <Text style={styles.buttonText}>Добавить</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };
// ... (ваш текущий код)

const AddHabitForm = ({
  onAdd,
  onCancel,
  defaultTime = '10:00'
}: {
  onAdd: (title: string, time: string) => Promise<void>;
  onCancel: () => void;
  defaultTime?: string;
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(defaultTime);

  return (
    <View style={styles.addForm}>
      <TextInput
        style={styles.input}
        placeholder="Введите новую привычку"
        value={title}
        onChangeText={setTitle}
        autoFocus
      />
      <TextInput
        style={styles.input}
        placeholder="Время (HH:MM)"
        value={time}
        onChangeText={(text) => {
          // Простая валидация формата
          if (/^([0-9]|0[0-9]|1[0-9]|2[0-3]):?([0-5][0-9])?$/.test(text) || text === '') {
            setTime(text);
          }
        }}
        keyboardType="numeric"
        maxLength={5}
        onBlur={() => {
          // Добавляем ":" автоматически
          if (time.length === 2 && !time.includes(':')) {
            setTime(`${time}:`);
          }
          // Добавляем ведущий ноль
          if (time.length === 1 && time !== '0') {
            setTime(`0${time}:`);
          }
        }}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>Отмена</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={() => onAdd(title, time)}
        >
          <Text style={styles.buttonText}>Добавить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... (ваши стили)
const styles = StyleSheet.create({
  addForm: {
    padding: 16,
  },
  input: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF4D4D',
  },
  addButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddHabitForm;

// import React, { useState } from 'react';
// import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// export const AddHabitForm = ({
//   onAdd,
//   onCancel,
// }: {
//   onAdd: (title: string, time: string) => Promise<void>;
//   onCancel: () => void;
// }) => {
//   const [title, setTitle] = useState('');
//   const [time, setTime] = useState('10:00');

//   return (
//     <View style={styles.addForm}>
//       <TextInput
//         style={styles.input}
//         placeholder="Название привычки"
//         value={title}
//         onChangeText={setTitle}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Время (HH:MM)"
//         value={time}
//         onChangeText={setTime}
//       />
//       <View style={styles.buttonRow}>
//         <TouchableOpacity style={styles.button} onPress={onCancel}>
//           <Text>Отмена</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.button}
//           onPress={() => onAdd(title, time)}
//         >
//           <Text>Добавить</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
 
//   addForm: {
//     paddingHorizontal: 16,
//     paddingTop: 10,
//     paddingBottom: 20,
//     backgroundColor: '#F5F5F5',
//   },
//   input: {
//     height: 50,
//     borderColor: '#cccccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     backgroundColor: 'white',
//     marginBottom: 10,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   button: {
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     marginHorizontal: 5,
//   },
// });