// This is the screen where teachers can manage chapters and exercises
// Teachers can add new chapters, view existing ones, and add exercises to each chapter
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
import ReturnButton from "@/app/components/ui/ReturnButton";
import { Ionicons } from "@expo/vector-icons";

/* ====== Types ====== */
// What an exercise looks like in our data
interface Exercise {
  id: number;
  title: string;
}

// What a chapter looks like in our data
interface Chapter {
  id: number;
  title: string;
  color: string;
  exercises: Exercise[];
}

export default function ChapterScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // Store our chapters and loading state
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("chapters");

  // For adding new chapters
  const [addChapterVisible, setAddChapterVisible] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");

  // Get all chapters from the server
  const fetchChapters = async () => {
    try {
      const response = await api.get("/chapters");
      // Sort chapters by ID (newest last) and add colors
      const chaptersWithColors = response.data
        .sort((a: Chapter, b: Chapter) => a.id - b.id)
        .map((chapter: Chapter, index: number) => ({
          ...chapter,
          color: index % 2 === 0 ? "#A7F7B1" : "#FFD399",
        }));
      setChapters(chaptersWithColors);
    } catch (err) {
      console.error(err);
      setError("Failed to load chapters.");
    } finally {
      setLoading(false);
    }
  };

  // Load chapters when the screen opens
  useEffect(() => {
    fetchChapters();
  }, []);

  // Create a new chapter
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

  // Show loading screen while getting chapters
  if (loading) {
    return (
      <BackgroundWrapper nav={true} role={"TEACHER"}>
        <View style={styles.centered}>
          <Text>Loading chapters...</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  // Show error if something went wrong
  if (error) {
    return (
      <BackgroundWrapper nav={true} role={"TEACHER"}>
        <View style={styles.centered}>
          <Text style={{ color: "red" }}>{error}</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper nav={true} role={"TEACHER"}>
      <View style={styles.container}>
        {/* Top navigation bar */}
        <View style={styles.headerContainer}>
          <View style={styles.tabContainer}>
            {/* Switch between Students and Chapters views */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => router.push("/teacher/ProfileScreen")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "students" && styles.activeTab,
                ]}
              >
                Students
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => router.push("/teacher/ChapterScreen")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "chapters" && styles.activeTab,
                ]}
              >
                Chapters
              </Text>
            </TouchableOpacity>
          </View>
          {/* Button to add a new chapter */}
          <TouchableOpacity
            style={styles.addChapterButton}
            onPress={() => setAddChapterVisible(true)}
          >
            <Text style={styles.addChapterText}>+ Add chapter</Text>
          </TouchableOpacity>
        </View>

        {/* List of all chapters */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
        >
          {chapters.map((chapter, index) => (
            <View
              key={chapter.id}
              style={[
                styles.chapterContainer,
                { backgroundColor: chapter.color || "#F0F0F0" },
              ]}
            >
              {/* Chapter header with title and add exercise button */}
              <View style={styles.chapterHeader}>
                <Text style={styles.chapterTitle}>
                  {`Chapter ${index + 1}: ${chapter.title} (${
                    chapter.exercises.length
                  })`}
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
                  <Text style={styles.addExerciseText}>+ Add exercise</Text>
                </TouchableOpacity>
              </View>

              {/* List of exercises in this chapter */}
              {chapter.exercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseCard}
                  onPress={() =>
                    router.push({
                      pathname: "/teacher/CreateExerciseScreen",
                      params: {
                        exerciseId: exercise.id.toString(),
                        mode: "view",
                      },
                    })
                  }
                >
                  <Text style={styles.exerciseText}>{exercise.title}</Text>
                  {/* Edit button for each exercise */}
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/teacher/CreateExerciseScreen",
                        params: {
                          exerciseId: exercise.id.toString(),
                          mode: "edit",
                        },
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

        {/* Popup for adding a new chapter */}
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
      </View>
    </BackgroundWrapper>
  );
}

// Styles for making the screen look nice on all devices
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tabContainer: {
    flexDirection: "row",
    marginLeft: 20,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  activeTab: {
    color: "#000",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  addChapterButton: {
    marginLeft: "auto",
    backgroundColor: "#487D33",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addChapterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  chapterContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 10,
    padding: 16,
  },
  chapterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  chapterTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  addExerciseButton: {
    backgroundColor: "#E88B43",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addExerciseText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 1,
  },
  exerciseText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
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
