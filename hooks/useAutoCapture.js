import React, { useState, useEffect } from "react";
import { Image, Text, View } from "react-native";
import RNFS from "react-native-fs";

export default function SnapshotViewer({ version }) {
  const [uri, setUri] = useState(null);
  const SNAPSHOT_PATH = `${RNFS.DocumentDirectoryPath}/snapshot-latest.jpg`;

  useEffect(() => {
    const loadImage = async () => {
      const exists = await RNFS.exists(SNAPSHOT_PATH);
      if (exists) {
        const cacheBustedUri = `file://${SNAPSHOT_PATH}?v=${version}`;
        setUri(cacheBustedUri);
      } else {
        console.warn("Snapshot file doesn't exist yet");
      }
    };

    loadImage();
  }, [version]); // <--- triggers re-run when version changes

  if (!uri) {
    return <Text style={{ padding: 10 }}>No snapshot available yet.</Text>;
  }

  return (
    <View style={{ paddingTop: 20 }}>
      <Image
        source={{ uri }}
        style={{ width: 300, height: 200, borderRadius: 10 }}
        resizeMode="contain"
      />
    </View>
  );
}
