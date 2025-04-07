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

  const handleCreate = () => {

    console.log('Create tapped', { title, chapter, exercise, visibleTo, difficulty });
  };

  if (!loaded) return null; 

  return (
    <BackgroundWrapper>
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


          <View style={styles.formGroup}>
            <Text style={styles.label}>Exercise:</Text>
            <Text style={[styles.input, styles.staticInput]}>{exercise}</Text>
          </View>



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
            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
              <Text style={styles.createText}>＋ Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    fontSize: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    color: '#333',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  staticInput: {

    paddingVertical: 12,
  },
  select: {

    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
  },
  selectText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 20,
    color: '#FFD700',
    marginRight: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  createButton: {
    backgroundColor: '#6ECE71',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  createText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
