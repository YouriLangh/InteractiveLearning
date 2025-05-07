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

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchStudentProgress = async () => {
      if (!studentIdStr) return;

      try {
        const response = await api.get(`/student-progress/${studentIdStr}`);
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
      <BackgroundWrapper>
        <View style={styles.centered}>
          <Text>Loading student progress...</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  if (!data || !data.chapters || data.chapters.length === 0) {
    return (
      <BackgroundWrapper>
        <View style={styles.centered}>
          <Text>No progress or exercises found for this student yet.</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper nav={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <ReturnButton />
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
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
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
  },
});
