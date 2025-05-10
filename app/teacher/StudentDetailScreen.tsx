import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import ReturnButton from '@/app/components/ui/ReturnButton';
import api from '@/services/api';

const { width } = Dimensions.get('window');

export default function StudentDetailScreen() {
  const router = useRouter();
  const { studentId, studentName } = useLocalSearchParams();
  const studentIdStr = Array.isArray(studentId) ? studentId[0] : studentId;
  const [activeTab, setActiveTab] = useState('students');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchStudentProgress = async () => {
      if (!studentIdStr) return;

      try {
        const response = await api.get(`/progress/${studentIdStr}`);
        setData(response.data);

        // Default expand all chapters
        const expandedMap: { [key: number]: boolean } = {};
        response.data.chapters.forEach((chapter: any) => {
          expandedMap[chapter.id] = true;
        });
        setExpandedChapters(expandedMap);
      } catch (err) {
        console.error("Failed to fetch student progress", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProgress();
  }, [studentIdStr]);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  if (loading) {
    return (
      <BackgroundWrapper nav={true}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading student progress...</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  if (!data || !data.chapters || data.chapters.length === 0) {
    return (
      <BackgroundWrapper nav={true}>
        <View style={styles.centered}>
          <Text style={styles.noDataText}>No progress or exercises found for this student yet.</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper nav={true}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <ReturnButton />
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={styles.tabButton} 
              onPress={() => router.push('/teacher/ProfileScreen')}
            >
              <Text style={[styles.tabText, activeTab === 'students' && styles.activeTab]}>
                Students
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tabButton}
              onPress={() => router.push('/teacher/ChapterScreen')}
            >
              <Text style={[styles.tabText, activeTab === 'chapters' && styles.activeTab]}>
                Chapters
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.topRow}>
            <Image
              source={require('@/assets/images/avatar.png')}
              style={styles.avatar}
            />
            <Text style={styles.name}>{studentName || "Student"}</Text>
            <TouchableOpacity style={styles.printButton}>
              <Text style={styles.printText}>Print Report</Text>
            </TouchableOpacity>
          </View>

          {data.chapters.map((chapter: any) => (
            <View key={chapter.id} style={styles.chapterContainer}>
              <TouchableOpacity
                style={styles.chapterHeader}
                onPress={() => toggleChapter(chapter.id)}
              >
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                <Image
                  source={
                    expandedChapters[chapter.id]
                      ? require('@/assets/images/arrow-up.png')
                      : require('@/assets/images/arrow-down.png')
                  }
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>

              {expandedChapters[chapter.id] && (
                <View style={styles.exercisesContainer}>
                  {chapter.exercises.map((exercise: any, index: number) => {
                    const isFirst = index === 0;
                    return (
                      <View
                        key={exercise.id}
                        style={[
                          styles.exerciseRow,
                          isFirst && styles.highlightedExercise,
                        ]}
                      >
                        <Text
                          style={[
                            styles.exerciseTitle,
                            isFirst && styles.highlightedExerciseText,
                          ]}
                        >
                          {exercise.title}
                        </Text>

                        {isFirst && (
                          <View style={styles.detailsRow}>
                            <Text style={styles.detailsText}>
                              Time taken: {exercise.timeTaken || 'N/A'}
                            </Text>
                            <Text style={styles.detailsText}>
                              Hints used: {exercise.hintsUsed || 'N/A'}
                            </Text>
                            <View style={styles.attemptsContainer}>
                              <Text style={styles.detailsText}>Attempts: </Text>
                              {exercise.attempts && exercise.attempts.length > 0 ? (
                                exercise.attempts.map((attempt: boolean, i: number) => (
                                  <Text
                                    key={i}
                                    style={[
                                      styles.attemptIcon,
                                      { color: attempt ? 'green' : 'red' },
                                    ]}
                                  >
                                    {attempt ? '✓' : '✕'}
                                  </Text>
                                ))
                              ) : (
                                <Text style={styles.detailsText}>None</Text>
                              )}
                            </View>
                          </View>
                        )}

                        {!isFirst && (
                          <View style={styles.nonFirstDetails}>
                            <Text style={styles.hintText}>
                              {exercise.attempts && exercise.attempts.length > 0
                                ? `Attempts: ${exercise.attempts
                                    .map((a: boolean) => (a ? '✓' : '✕'))
                                    .join(', ')}`
                                : 'No attempts yet'}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  activeTab: {
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  scrollContent: {
    padding: 25,
    paddingBottom: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    marginRight: 12,
  },
  name: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
  },
  printButton: {
    backgroundColor: '#487D33',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  printText: {
    color: 'white',
    fontWeight: 'bold',
  },
  chapterContainer: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  arrowIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  exercisesContainer: {
    marginTop: 6,
  },
  exerciseRow: {
    backgroundColor: '#fff',
    marginVertical: 4,
    borderRadius: 8,
    padding: 10,
  },
  highlightedExercise: {
    backgroundColor: '#E9FBD5',
  },
  exerciseTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  highlightedExerciseText: {
    color: '#333',
  },
  detailsRow: {
    flexDirection: 'column',
    marginTop: 4,
  },
  detailsText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  attemptsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attemptIcon: {
    fontSize: 16,
    marginLeft: 4,
  },
  nonFirstDetails: {
    marginTop: 2,
  },
  hintText: {
    fontSize: 13,
    color: '#666',
  },
});
