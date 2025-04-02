import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import { useRouter } from 'expo-router';
import ReturnButton from '@/app/components/ui/ReturnButton';



const categories = [
  {
    title: 'MATH',
    color: '#FFBEB0',
    image: require('@/assets/images/board.png'),
  },
  {
    title: 'LOGIC',
    color: '#B0D9FF',
    image: require('@/assets/images/boxgroup.png'),
  },
  {
    title: 'GEOMETRY',
    color: '#C5D8A4',
    image: require('@/assets/images/board.png'),
  },
  {
    title: 'MEMORY',
    color: '#F4A9D9',
    image: require('@/assets/images/boxgroup.png'),
  },
];

export default function StudentCategoryScreen() {

  const router = useRouter();
  
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const containerPadding = 20;
  const gap = 20;
  

  let cardWidth;
  if (isLandscape) {
    const availableWidth = width - containerPadding * 2;
    const numColumns = Math.floor(availableWidth / 300) || 1;
    cardWidth = (availableWidth - (numColumns - 1) * gap) / numColumns;
  } else {
    cardWidth = width * 0.9;
  }

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <ReturnButton />
        <View
          style={[
            styles.cardRow,
            {
              flexDirection: isLandscape ? 'row' : 'column',
              flexWrap: isLandscape ? 'wrap' : 'nowrap',
              gap: gap,
            },
          ]}
        >
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: cat.color, width: cardWidth }]}
              onPress={index === 0 ? () => router.push('/student/StudentExerciseList') : undefined}

            >
              <Text style={styles.cardTitle}>{cat.title}</Text>
              <View style={styles.imageBox}>
                <Image source={cat.image} style={styles.cardImage} />
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
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRow: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    borderRadius: 10,
    padding: '5%',
    maxWidth: 350,
    aspectRatio: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: 'white',
    marginBottom: '5%',
  },
  imageBox: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
});