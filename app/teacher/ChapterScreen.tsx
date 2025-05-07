
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Modal,
  TextInput,
} from "react-native";
import BackgroundWrapper from "@/app/components/BackgroundWrapper";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";

/* ====== Types ====== */
interface Exercise {
  id: number;
  title: string;
}

interface Chapter {
  id: number;
  title: string;
  exercises: Exercise[];
}

export default function ChapterScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

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
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
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
  },
});
