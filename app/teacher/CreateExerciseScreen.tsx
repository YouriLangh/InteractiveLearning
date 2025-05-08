<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import ReturnButton from '@/app/components/ui/ReturnButton';
import api from '@/services/api';  // ← added import

const { width } = Dimensions.get('window');

const formConfig = {
  defaultTitle: "",
  defaultChapter: "CHAPTER 3",
  defaultExercise: "X",
  defaultVisibleTo: "ALL",
  defaultDifficulty: 3,
  chapters: ["CHAPTER 1", "CHAPTER 2", "CHAPTER 3", "CHAPTER 4"],
  exerciseTypes: ["Type A", "Type B", "Type C"],
  visibleToOptions: ["ALL", "Teachers", "Students"],
};

export default function CreateExerciseScreen() {
  const [title, setTitle] = useState('');
  const [chapter, setChapter] = useState('');
  const [exercise, setExercise] = useState('');
  const [visibleTo, setVisibleTo] = useState('');
  const [difficulty, setDifficulty] = useState(3);

  const [chapterOptions, setChapterOptions] = useState<string[]>([]);
  const [visibleToOptions, setVisibleToOptions] = useState<string[]>([]);

  const [showChapterDropdown, setShowChapterDropdown] = useState(false);
  const [showVisibleToDropdown, setShowVisibleToDropdown] = useState(false);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTitle(formConfig.defaultTitle);
    setChapter(formConfig.defaultChapter);
    setExercise(formConfig.defaultExercise);
    setVisibleTo(formConfig.defaultVisibleTo);
    setDifficulty(formConfig.defaultDifficulty);
    setChapterOptions(formConfig.chapters);
    setVisibleToOptions(formConfig.visibleToOptions);
    setLoaded(true);
  }, []);

  // ← updated handler to call real API
  const handleCreate = async () => {
    try {
      // extract numeric chapter ID from e.g. "CHAPTER 3"
      const chapterId = parseInt(chapter.replace(/\D/g, ''), 10);
      await api.post('/exercises', {
        chapterId,
        question: title,
        answer: parseInt(exercise, 10),
        stars: difficulty,
        visibleTo,
      });
      // navigate back on success
      // (or router.back() if you have router)
    } catch (err) {
      console.error('Create exercise failed:', err);
    }
  };

  if (!loaded) return null;

  return (
    <BackgroundWrapper nav={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <ReturnButton />
        <View style={styles.formBox}>
          <Text style={styles.header}>Create an exercise</Text>

          {/* Title Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title:</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="ENTER TITLE"
              placeholderTextColor="#ccc"
            />
          </View>

          {/* Chapter Select Dropdown */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Chapter:</Text>
            <TouchableOpacity
              style={styles.select}
              onPress={() => setShowChapterDropdown(!showChapterDropdown)}
            >
              <Text style={styles.selectText}>{chapter}</Text>
            </TouchableOpacity>
            {showChapterDropdown && (
              <View style={styles.dropdown}>
                {chapterOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setChapter(option);
                      setShowChapterDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Exercise Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Exercise:</Text>
            <Text style={[styles.input, styles.staticInput]}>{exercise}</Text>
          </View>

          {/* Difficulty */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>DIFFICULTY:</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => setDifficulty(i)}>
                  <Text style={styles.star}>{i <= difficulty ? '★' : '☆'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Visible To */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Visible to:</Text>
            <TouchableOpacity
              style={styles.select}
              onPress={() => setShowVisibleToDropdown(!showVisibleToDropdown)}
            >
              <Text style={styles.selectText}>{visibleTo}</Text>
            </TouchableOpacity>
            {showVisibleToDropdown && (
              <View style={styles.dropdown}>
                {visibleToOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setVisibleTo(option);
                      setShowVisibleToDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Create Button */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreate}
            >
              <Text style={styles.createText}>＋ Create</Text>
            </TouchableOpacity>
          </View>
        </View>
=======
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
  const [visibleTo, setVisibleTo] = useState("ALL");
  const [order, setOrder] = useState("0");
  const [difficulty, setDifficulty] = useState("1");
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
        setVisibleTo(exercise.visibleTo || "ALL");
        setOrder(exercise.order?.toString() || "0");
        setDifficulty(exercise.difficulty?.toString() || "1");
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
      const payload = {
        title,
        description,
        stars: parseInt(stars),
        visibleTo,
        order: parseInt(order),
        difficulty: parseInt(difficulty),
      };

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
          placeholder="Stars (0-5)"
          value={stars}
          onChangeText={setStars}
          style={styles.input}
          keyboardType="number-pad"
        />
        
        <TextInput
            placeholder="Visible To (ALL, TEACHER, STUDENT)"
            value={visibleTo}
            onChangeText={setVisibleTo}
            style={styles.input}
        />

        <Text>Difficulty (1-5):</Text>
        <TextInput
          placeholder="Difficulty"
          value={difficulty}
          onChangeText={setDifficulty}
          style={styles.input}
          keyboardType="number-pad"
        />

        <TextInput
          placeholder="Order (optional)"
          value={order}
          onChangeText={setOrder}
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
>>>>>>> Fahim2
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { 
    paddingVertical: 40, 
    paddingHorizontal: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  formBox: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  header: { 
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24, 
    textAlign: 'center' 
  },
  formGroup: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 6 
  },
  input: {
    fontSize: 16, 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    paddingVertical: 12, 
    color: '#333', 
    borderWidth: 1, 
    borderColor: '#DDD' 
  },
  staticInput: {
    paddingVertical: 12 
  },
  select: { 
    paddingVertical: 12, 
    paddingHorizontal: 12, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#DDD', 
    justifyContent: 'center' 
  },
  selectText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  dropdown: {
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#DDD', 
    borderRadius: 8, 
    marginTop: 4, 
    paddingVertical: 4, 
    paddingHorizontal: 10 
  },
  dropdownText: {
    fontSize: 16, 
    color: '#333', 
    paddingVertical: 8 
  },
  stars: {
    flexDirection: 'row' 
  },
  star: { 
    fontSize: 20, 
    color: '#FFD700', 
    marginRight: 4 
  },
  buttonRow: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 30 
  },
  createButton: {
    backgroundColor: '#6ECE71', 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 8 
  },
  createText: {
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
=======
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
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
>>>>>>> Fahim2
  },
});
