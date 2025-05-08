import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
<<<<<<< HEAD
  ActivityIndicator,
=======
>>>>>>> Fahim2
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import ReturnButton from '@/app/components/ui/ReturnButton';
import api from '@/services/api';

const { width } = Dimensions.get('window');

export default function StudentDetailScreen() {
<<<<<<< HEAD
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const router = useRouter();

  const [chapters, setChapters] = useState<{
    id: number;
    title: string;
    exercises: {
      id: number;
      title: string;
      timeTaken?: string;
      hintsUsed?: number;
      attempts?: boolean[];
    }[];
  }[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{
        chapters: {
          id: number;
          title: string;
          exercises: {
            id: number;
            title: string;
            timeTaken: string;
            hintsUsed: number;
            attempts: boolean[];
          }[];
        }[];
      }>(`/progress/${studentId}/chapters`)
      .then((res) => {
        setChapters(res.data.chapters);
      })
      .catch((err) => {
        console.error('Failed to load student progress:', err);
        setError('Unable to load student data.');
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  const toggleChapter = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
=======
  const router = useRouter();
  const { studentId, studentName } = useLocalSearchParams();
  const studentIdStr = Array.isArray(studentId) ? studentId[0] : studentId;

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
>>>>>>> Fahim2
  };

  if (loading) {
    return (
<<<<<<< HEAD
      <BackgroundWrapper nav={true}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
=======
      <BackgroundWrapper>
        <View style={styles.centered}>
          <Text>Loading student progress...</Text>
>>>>>>> Fahim2
        </View>
      </BackgroundWrapper>
    );
  }

<<<<<<< HEAD
  if (error) {
    return (
      <BackgroundWrapper nav={true}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
=======
  if (!data || !data.chapters || data.chapters.length === 0) {
    return (
      <BackgroundWrapper>
        <View style={styles.centered}>
          <Text>No progress or exercises found for this student yet.</Text>
>>>>>>> Fahim2
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper nav={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <ReturnButton />
<<<<<<< HEAD

        {chapters.map((chapter) => {
          const isExpanded = expanded[chapter.id] ?? false;
          return (
            <View key={chapter.id} style={styles.chapterContainer}>
              <TouchableOpacity
                style={styles.chapterHeader}
                onPress={() => toggleChapter(chapter.id)}
              >
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                <Image
                  source={
                    isExpanded
                      ? require('@/assets/images/arrow-up.png')
                      : require('@/assets/images/arrow-down.png')
                  }
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.exercisesContainer}>
                  {chapter.exercises.map((ex, idx) => {
                    const isFirst = idx === 0;
                    return (
                      <View
                        key={ex.id}
                        style={[
                          styles.exerciseRow,
                          isFirst && styles.highlightedExercise,
                        ]}
                      >
                        <Text
                          style={[
                            styles.exerciseTitle,
                            isFirst && styles.highlightedText,
                          ]}
                        >
                          {ex.title}
                        </Text>
                        {isFirst ? (
                          <View style={styles.detailsRow}>
                            <Text style={styles.detailsText}>
                              Time: {ex.timeTaken || 'N/A'}
                            </Text>
                            <Text style={styles.detailsText}>
                              Hints: {ex.hintsUsed ?? 0}
                            </Text>
                            <View style={styles.attemptsContainer}>
                              <Text style={styles.detailsText}>Attempts: </Text>
                              {ex.attempts && ex.attempts.length > 0 ? (
                                ex.attempts.map((a, i) => (
                                  <Text
                                    key={i}
                                    style={[
                                      styles.attemptIcon,
                                      { color: a ? 'green' : 'red' },
                                    ]}
                                  >
                                    {a ? '✓' : '✕'}
                                  </Text>
                                ))
                              ) : (
                                <Text style={styles.detailsText}>None</Text>
                              )}
                            </View>
                          </View>
                        ) : (
                          <Text style={styles.hintText}>
                            {ex.attempts && ex.attempts.length > 0
                              ? `Attempts: ${ex.attempts
                                  .map((a) => (a ? '✓' : '✕'))
                                  .join(', ')}`
                              : 'No attempts yet'}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
=======
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: '#FFD28E' }]} />
          <Text style={styles.studentName}>{studentName || "Student"}</Text>
        </View>

        {data.chapters.map((chapter: any) => (
          <View key={chapter.id} style={styles.chapterContainer}>
            <TouchableOpacity
              onPress={() => toggleChapter(chapter.id)}
              style={styles.chapterHeader}
            >
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              <Text style={styles.chapterToggle}>
                {expandedChapters[chapter.id] ? "-" : "+"}
              </Text>
            </TouchableOpacity>

            {expandedChapters[chapter.id] && chapter.exercises.map((exercise: any) => (
              <View key={exercise.id} style={styles.exerciseContainer}>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <Text style={styles.exerciseInfo}>
                  Time Taken: {exercise.timeTaken ?? "N/A"} | Hints Used: {exercise.hintsUsed ?? "N/A"}
                </Text>
                <View style={styles.attemptsRow}>
                  {(exercise.attempts ?? []).map((attempt: boolean, index: number) => (
                    <Image
                      key={index}
                      source={attempt ? require('@/assets/images/Star.png') : require('@/assets/images/GrayStar.png')}
                      style={styles.starIcon}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}
>>>>>>> Fahim2
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 16 },
  container: {
    padding: 25,
    paddingBottom: 60,
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
    width: 24,
    height: 24,
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
  highlightedText: {
    color: '#333',
  },
  detailsRow: {
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
  hintText: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
=======
  container: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chapterContainer: {
    marginBottom: 20,
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0F8E0',
    padding: 12,
    borderRadius: 8,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chapterToggle: {
    fontSize: 18,
  },
  exerciseContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  exerciseInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  attemptsRow: {
    flexDirection: 'row',
  },
  starIcon: {
    width: 24,
    height: 24,
    marginRight: 6,
>>>>>>> Fahim2
  },
});
