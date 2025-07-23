import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HabitItem = ({
  title,
  progress,
  time,
  onDelete,
}: {
  title: string;
  progress?: string;
  time?: string;
  onDelete: () => void;
}) => (
  <View style={styles.habitItem}>
    <View>
      <Text style={styles.habitTitle}>{title}</Text>
      {time && <Text style={styles.timeText}>{time}</Text>}
      {progress && <Text style={styles.progressText}>{progress}</Text>}
    </View>
    <TouchableOpacity onPress={onDelete}>
      <Text style={styles.deleteButton}>✕</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  
  
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  habitTitle: {
    fontSize: 16,
    flex: 1, // Позволяет заголовку занимать максимум места
  },
  timeText: {},
  progressText: {},  
  habitProgress: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 10, // Отступ от заголовка
  },
  deleteButton: {
    color: '#FF6347', // Томный оранжевый/красный
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 15, // Отступ от текста привычки
  },
  
});

export default HabitItem;