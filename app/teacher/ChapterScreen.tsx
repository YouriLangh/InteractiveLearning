import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';

/* ====== Types ====== */
interface Exercise {
  id: number;
  title: string;
}

interface Chapter {
  id: number;
  title: string;
  color: string;
  exercises: Exercise[];
}

/* ====== Dummy Data ====== */
const chaptersData: Chapter[] = [
  {
    id: 1,
    title: 'Numbers',
    color: '#A7F7B1', 
    exercises: [
      { id: 101, title: 'Make the number 21 using blocks.' },
      { id: 102, title: 'Make the number 35 using blocks.' },
      { id: 103, title: 'Make the number 215 using blocks.' },
    ],
  },
  {
    id: 2,
    title: 'Addition',
    color: '#FFD399', 
    exercises: [
      { id: 201, title: 'Use blocks to solve 2 + 15.' },
      { id: 202, title: 'Some other addition exercise.' },
      { id: 203, title: 'And another one.' },
      { id: 204, title: 'You get the idea.' },
      { id: 205, title: 'One more example.' },
      { id: 206, title: 'Yet another example.' },
      { id: 207, title: 'Add a bunch of blocks.' },
      { id: 208, title: 'Final addition test.' },
    ],
  },
];

export default function ChapterScreen() {
 const router = useRouter(); 
    
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [chapters, setChapters] = useState<Chapter[]>(chaptersData);

  const [activeTab, setActiveTab] = useState('chapters');

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
      <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => router.push('/teacher/ProfileScreen')}>
        <Text style={[styles.header, activeTab === 'students' && styles.active]}>
          Students
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/teacher/ChapterScreen')}>
        <Text style={[styles.header, activeTab === 'chapters' && styles.active]}>
          Chapters
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addChapterButton} onPress={() => router.push('/teacher/CreateExerciseScreen')}>
            <Text style={styles.addChapterText}>+ Add chapter</Text>
          </TouchableOpacity>

    </View>


        {/* Chapters List */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
        >
          {chapters.map((chapter, index) => (
            <View
              key={chapter.id}
              style={[
                styles.chapterContainer,
                { backgroundColor: chapter.color || '#F0F0F0' },
              ]}
            >

              <View style={styles.chapterHeader}>
                <Text style={styles.chapterTitle}>
                  {`Chapter ${index + 1}: ${chapter.title} (${chapter.exercises.length})`}
                </Text>
                <TouchableOpacity
                  style={styles.addExerciseButton}
                 
                >
                  <Text style={styles.addExerciseText}>+ Add exercise</Text>
                </TouchableOpacity>
              </View>

              {/* Exercises */}
              {chapter.exercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <Text style={styles.exerciseText}>{exercise.title}</Text>
                  <TouchableOpacity
                    style={styles.editButton}
                  >
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#555',
  },
  active: {
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },


  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  navItem: {
    marginRight: 16,
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  inactiveTab: {
    color: '#888',
  },
  addChapterButton: {
    marginLeft: 'auto',
    marginRight: "2%",
    backgroundColor: '#487D33', 
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addChapterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },

  scrollArea: {
    flex: 1,
    marginTop: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  chapterContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 10,
    padding: 16,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chapterTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addExerciseButton: {
    backgroundColor: '#E88B43', 
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addExerciseText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },

  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 1,
  },
  exerciseText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  editButton: {
    marginLeft: 8,
  },
  editIcon: {
    fontSize: 18,
  },
});
