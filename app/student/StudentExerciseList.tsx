
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
import { useRouter } from "expo-router";
import BackgroundWrapper from "@/app/components/BackgroundWrapper";
import api from "@/services/api";

/* ====== Types ====== */
interface Exercise {
  id: number;
  title: string;
  stars: number;
  answer: number;
}

interface Chapter {
  id: number;
  title: string;
  exercises: Exercise[];
}

export default function StudentExerciseList() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const router = useRouter();

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
  }, []);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

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

  return (
    <BackgroundWrapper nav={true}>
      <View
        style={[
          styles.contentWrapper,
          isLandscape ? styles.landscape : styles.portrait,
        ]}
      >
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressLine, { borderColor: "#D16413", backgroundColor: "#FF8B45", height: "20%" }]} />
          <Image source={require("@/assets/images/mascott.png")} style={styles.mascot} />
          <View style={[styles.progressLine, { borderColor: "#ACACAC", backgroundColor: "#CACACA", height: "138%" }]} />
        </View>

        <ScrollView style={styles.chaptersScroll} contentContainerStyle={styles.chaptersContent}>
          {chaptersData.map((chapter) => {
            const isExpanded = expandedChapters[chapter.id] ?? true;
            return (
              <React.Fragment key={chapter.id}>
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
                                answer: exercise.answer.toString(),
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
    elevation: 1,
  },
  exerciseText: {
    flex: 1,
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
});
