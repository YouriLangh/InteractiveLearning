// This is the screen where teachers can create or edit exercises
// Teachers can set the title, description, difficulty, and correct answer
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import BackgroundWrapper from "@/app/components/BackgroundWrapper";
import ReturnButton from "@/app/components/ui/ReturnButton";
import api from "@/services/api";

export default function CreateExerciseScreen() {
  const router = useRouter();
  const { chapterId, exerciseId, mode } = useLocalSearchParams();

  // Get the IDs from the URL and check if we're in view mode
  const chapterIdStr = Array.isArray(chapterId) ? chapterId[0] : chapterId;
  const exerciseIdStr = Array.isArray(exerciseId) ? exerciseId[0] : exerciseId;
  const isViewMode = mode === "view";

  // Store what the teacher types in the input fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stars, setStars] = useState("0");
  const [visibleTo, setVisibleTo] = useState("ALL");
  const [order, setOrder] = useState("0");
  const [difficulty, setDifficulty] = useState("1");
  const [answer, setAnswer] = useState("0");
  const [loading, setLoading] = useState(false);

  // Load exercise data if we're editing an existing exercise
  useEffect(() => {
    const fetchExercise = async () => {
      if (!exerciseIdStr) return;

      try {
        const response = await api.get(`/exercises/${exerciseIdStr}`);
        const exercise = response.data;
        setTitle(exercise.title);
        setDescription(exercise.description || "");
        setStars(exercise.stars?.toString() || "0");
        setVisibleTo(exercise.visibleTo || "ALL");
        setOrder(exercise.order?.toString() || "0");
        setDifficulty(exercise.difficulty?.toString() || "1");
        setAnswer(exercise.answer?.toString() || "0");
      } catch (err) {
        console.error("Failed to load exercise", err);
        Alert.alert("Error", "Failed to load exercise details.");
      }
    };

    fetchExercise();
  }, [exerciseIdStr]);

  // Save the exercise when the teacher clicks the save button
  const saveExercise = async () => {
    // Check if required fields are filled
    if (!title.trim()) {
      Alert.alert("Validation", "Please enter a title.");
      return;
    }

    if (!answer.trim()) {
      Alert.alert("Validation", "Please enter the correct answer.");
      return;
    }

    setLoading(true);

    try {
      // Prepare the data to send to the server
      const payload = {
        title,
        description,
        stars: parseInt(stars),
        visibleTo,
        order: parseInt(order),
        difficulty: parseInt(difficulty),
        answer: parseInt(answer),
      };

      // Update existing exercise or create a new one
      if (exerciseIdStr) {
        await api.put(`/exercises/${exerciseIdStr}`, payload);
      } else {
        if (!chapterIdStr) {
          Alert.alert("Error", "Chapter ID is missing.");
          return;
        }

        await api.post("/exercises", {
          ...payload,
          chapterId: parseInt(chapterIdStr),
        });
      }

      // Show success message and go back
      Alert.alert("Success", "Exercise saved successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error("Error saving exercise", err);
      Alert.alert("Error", "Failed to save exercise.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWrapper nav={true} role={"TEACHER"}>
      <ScrollView contentContainerStyle={styles.container}>
        <ReturnButton />
        <View style={styles.formBox}>
          {/* Show different title based on what we're doing */}
          <Text style={styles.header}>
            {isViewMode
              ? "View Exercise"
              : exerciseIdStr
              ? "Edit Exercise"
              : "Create Exercise"}
          </Text>

          {/* Exercise title input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title:</Text>
            <TextInput
              placeholder="Enter title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              editable={!isViewMode}
            />
          </View>

          {/* Exercise description input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description:</Text>
            <TextInput
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.textArea]}
              multiline
              editable={!isViewMode}
            />
          </View>

          {/* Who can see this exercise */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Visible To:</Text>
            <View style={styles.selectContainer}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => {
                  Alert.alert(
                    "Select Visibility",
                    "Choose who can see this exercise",
                    [
                      {
                        text: "All Users",
                        onPress: () => setVisibleTo("ALL"),
                      },
                      {
                        text: "Teachers Only",
                        onPress: () => setVisibleTo("TEACHERS_ONLY"),
                      },
                    ]
                  );
                }}
                disabled={isViewMode}
              >
                <Text style={styles.selectButtonText}>
                  {visibleTo === "ALL" ? "All Users" : "Teachers Only"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Exercise difficulty (1-5) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Difficulty (1-5):</Text>
            <TextInput
              placeholder="Enter difficulty"
              value={difficulty}
              onChangeText={setDifficulty}
              style={styles.input}
              keyboardType="number-pad"
              editable={!isViewMode}
            />
          </View>

          {/* Exercise order in the chapter */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Order:</Text>
            <TextInput
              placeholder="Enter order"
              value={order}
              onChangeText={setOrder}
              style={styles.input}
              keyboardType="number-pad"
              editable={!isViewMode}
            />
          </View>

          {/* Correct answer for the exercise */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Correct Answer:</Text>
            <TextInput
              placeholder="Enter the correct answer"
              value={answer}
              onChangeText={setAnswer}
              style={styles.input}
              keyboardType="number-pad"
              editable={!isViewMode}
            />
          </View>

          {/* Save button - only show if not in view mode */}
          {!isViewMode && (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveExercise}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading
                    ? "Saving..."
                    : exerciseIdStr
                    ? "Save Changes"
                    : "Create Exercise"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </BackgroundWrapper>
  );
}

// Styles for making the screen look nice on all devices
const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  formBox: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    fontSize: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    color: "#333",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: "#FF8B45",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    overflow: "hidden",
  },
  selectButton: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  selectButtonText: {
    fontSize: 16,
    color: "#333",
  },
});
