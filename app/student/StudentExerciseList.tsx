// This is the main screen where students can see all their exercises
// It shows a progress bar with a mascot and a list of chapters with exercises
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import BackgroundWrapper from "@/app/components/BackgroundWrapper";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

/* ====== Types ====== */
// These are the shapes of our data
interface Exercise {
  id: number;
  title: string;
  stars: number;
  answer: number;
  attempts?: boolean[]; // keeps track of if you solved it or not
}

interface Chapter {
  id: number;
  title: string;
  exercises: Exercise[];
}

export default function StudentExerciseList() {
  // Get screen size to make things look good on all devices
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  // Store our data and UI state
  const [chaptersData, setChaptersData] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<{
    [key: number]: boolean;
  }>({});
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  // Make the progress bar take up 60% of screen height
  const progressBarHeight = height * 0.7;
  const mascotSize = 50;

  // When the screen loads, get all chapters and student progress
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        // Get all chapters from the server
        const response = await api.get("/chapters");
        const chapters = response.data.sort((a: Chapter, b: Chapter) => a.id - b.id);

        // If we have a logged in student, get their progress
        if (user?.id) {
          const progressResponse = await api.get(`/progress/${user.id}`);
          const progressData = progressResponse.data;
          console.log('Progress data:', progressData);

          // Add student's attempts to each exercise
          const chaptersWithAttempts = chapters.map((chapter: Chapter) => ({
            ...chapter,
            exercises: chapter.exercises.map((exercise: Exercise) => {
              const chapterProgress = progressData.chapters.find((c: any) => c.id === chapter.id);
              const exerciseProgress = chapterProgress?.exercises.find((e: any) => e.id === exercise.id);
              return {
                ...exercise,
                attempts: exerciseProgress?.attempts || []
              };
            })
          }));

          setChaptersData(chaptersWithAttempts);
          
          // Calculate how many exercises are solved
          const totalExercises = chapters.reduce((sum: number, chapter: Chapter) => sum + chapter.exercises.length, 0);
          const solvedExercises = chaptersWithAttempts.reduce((sum: number, chapter: Chapter) => 
            sum + chapter.exercises.filter((ex: Exercise) => ex.attempts?.some((attempt: boolean) => attempt)).length, 0
          );
          
          // Calculate success rate for the progress bar
          const successRate = totalExercises > 0 ? (solvedExercises / totalExercises) * 100 : 0;
          console.log('Total exercises:', totalExercises, 'Solved:', solvedExercises, 'Success rate:', successRate);
          setProgressPercentage(successRate);
        } else {
          setChaptersData(chapters);
        }

        // Start with all chapters expanded
        const expandedInitialState = chapters.reduce(
          (acc: any, chapter: Chapter) => {
            acc[chapter.id] = true;
            return acc;
          },
          {}
        );
        setExpandedChapters(expandedInitialState);
      } catch (err) {
        console.error(err);
        setError("Failed to load exercises.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [user?.id, params.refresh, params.timestamp]);

  // Calculate where to put the mascot on the progress bar
  const mascotPosition = Math.max(0, (progressBarHeight * progressPercentage / 100) - (mascotSize / 2));
  console.log('Progress:', progressPercentage, 'Mascot position:', mascotPosition);
  const orangeLineHeight = progressPercentage;
  const greyLineHeight = 100 - progressPercentage;

  // Toggle chapter visibility when clicking the arrow
  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // Change exercise background color if it's solved
  const getExerciseBackgroundColor = (attempts?: boolean[]) => {
    if (!attempts || attempts.length === 0) return '#FFFFFF';
    return attempts.some(attempt => attempt) ? '#e6ffe6' : '#FFFFFF';
  };

  // Show loading screen while getting data
  if (loading) {
    return (
      <BackgroundWrapper nav={true} role={"STUDENT"}>
        <View style={styles.centered}>
          <Text>Loading...</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  // Show error if something went wrong
  if (error) {
    return (
      <BackgroundWrapper nav={true} role={"STUDENT"}>
        <View style={styles.centered}>
          <Text style={{ color: "red" }}>{error}</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  // Main screen layout
  return (
    <BackgroundWrapper nav={true} role={"STUDENT"}>
      <View
        style={[
          styles.contentWrapper,
          isLandscape ? styles.landscape : styles.portrait,
        ]}
      >
        {/* Progress bar with mascot */}
        <View style={[styles.progressBarContainer, { height: progressBarHeight }]}>
          {/* Orange part shows progress */}
          <View
            style={[
              styles.progressLine,
              {
                borderColor: "#D16413",
                backgroundColor: "#FF8B45",
                height: `${orangeLineHeight}%`,
              },
            ]}
          ></View>

          {/* Mascot moves up as you solve more exercises */}
          <Image
            source={require("@/assets/images/mascott.png")}
            style={[styles.mascot, { top: mascotPosition }]}
          />
          {/* Grey part shows remaining work */}
          <View
            style={[
              styles.progressLine,
              {
                borderColor: "#ACACAC",
                backgroundColor: "#CACACA",
                height: `${greyLineHeight}%`,
              },
            ]}
          ></View>
        </View>

        {/* List of chapters and exercises */}
        <ScrollView
          style={styles.chaptersScroll}
          contentContainerStyle={styles.chaptersContent}
        >
          {chaptersData.map((chapter) => {
            const isExpanded = expandedChapters[chapter.id] ?? true;
            return (
              <React.Fragment key={chapter.id}>
                {/* Chapter header with title and expand/collapse button */}
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
                  {/* Show exercises if chapter is expanded */}
                  {isExpanded && (
                    <View style={styles.exercisesContainer}>
                      {chapter.exercises.map((exercise, index) => {
                        const isFirstExercise = index === 0 && chapter.id === 1;
                        const isSolved = exercise.attempts?.some(attempt => attempt);
                        return (
                          <TouchableOpacity
                            key={exercise.id}
                            style={[
                              styles.exerciseRow,
                              isFirstExercise && styles.highlightedExercise,
                              { backgroundColor: getExerciseBackgroundColor(exercise.attempts) }
                            ]}
                            onPress={() => {
                              // Go to exercise screen when clicked
                              router.push({
                                pathname: "/student/StudentLearnScreen",
                                params: {
                                  chapterId: chapter.id.toString(),
                                  exerciseNr: (index + 1).toString(),
                                  id: exercise.id.toString(),
                                  title: exercise.title,
                                  stars: exercise.stars.toString(),
                                  answer: exercise.answer?.toString() || "0",
                                },
                              });
                            }}
                          >
                            <View style={styles.exerciseContent}>
                              <Text
                                style={[
                                  styles.exerciseText,
                                  isFirstExercise && styles.highlightedExerciseText,
                                ]}
                              >
                                Exercise {index + 1}: {exercise.title}
                              </Text>
                              {isSolved && (
                                <Text style={styles.solvedText}>Solved</Text>
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

// Styles for making everything look nice
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  solvedText: {
    color: '#2E7D32',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});
