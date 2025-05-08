<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
=======

import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
>>>>>>> Fahim2
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
<<<<<<< HEAD
} from 'react-native';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import api from '@/services/api'; // ← new import
=======
  Modal,
  TextInput,
} from "react-native";
import BackgroundWrapper from "@/app/components/BackgroundWrapper";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
>>>>>>> Fahim2

/* ====== Types ====== */
interface Exercise {
  id: number;
  title: string;
}

interface Chapter {
  id: number;
  title: string;
<<<<<<< HEAD
  color: string;
=======
>>>>>>> Fahim2
  exercises: Exercise[];
}

export default function ChapterScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

<<<<<<< HEAD
  // ← replace static dummy data with state
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [activeTab, setActiveTab] = useState('chapters');

  // ← fetch real chapters on mount
  useEffect(() => {
    api
      .get<Chapter[]>('/chapters')
      .then(res => setChapters(res.data))
      .catch(err => console.error('Failed to load chapters:', err));
  }, []);

  return (
    <BackgroundWrapper nav={true}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => {
              setActiveTab('students');
              router.push('/teacher/ProfileScreen');
            }}
          >
            <Text
              style={[styles.header, activeTab === 'students' && styles.active]}
            >
              Students
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveTab('chapters');
              router.push('/teacher/ChapterScreen');
            }}
          >
            <Text
              style={[styles.header, activeTab === 'chapters' && styles.active]}
            >
              Chapters
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addChapterButton}
            onPress={() => router.push('/teacher/CreateExerciseScreen')}
          >
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
                <TouchableOpacity style={styles.addExerciseButton}>
                  <Text style={styles.addExerciseText}>+ Add exercise</Text>
                </TouchableOpacity>
              </View>

              {/* Exercises */}
              {chapter.exercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <Text style={styles.exerciseText}>{exercise.title}</Text>
                  <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
=======
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addChapterVisible, setAddChapterVisible] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");

  const fetchChapters = async () => {
    try {
      const response = await api.get("/chapters");
      setChapters(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load chapters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const createChapter = async () => {
    if (!newChapterTitle.trim()) return;

    try {
      await api.post("/chapters", { title: newChapterTitle });
      setAddChapterVisible(false);
      setNewChapterTitle("");
      fetchChapters();
    } catch (err) {
      console.error("Error creating chapter", err);
    }
  };

  if (loading) {
    return (
      <BackgroundWrapper>
        <View style={styles.centered}>
          <Text>Loading chapters...</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  if (error) {
    return (
      <BackgroundWrapper>
        <View style={styles.centered}>
          <Text style={{ color: "red" }}>{error}</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper nav={true}>
      <View style={[styles.topBar]}>
        <Text style={styles.tab}>Students</Text>
        <Text style={[styles.tab, styles.activeTab]}>Chapters</Text>
        <TouchableOpacity
          style={styles.addChapterButton}
          onPress={() => setAddChapterVisible(true)}
        >
          <Text style={{ color: "white" }}>+ Add Chapter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.chaptersContent}>
        {chapters.map((chapter) => (
          <View key={chapter.id} style={styles.chapterContainer}>
            <View style={styles.chapterHeader}>
              <Text style={styles.chapterTitle}>
                Chapter {chapter.id}: {chapter.title} ({chapter.exercises.length})
              </Text>
              <TouchableOpacity
                style={styles.addExerciseButton}
                onPress={() =>
                  router.push({
                    pathname: "/teacher/CreateExerciseScreen",
                    params: { chapterId: chapter.id.toString() },
                  })
                }
              >
                <Text style={{ color: "white" }}>+ Add exercise</Text>
              </TouchableOpacity>
            </View>

            {chapter.exercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseButton}
                onPress={() =>
                  router.push({
                    pathname: "/teacher/CreateExerciseScreen",
                    params: { exerciseId: exercise.id.toString() },
                  })
                }
              >
                <Text style={styles.exerciseText}>{exercise.title}</Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/teacher/CreateExerciseScreen",
                      params: { exerciseId: exercise.id.toString() },
                    })
                  }
                >
                  <Ionicons name="pencil" size={20} color="orange" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <Modal visible={addChapterVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Chapter</Text>
            <TextInput
              placeholder="Chapter Title"
              style={styles.input}
              value={newChapterTitle}
              onChangeText={setNewChapterTitle}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={createChapter}
            >
              <Text style={{ color: "white" }}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "gray" }]}
              onPress={() => setAddChapterVisible(false)}
            >
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
>>>>>>> Fahim2
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
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
  addChapterButton: {
    marginLeft: 'auto',
    marginRight: '2%',
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
=======
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFF1E6",
  },
  tab: {
    fontSize: 18,
    color: "#888",
  },
  activeTab: {
    fontWeight: "bold",
    color: "#000",
    textDecorationLine: "underline",
  },
  addChapterButton: {
    backgroundColor: "#3BB143",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  chaptersContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  chapterContainer: {
    marginBottom: 30,
    backgroundColor: "#E0F8E0",
    padding: 15,
    borderRadius: 10,
  },
  chapterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addExerciseButton: {
    backgroundColor: "#FF8B45",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  exerciseButton: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseText: {
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#3BB143",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 10,
>>>>>>> Fahim2
  },
});
