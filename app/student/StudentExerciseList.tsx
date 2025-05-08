<<<<<<< HEAD
=======

>>>>>>> Fahim2
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Image,
<<<<<<< HEAD
  UIManager, // Import UIManager for Android support
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import BackgroundWrapper from "@/app/components/BackgroundWrapper";
import api from "@/services/api";            // ← new import
=======
} from "react-native";
import { useRouter } from "expo-router";
import BackgroundWrapper from "@/app/components/BackgroundWrapper";
import api from "@/services/api";
>>>>>>> Fahim2

/* ====== Types ====== */
interface Exercise {
  id: number;
<<<<<<< HEAD
  name: string;
=======
  title: string;
>>>>>>> Fahim2
  stars: number;
  answer: number;
}

interface Chapter {
  id: number;
  title: string;
  exercises: Exercise[];
}

<<<<<<< HEAD
export default function ChaptersScreen() {
=======
export default function StudentExerciseList() {
>>>>>>> Fahim2
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const router = useRouter();

<<<<<<< HEAD
  // ← replace static dummy array with state
  const [chaptersData, setChaptersData] = useState<Chapter[]>([]);

  const [expandedChapters, setExpandedChapters] = useState<{
    [key: number]: boolean;
  }>({
    1: true,
    2: false,
    3: false,
    4: false,
  });

  // ← fetch real chapters once on mount
  useEffect(() => {
    api
      .get<Chapter[]>("/chapters")
      .then((res) => setChaptersData(res.data))
      .catch((err) => console.error("Failed to load chapters:", err));
=======
  const [chaptersData, setChaptersData] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const response = await api.get("/chapters");
        setChaptersData(response.data);
        const expandedInitialState = response.data.reduce((acc: any, chapter: Chapter) => {
          acc[chapter.id] = true;
          return acc;
        }, {});
        setExpandedChapters(expandedInitialState);
      } catch (err) {
        console.error(err);
        setError("Failed to load exercises.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
>>>>>>> Fahim2
  }, []);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

<<<<<<< HEAD
=======
  if (loading) {
    return (
      <BackgroundWrapper>
        <View style={styles.centered}>
          <Text>Loading...</Text>
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

>>>>>>> Fahim2
  return (
    <BackgroundWrapper nav={true}>
      <View
        style={[
          styles.contentWrapper,
          isLandscape ? styles.landscape : styles.portrait,
        ]}
      >
        <View style={styles.progressBarContainer}>
<<<<<<< HEAD
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
=======
          <View style={[styles.progressLine, { borderColor: "#D16413", backgroundColor: "#FF8B45", height: "20%" }]} />
          <Image source={require("@/assets/images/mascott.png")} style={styles.mascot} />
          <View style={[styles.progressLine, { borderColor: "#ACACAC", backgroundColor: "#CACACA", height: "138%" }]} />
        </View>

        <ScrollView style={styles.chaptersScroll} contentContainerStyle={styles.chaptersContent}>
>>>>>>> Fahim2
          {chaptersData.map((chapter) => {
            const isExpanded = expandedChapters[chapter.id] ?? true;
            return (
              <React.Fragment key={chapter.id}>
<<<<<<< HEAD
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
                        const isFirstExercise =
                          index === 0 && chapter.id === 1;
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
=======
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <Text style={{ fontFamily: "Poppins-Bold", fontSize: 28 }}>{chapter.title}</Text>
                  <TouchableOpacity onPress={() => toggleChapter(chapter.id)}>
                    <Image source={require("@/assets/images/arrow-down.png")} style={[styles.arrowIcon, { transform: [{ rotate: !isExpanded ? "90deg" : "0deg" }] }]} />
                  </TouchableOpacity>
                </View>

                <View>
                  {isExpanded && (
                    <View style={styles.exercisesContainer}>
                      {chapter.exercises.map((exercise, index) => (
                        <TouchableOpacity
                          key={exercise.id}
                          style={styles.exerciseRow}
                          onPress={() => {
                            router.push({
                              pathname: "/student/StudentLearnScreen",
                              params: {
                                chapterId: chapter.id.toString(),
                                exerciseNr: (index + 1).toString(),
                                id: exercise.id.toString(),
                                title: exercise.title,
                                stars: exercise.stars.toString(),
                                answer: (exercise.answer ?? "").toString(),
                              },
                            });
                          }}
                        >
                          <Text style={styles.exerciseText}>
                            Exercise {index + 1}: {exercise.title}
                          </Text>
                          <View style={styles.starsWrapper}>
                            {Array.from({ length: exercise.stars }).map((_, i) => (
                              <Image
                                key={`star-${exercise.id}-${i}`}
                                source={require("@/assets/images/Star.png")}
                                style={styles.star}
                              />
                            ))}
                          </View>
                        </TouchableOpacity>
                      ))}
>>>>>>> Fahim2
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
<<<<<<< HEAD

=======
>>>>>>> Fahim2
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
<<<<<<< HEAD

=======
>>>>>>> Fahim2
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
<<<<<<< HEAD

=======
>>>>>>> Fahim2
  chaptersScroll: {
    flex: 1,
    marginLeft: "5%",
  },
  chaptersContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
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
<<<<<<< HEAD
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
  },
  highlightedExercise: {
    backgroundColor: "#EEFFD9",
=======
    elevation: 1,
>>>>>>> Fahim2
  },
  exerciseText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontFamily: "Poppins-Regular",
  },
<<<<<<< HEAD
  highlightedExerciseText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Poppins-Regular",
  },
=======
>>>>>>> Fahim2
  starsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginLeft: 6,
    width: 26,
    height: 26,
  },
<<<<<<< HEAD
=======
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
>>>>>>> Fahim2
});
