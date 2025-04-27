import React, { useState } from "react";
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

const { width } = Dimensions.get("window");

const students = [
  { name: "John Doe" },
  { name: "Jane Doe" },
  { name: "Person X" },
  { name: "Person X" },
  { name: "Person X" },
  { name: "Person X" },
  { name: "Person X" },
  { name: "Person X" },
  { name: "Person X" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("students");

  return (
    <BackgroundWrapper nav={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <ReturnButton />
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

        <View style={styles.grid}>
          {students.map((student, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => router.push("/teacher/StudentDetailScreen")}
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

  addButton: {
    backgroundColor: "#A4C8F0",
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
});
