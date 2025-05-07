
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
import api from "@/services/api";

export default function CreateExerciseScreen() {
  const router = useRouter();
  const { chapterId, exerciseId } = useLocalSearchParams();

  const chapterIdStr = Array.isArray(chapterId) ? chapterId[0] : chapterId;
  const exerciseIdStr = Array.isArray(exerciseId) ? exerciseId[0] : exerciseId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stars, setStars] = useState("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExercise = async () => {
      if (!exerciseIdStr) return;

      try {
        const response = await api.get(`/exercises/${exerciseIdStr}`);
        const exercise = response.data;
        setTitle(exercise.title);
        setDescription(exercise.description || "");
        setStars(exercise.stars?.toString() || "0");
      } catch (err) {
        console.error("Failed to load exercise", err);
      }
    };

    fetchExercise();
  }, [exerciseIdStr]);

  const saveExercise = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Please enter a title.");
      return;
    }

    setLoading(true);

    try {
      if (exerciseIdStr) {
        // Edit mode
        await api.put(`/exercises/${exerciseIdStr}`, {
          title,
          description,
          stars: parseInt(stars),
        });
      } else {
        // Create mode
        if (!chapterIdStr) {
          Alert.alert("Error", "Chapter ID is missing.");
          return;
        }

        await api.post("/exercises", {
          title,
          description,
          stars: parseInt(stars),
          chapterId: parseInt(chapterIdStr),
        });
      }

      Alert.alert("Success", "Exercise saved successfully.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      console.error("Error saving exercise", err);
      Alert.alert("Error", "Failed to save exercise.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWrapper nav={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {exerciseIdStr ? "Edit Exercise" : "Create Exercise"}
        </Text>

        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 100 }]}
          multiline
        />
        <TextInput
          placeholder="Stars (number)"
          value={stars}
          onChangeText={setStars}
          style={styles.input}
          keyboardType="number-pad"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveExercise}
          disabled={loading}
        >
          <Text style={{ color: "white" }}>
            {loading ? "Saving..." : "Save Exercise"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#FF8B45",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
});
