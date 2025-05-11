import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get("window");

const mascotSize = width < 400 ? 32 : width < 600 ? 40 : 55;
const iconSize = width < 400 ? 24 : 32;
type Props = {
  role: "STUDENT" | "TEACHER";
};

export default function NavigationBar({ role }: Props) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  return (
    <View style={styles.navbarWrapper}>
      {/* Background Cubes */}
      <Image
        source={require("@/assets/images/Cube Asset.png")}
        style={styles.navCenterCube}
      />
      <Image
        source={require("@/assets/images/NavCubes.png")}
        style={styles.navCubeGroup}
      />

      {/* Navbar Content */}
      <View style={styles.navbar}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push("/")}
          >
            <Image
              source={require("@/assets/images/home.png")}
              style={[styles.icon, { width: iconSize, height: iconSize }]}
            />
          </TouchableOpacity>
        </View>

        {/* Center Mascot + Text (side-by-side) */}
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/Mascot.png")}
            style={[styles.mascot, { width: mascotSize, height: mascotSize }]}
          />
          <Text style={styles.centerText}>
            <Text style={[styles.textOrange, { fontFamily: "Poppins-Bold" }]}>
              Block
            </Text>
            <Text style={[styles.textGreen, { fontFamily: "Poppins-Bold" }]}>
              Ed
            </Text>
          </Text>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {user && role === "STUDENT" ? (
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Image
                source={require("@/assets/images/avatar.png")}
                style={{ width: 48, height: 48 }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.logOutContainer}
              onPress={handleLogout}
            >
              <Text style={styles.logOutText}>Log out</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Dropdown Menu */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={handleLogout}
            >
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarWrapper: {
    position: "relative",
    backgroundColor: "#fff7ec",
    width: "100%",
    height: 60,
    alignContent: "center",
    justifyContent: "center",
  },
  navbar: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  leftSection: {
    width: iconSize,
    alignItems: "flex-start",
  },
  rightSection: {
    position: "absolute",
    right: 20,
    // width: iconSize,
    alignItems: "flex-end",
  },
  homeButton: {
    zIndex: 10,
  },
  avatarButton: {
    zIndex: 10,
  },
  logOutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  logOutContainer: {
    backgroundColor: "rgba(87, 87, 87, 0.57)",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  avatar: {
    borderRadius: 20,
    resizeMode: "cover",
  },
  icon: {
    resizeMode: "contain",
    tintColor: "#3f7920",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "center",
  },
  mascot: {
    resizeMode: "contain",
  },
  centerText: {
    marginLeft: 8,
    fontSize: 26,
    fontWeight: "bold",
  },
  textOrange: {
    color: "#e47920",
  },
  textGreen: {
    color: "#3f7920",
  },
  bgTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: width * 0.3,
    height: 80,
    resizeMode: "contain",
    opacity: 0.4,
    zIndex: 0,
  },
  navCenterCube: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: 60,
    height: 60,
  },
  navCubeGroup: {
    position: "absolute",
    top: -20,
    right: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  dropdownMenu: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 120,
  },
  dropdownItem: {
    padding: 12,
    borderRadius: 4,
  },
  dropdownText: {
    color: "#333",
    fontSize: 16,
  },
});
