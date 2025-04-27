import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Image,
  UIManager, // Import UIManager for Android support
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import BackgroundWrapper from "@/app/components/BackgroundWrapper";

/* ====== Types ====== */
interface Exercise {
  id: number;
  name: string;
  stars: number;
  answer: number;
}

interface Chapter {
  id: number;
  title: string;
  exercises: Exercise[];
}
/* ====== Dummy Data ====== */
const chaptersData: Chapter[] = [
  {
    id: 1,
    title: "Chapter 1: Numbers",
    exercises: [
      {
        id: 101,
        name: "Build the number 21 with blocks.",
        stars: 2,
        answer: 21,
      },
      {
        id: 102,
        name: "Build the number 35 with blocks.",
        stars: 5,
        answer: 35,
      },
      {
        id: 103,
        name: "Build the number 215 with blocks.",
        stars: 3,
        answer: 215,
      },
    ],
  },
  {
    id: 2,
    title: "Chapter 2: Addition",
    exercises: [
      {
        id: 201,
        name: "What is 15 + 6?",
        stars: 0,
        answer: 21,
      },
      {
        id: 202,
        name: "What is 20 + 15?",
        stars: 0,
        answer: 35,
      },
      {
        id: 203,
        name: "What is 120 + 95?",
        stars: 0,
        answer: 215,
      },
    ],
  },
  {
    id: 3,
    title: "Chapter 3: Subtraction",
    exercises: [
      {
        id: 301,
        name: "What is 50 - 29?",
        stars: 0,
        answer: 21,
      },
      {
        id: 302,
        name: "What is 70 - 35?",
        stars: 0,
        answer: 35,
      },
      {
        id: 303,
        name: "What is 300 - 85?",
        stars: 0,
        answer: 215,
      },
    ],
  },
  {
    id: 4,
    title: "Chapter 4: Multiplication",
    exercises: [
      {
        id: 401,
        name: "What is 3 × 7?",
        stars: 0,
        answer: 21,
      },
      {
        id: 402,
        name: "What is 5 × 7?",
        stars: 0,
        answer: 35,
      },
      {
        id: 403,
        name: "What is 43 × 5?",
        stars: 0,
        answer: 215,
      },
    ],
  },
];

export default function ChaptersScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const router = useRouter();

  const [expandedChapters, setExpandedChapters] = useState<{
    [key: number]: boolean;
  }>({
    1: true,
    2: false,
    3: false,
    4: false,
  });

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  return (
    <BackgroundWrapper nav={true}>
      <View
        style={[
          styles.contentWrapper,
          isLandscape ? styles.landscape : styles.portrait,
        ]}
      >
        <View style={styles.progressBarContainer}>
          {/* Orange bar till mascot */}
          <View
            style={[
              styles.progressLine,
              {
                borderColor: "#D16413",
                backgroundColor: "#FF8B45",
                height: "20%",
              },
            ]}
          ></View>

          {/* Mascot */}
          <Image
            source={require("@/assets/images/mascott.png")}
            style={styles.mascot}
          />
          {/* Grey bar from mascot till end */}
          <View
            style={[
              styles.progressLine,
              {
                borderColor: "#ACACAC",
                backgroundColor: "#CACACA",
                height: "138%",
              },
            ]}
          ></View>
        </View>

        <ScrollView
          style={styles.chaptersScroll}
          contentContainerStyle={styles.chaptersContent}
        >
          {chaptersData.map((chapter) => {
            const isExpanded = expandedChapters[chapter.id] ?? true;
            return (
              <React.Fragment key={chapter.id}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <Text style={{ fontFamily: "Poppins-Bold", fontSize: 28 }}>
                    {chapter.title}
                  </Text>
                  <TouchableOpacity onPress={() => toggleChapter(chapter.id)}>
                    <Image
                      source={require("@/assets/images/arrow-down.png")}
                      style={[
                        styles.arrowIcon,
                        {
                          transform: [
                            { rotate: !isExpanded ? "90deg" : "0deg" },
                          ],
                        },
                      ]}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  {isExpanded && (
                    <View style={styles.exercisesContainer}>
                      {chapter.exercises.map((exercise, index) => {
                        const isFirstExercise = index === 0 && chapter.id === 1;
                        return (
                          <TouchableOpacity
                            key={exercise.id}
                            style={[
                              styles.exerciseRow,
                              isFirstExercise && styles.highlightedExercise,
                            ]}
                            onPress={() => {
                              router.push({
                                pathname: "/student/StudentLearnScreen",
                                params: {
                                  chapterId: chapter.id.toString(),
                                  exerciseNr: (index + 1).toString(),
                                  id: exercise.id.toString(),
                                  name: exercise.name,
                                  stars: exercise.stars.toString(),
                                  answer: exercise.answer.toString(),
                                },
                              });
                            }}
                          >
                            <Text
                              style={[
                                styles.exerciseText,
                                isFirstExercise &&
                                  styles.highlightedExerciseText,
                              ]}
                            >
                              Exercise {index + 1}: {exercise.name}
                            </Text>
                            <View
                              key={"Stars" + exercise.id}
                              style={styles.starsWrapper}
                            >
                              {Array.from({ length: exercise.stars }).map(
                                (_, i) => (
                                  <Image
                                    key={`star-${exercise.id}-${i}`}
                                    source={
                                      isFirstExercise
                                        ? require("@/assets/images/Star.png")
                                        : require("@/assets/images/GrayStar.png")
                                    }
                                    style={styles.star}
                                  />
                                )
                              )}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              </React.Fragment>
            );
          })}
        </ScrollView>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#F7EAD9",
  },
  contentWrapper: {
    flex: 1,
    marginTop: "5%",
    marginHorizontal: "5%",
  },
  portrait: {
    flexDirection: "column",
  },
  landscape: {
    flexDirection: "row",
  },

  progressBarContainer: {
    alignItems: "center",
    position: "relative",
    height: "150%",
  },
  arrowIcon: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },

  progressLine: {
    borderRadius: 50,
    padding: 6,
    borderWidth: 2,
  },
  mascot: {
    position: "absolute",
    top: "18%",
    zIndex: 1,
    width: 50,
    height: 50,
  },

  chaptersScroll: {
    flex: 1,
    marginLeft: "5%",
  },
  chaptersContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  chapterHeader: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  chapterHeaderExpanded: {
    backgroundColor: "#FFFFE3",
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  exercisesContainer: {
    marginBottom: 32,
    width: "95%",
    alignSelf: "flex-end",
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 48,
    paddingVertical: 20,
    borderRadius: 12,
    shadowColor: "#000",
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
  },
  highlightedExercise: {
    backgroundColor: "#EEFFD9",
  },
  exerciseText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontFamily: "Poppins-Regular",
  },
  highlightedExerciseText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Poppins-Regular",
  },
  starsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginLeft: 6,
    width: 26,
    height: 26,
  },
});
