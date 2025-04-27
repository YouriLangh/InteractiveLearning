import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Image,
  LayoutChangeEvent,
} from "react-native";
import { useRouter } from "expo-router";
import BackgroundWrapper from "@/app/components/BackgroundWrapper";
import ReturnButton from "@/app/components/ui/ReturnButton";

/* ====== Types ====== */
interface Exercise {
  id: number;
  name: string;
  stars: number;
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
        name: "Exercise 1: Make the number 21 using blocks.",
        stars: 2,
      },
      {
        id: 102,
        name: "Exercise 2: Make the number 35 using blocks.",
        stars: 5,
      },
      {
        id: 103,
        name: "Exercise 3: Make the number 215 using blocks.",
        stars: 3,
      },
    ],
  },
  {
    id: 2,
    title: "Chapter 2: Addition",
    exercises: [
      {
        id: 201,
        name: "Exercise 1: Make the number 21 using blocks.",
        stars: 0,
      },
      {
        id: 202,
        name: "Exercise 2: Make the number 35 using blocks.",
        stars: 0,
      },
    ],
  },
  {
    id: 3,
    title: "Chapter 2: Addition",
    exercises: [
      {
        id: 201,
        name: "Exercise 1: Make the number 21 using blocks.",
        stars: 0,
      },
      {
        id: 202,
        name: "Exercise 2: Make the number 35 using blocks.",
        stars: 0,
      },
    ],
  },
  {
    id: 4,
    title: "Chapter 2: Addition",
    exercises: [
      {
        id: 201,
        name: "Exercise 1: Make the number 21 using blocks.",
        stars: 0,
      },
      {
        id: 202,
        name: "Exercise 2: Make the number 35 using blocks.",
        stars: 0,
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
  }>({});

  const [progressBarDimension, setProgressBarDimension] = useState<number>(0);
  const MASCOT_SIZE = 30;
  const progress = 0.5;

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleProgressBarLayout = (e: LayoutChangeEvent) => {
    const dimension = isLandscape
      ? e.nativeEvent.layout.height
      : e.nativeEvent.layout.width;
    setProgressBarDimension(dimension);
  };

  return (
    <BackgroundWrapper nav={true}>
      <View
        style={[
          styles.contentWrapper,
          isLandscape ? styles.landscape : styles.portrait,
        ]}
      >
        <View
          style={[
            styles.progressBarContainer,
            isLandscape
              ? styles.progressBarVertical
              : styles.progressBarHorizontal,
          ]}
          onLayout={handleProgressBarLayout}
        >
          <View
            style={[
              styles.progressLine,
              isLandscape ? styles.lineVertical : styles.lineHorizontal,
            ]}
          />

          <Image
            source={require("@/assets/images/mascott_tr.png")}
            style={[
              styles.mascot,
              isLandscape
                ? { top: progress * progressBarDimension - MASCOT_SIZE / 2 }
                : { left: progress * progressBarDimension - MASCOT_SIZE / 2 },
            ]}
          />
        </View>

        <ScrollView
          style={styles.chaptersScroll}
          contentContainerStyle={styles.chaptersContent}
        >
          {chaptersData.map((chapter) => {
            const isExpanded = expandedChapters[chapter.id] ?? false;
            return (
              <View key={chapter.id} style={styles.chapterBlock}>
                <TouchableOpacity
                  style={[
                    styles.chapterHeader,
                    isExpanded && styles.chapterHeaderExpanded,
                  ]}
                  onPress={() => toggleChapter(chapter.id)}
                >
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>

                  <Image
                    source={
                      isExpanded
                        ? require("@/assets/images/arrow-up.png")
                        : require("@/assets/images/arrow-down.png")
                    }
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.exercisesContainer}>
                    {chapter.exercises.map((exercise, index) => {
                      const isFirstExercise = index === 0;
                      return (
                        <TouchableOpacity
                          key={exercise.id}
                          style={[
                            styles.exerciseRow,
                            isFirstExercise && styles.highlightedExercise,
                          ]}
                          onPress={() => {
                            router.push(`/student/StudentLearnScreen`);
                          }}
                        >
                          <Text
                            style={[
                              styles.exerciseText,
                              isFirstExercise && styles.highlightedExerciseText,
                            ]}
                          >
                            {exercise.name}
                          </Text>
                          <View style={styles.starsWrapper}>
                            {Array.from({ length: exercise.stars }).map(
                              (_, i) => (
                                <Text key={i} style={styles.star}>
                                  ⭐
                                </Text>
                              )
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
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
  },
  portrait: {
    flexDirection: "column",
  },
  landscape: {
    flexDirection: "row",
  },

  progressBarContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    position: "relative",
  },
  progressBarVertical: {
    width: 70,
    height: "95%",
  },
  progressBarHorizontal: {
    height: 70,
    width: "95%",
  },
  arrowIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    resizeMode: "contain",
  },

  progressLine: {
    backgroundColor: "#FF8B45",
    borderRadius: 5,
  },
  lineVertical: {
    width: 8,
    height: "100%",
  },
  lineHorizontal: {
    width: "100%",
    height: 8,
  },
  mascot: {
    position: "absolute",
    width: 50,
    height: 50,
  },

  chaptersScroll: {
    flex: 1,
  },
  chaptersContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  chapterBlock: {
    marginBottom: 16,
    borderRadius: 8,
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
    marginTop: 8,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  highlightedExercise: {
    backgroundColor: "#E6F8CD",
  },
  exerciseText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  highlightedExerciseText: {
    fontWeight: "bold",
    color: "#333",
  },
  starsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    fontSize: 18,
    color: "#FFD700",
    marginLeft: 4,
  },
});
