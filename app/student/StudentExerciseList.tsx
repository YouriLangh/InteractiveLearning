import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import { useRouter } from 'expo-router';
import ReturnButton from '@/app/components/ui/ReturnButton';


const categories = [
  {
    title: 'ADDITION',
    color: '#FF6E6B',
    exercises: ['1 + 1', '2 + 3', '5 + 6'],
  },
  {
    title: 'SUBTRACTION',
    color: '#FF8754',
    exercises: ['4 - 1', '3 - 1', '5 - 2'],
  },
];

export default function StudentExerciseList() {
  const router = useRouter();

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.cardGrid}>
            <ReturnButton />
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: cat.color }]}
              onPress={() => router.push('/student/StudentLearnScreen')}
            >
              <Text style={styles.cardTitle}>{cat.title}</Text>
              <View style={styles.exerciseList}>
                {cat.exercises.map((ex, i) => (
                  <Text key={i} style={styles.exercise}>{ex}</Text>
                ))}
              </View>
            </TouchableOpacity>
          ))}
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
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
  },
  card: {
    borderRadius: 10,
    padding: 20,
    width: '85%',
    maxWidth: 420,
    aspectRatio: 1.3,
    margin: 10,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  exerciseList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  exercise: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    width: '48%',
    textAlign: 'center',
    marginBottom: 10,
  },
});
