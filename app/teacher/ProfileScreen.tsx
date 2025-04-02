import React from 'react';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';

const { width } = Dimensions.get('window');

const students = [
  { name: 'John Doe' },
  { name: 'Jane Doe' },
  { name: 'Person X' },
  { name: 'Person X' },
  { name: 'Person X' },
  { name: 'Person X' },
  { name: 'Person X' },
  { name: 'Person X' },
  { name: 'Person X' },
];

export default function ProfileScreen() {
    const router = useRouter(); 
  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Dashboard</Text>
          <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/teacher/CreateExerciseScreen')}>
                <Text style={styles.addButtonText}>Add Exercise</Text>
        </TouchableOpacity>
        </View>

                <View style={styles.grid}>
        {students.map((student, index) => (
            <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push('/teacher/StudentDetailScreen')}
            >
            <View style={styles.avatar} />
            <View style={styles.infoText}>
                <Text style={styles.name}>{student.name}</Text>
                <Text style={styles.label}>Exercise</Text>
                <Text style={styles.label}>Success Rate</Text>
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
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    backgroundColor: '#A4C8F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#B0D9FF',
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 60,
    backgroundColor: '#2E2B5F',
    borderRadius: 4,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  label: {
    fontSize: 14,
    color: 'black',
  },
});