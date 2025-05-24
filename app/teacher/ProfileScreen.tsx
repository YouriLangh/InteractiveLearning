// This is the teacher's profile screen where they can see all their students
// Teachers can see each student's success rate and add new students
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import BackgroundWrapper from "@/app/components/BackgroundWrapper";
import api from "@/services/api";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all students and their progress when the screen opens
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Get all students
        const response = await api.get("/users/students");
        // Get progress for each student
        const studentsWithProgress = await Promise.all(
          response.data.map(async (student: any) => {
            try {
              const progressResponse = await api.get(`/progress/${student.id}`);
              const progress = progressResponse.data;
              
              // Calculate how well the student is doing
              const totalExercises = progress.chapters.reduce((acc: number, chapter: any) => 
                acc + (chapter.exercises?.length || 0), 0);
              const solvedExercises = progress.chapters.reduce((acc: number, chapter: any) => 
                acc + (chapter.exercises?.filter((ex: any) => ex.attempts?.some((a: boolean) => a))?.length || 0), 0);
              const attemptedExercises = progress.chapters.reduce((acc: number, chapter: any) => 
                acc + (chapter.exercises?.filter((ex: any) => ex.attempts?.length > 0)?.length || 0), 0);
              const successRate = attemptedExercises > 0 ? 
                Number(((solvedExercises / attemptedExercises) * 100).toFixed(1)) : 0;

              return {
                ...student,
                successRate
              };
            } catch (err) {
              console.error(`Failed to fetch progress for student ${student.id}`, err);
              return {
                ...student,
                successRate: 0
              };
            }
          })
        );
        setStudents(studentsWithProgress);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <BackgroundWrapper nav={true} role={"TEACHER"}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top navigation bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.push("/teacher/ProfileScreen")}
          >
            <Text
              style={[styles.header, activeTab === "students" && styles.active]}
            >
              Students
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/teacher/ChapterScreen")}
          >
            <Text
              style={[styles.header, activeTab === "chapters" && styles.active]}
            >
              Chapters
            </Text>
          </TouchableOpacity>
        </View>

        {/* Button to add a new student */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push("/teacher/AddStudentScreen")}
          >
            <Text style={styles.addButtonText}>+ Add Student</Text>
          </TouchableOpacity>
        </View>

        {/* Show loading message while getting student data */}
        {loading ? (
          <View style={styles.centered}>
            <Text style={styles.loadingText}>Loading students...</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {students.map((student) => (
              <TouchableOpacity
                key={student.id}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/teacher/StudentDetailScreen",
                    params: {
                      studentId: student.id.toString(),
                      studentName: student.name,
                    },
                  })
                }
              >
                {/* Student avatar */}
                <TouchableOpacity style={styles.avatar}>
                  <Image
                    source={require("@/assets/images/avatar.png")}
                    style={styles.avatar}
                  />
                </TouchableOpacity>
                {/* Student name and success rate */}
                <View style={styles.infoText}>
                  <Text style={styles.name}>{student.name}</Text>
                  <Text style={styles.label}>Success Rate: {student.successRate}%</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </BackgroundWrapper>
  );
}

// Styles for making the screen look nice on all devices
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    color: "#555",
  },
  active: {
    color: "#000",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  addButton: {
    backgroundColor: "#85E585",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: "33%",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 15,
    marginLeft: 8,
    resizeMode: "contain",
  },
  infoText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  label: {
    fontSize: 14,
    color: "black",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: {
    fontSize: 18,
    color: "#555",
  },
});
