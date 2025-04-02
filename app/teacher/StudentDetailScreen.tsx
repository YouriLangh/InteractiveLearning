import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';

const { width } = Dimensions.get('window');

const data = {
  name: 'John Doe',
  avatarColor: '#2E2B5F',
  chapters: [
    {
      title: 'Chapter 1: Addition 8/8',
      exercises: [
        { title: 'Exercise 1: Success', attempts: [false, false, false, true], hints: 3 },
        { title: 'Exercise 2: Success', attempts: [false, true], hints: 1 },
        { title: 'Exercise 3: Fail', attempts: [false, false, false], hints: 2 },
      ],
    },
    {
      title: 'Chapter 2: Deduction 7/7',
      exercises: [
        { title: 'Exercise 1: Success', attempts: [false, false, true], hints: 2 },
        { title: 'Exercise 2: Success', attempts: [false, true], hints: 1 },
        { title: 'Exercise 3: Fail', attempts: [false, false, false], hints: 3 },
      ],
    },
  ],
};

export default function StudentDetailScreen() {
  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topRow}>
          <View style={[styles.avatar, { backgroundColor: data.avatarColor }]} />
          <Text style={styles.name}>{data.name}</Text>
          <TouchableOpacity style={styles.printButton}>
            <Text style={styles.printText}>Print Report</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reportBox}>
          {data.chapters.map((chapter, cIndex) => (
            <View key={cIndex} style={styles.chapterBox}>
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              {chapter.exercises.map((ex, eIndex) => (
                <View key={eIndex} style={styles.exerciseRow}>
                  <Text style={styles.exerciseTitle}>{ex.title}</Text>
                  <View style={styles.attemptsBox}>
                    {ex.attempts.map((a, i) => (
                      <Text key={i} style={{ color: a ? 'green' : 'red', fontSize: 18 }}>
                        {a ? '✓' : '✕'}
                      </Text>
                    ))}
                  </View>
                  <Text style={styles.hintText}>Number of hints used: {ex.hints}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  name: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  printButton: {
    backgroundColor: '#A4C8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  printText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reportBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  chapterBox: {
    marginBottom: 18,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseRow: {
    marginBottom: 10,
  },
  exerciseTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  attemptsBox: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  hintText: {
    fontSize: 14,
  },
});
