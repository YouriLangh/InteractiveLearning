import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';

const { width } = Dimensions.get('window');

export default function CreateExerciseScreen() {
  const [title, setTitle] = useState('');
  const [chapter, setChapter] = useState('CHAPTER 3');
  const [exercise, setExercise] = useState('X');
  const [visibleTo, setVisibleTo] = useState('ALL');
  const [difficulty, setDifficulty] = useState(3);

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Create an exercise</Text>

        <View style={styles.formBox}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title:</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="ENTER TITLE" placeholderTextColor="#ccc" />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Chapter:</Text>
            <TouchableOpacity style={styles.select}>
              <Text style={styles.selectText}>{chapter}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Exercise:</Text>
            <Text style={styles.input}>{exercise}</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>DIFFICULTY:</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map(i => (
                <TouchableOpacity key={i} onPress={() => setDifficulty(i)}>
                  <Text style={styles.star}>{i <= difficulty ? '★' : '☆'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Visible to:</Text>
            <TouchableOpacity style={styles.select}>
              <Text style={styles.selectText}>{visibleTo}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelText}>✖ Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createText}>＋ Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
    textAlign: 'center',
  },
  formBox: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#00000000',
    borderRadius: 12,
    padding: 10,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    color: 'white',
    fontSize: 16,
    backgroundColor: '#ffffff20',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  select: {
    backgroundColor: '#A4C8F0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  selectText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    fontSize: 20,
    color: '#FFD700',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#90CAF9',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  createText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
