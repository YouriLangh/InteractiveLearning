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
import ReturnButton from "@/app/components/ui/ReturnButton";
import api from "@/services/api";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/users/students");
        setStudents(response.data);
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

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push("/teacher/AddStudentScreen")}
          >
            <Text style={styles.addButtonText}>+ Add Student</Text>
          </TouchableOpacity>
        </View>

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
                <TouchableOpacity style={styles.avatar}>
                  <Image
                    source={require("@/assets/images/avatar.png")}
                    style={styles.avatar}
                  />
                </TouchableOpacity>
                <View style={styles.infoText}>
                  <Text style={styles.name}>{student.name}</Text>
                  <Text style={styles.label}>Exercise</Text>
                  <Text style={styles.label}>Success Rate</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </BackgroundWrapper>
  );
}

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
