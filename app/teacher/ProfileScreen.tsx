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

<<<<<<< HEAD
// Temporary dummy list until we add a "list students" endpoint
const students = [
  { name: "John Doe" },
  { name: "Jane Doe" },
  { name: "Person X" },
  { name: "Person Y" },
  { name: "Person Z" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"students" | "chapters">("students");

  // Profile state
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ name: string; email: string }>("/users/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.message || "Failed to load profile"))
      .finally(() => setLoading(false));
=======
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
>>>>>>> Fahim2
  }, []);

  return (
    <BackgroundWrapper nav={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <ReturnButton />
<<<<<<< HEAD

        {/* Profile Header */}
        {loading ? (
          <Text style={styles.loadingText}>Loading profile…</Text>
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : profile ? (
          <View style={styles.profileHeader}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
        ) : null}

        {/* Tabs */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => {
              setActiveTab("students");
              router.push("/teacher/ProfileScreen");
            }}
          >
=======
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.push("/teacher/ProfileScreen")}>
>>>>>>> Fahim2
            <Text style={[styles.header, activeTab === "students" && styles.active]}>
              Students
            </Text>
          </TouchableOpacity>
<<<<<<< HEAD
          <TouchableOpacity
            onPress={() => {
              setActiveTab("chapters");
              router.push("/teacher/ChapterScreen");
            }}
          >
=======
          <TouchableOpacity onPress={() => router.push("/teacher/ChapterScreen")}>
>>>>>>> Fahim2
            <Text style={[styles.header, activeTab === "chapters" && styles.active]}>
              Chapters
            </Text>
          </TouchableOpacity>
        </View>

<<<<<<< HEAD
        {/* Students Grid */}
        <View style={styles.grid}>
          {students.map((student, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => router.push("/teacher/StudentDetailScreen")}
            >
              <Image
                source={require("@/assets/images/avatar.png")}
                style={styles.avatar}
              />
              <View style={styles.infoText}>
                <Text style={styles.name}>{student.name}</Text>
                <Text style={styles.label}>Exercises: --</Text>
                <Text style={styles.label}>Success Rate: --%</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
=======
        {loading ? (
          <Text>Loading students...</Text>
        ) : (
          <View style={styles.grid}>
            {students.map((student, index) => (
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
>>>>>>> Fahim2
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
<<<<<<< HEAD
  loadingText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "red",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 12,
=======
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 10,
>>>>>>> Fahim2
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFFFFF",
<<<<<<< HEAD
    width: width / 2 - 24,
=======
    width: "33%",
>>>>>>> Fahim2
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
<<<<<<< HEAD
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 1,
=======
>>>>>>> Fahim2
  },
  avatar: {
    width: 60,
    height: 60,
<<<<<<< HEAD
    marginRight: 12,
=======
    marginRight: 15,
    marginLeft: 8,
>>>>>>> Fahim2
    resizeMode: "contain",
  },
  infoText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
<<<<<<< HEAD
    color: "#333",
  },
  label: {
    fontSize: 14,
    color: "#333",
=======
    color: "black",
  },
  label: {
    fontSize: 14,
    color: "black",
>>>>>>> Fahim2
  },
});
