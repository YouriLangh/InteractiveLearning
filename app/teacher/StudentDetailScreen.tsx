import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import ReturnButton from '@/app/components/ui/ReturnButton';


const { width } = Dimensions.get('window');


const data = {
  name: 'John',
  avatarColor: '#FFD28E', 
  chapters: [
    {
      title: 'Chapter 1: Numbers',
      expanded: false,
      exercises: [
        {
          id: 1,
          title: 'Exercise 1: Make the number 21 using blocks.',
          timeTaken: '13m20s',
          hintsUsed: 10,
          attempts: [false, false, false, true],
        },
        {
          id: 2,
          title: 'Exercise 2: Make the number 35 using blocks.',
          timeTaken: '',
          hintsUsed: 0,
          attempts: [],
        },
        {
          id: 3,
          title: 'Exercise 3: Make the number 215 using blocks.',
          timeTaken: '',
          hintsUsed: 0,
          attempts: [],
        },
      ],
    },
    {
      title: 'Chapter 2: Addition',
      expanded: false,
      exercises: [
        {
          id: 1,
          title: 'Exercise 1: Use blocks to solve 2 + 15.',
          timeTaken: '10m45s',
          hintsUsed: 5,
          attempts: [false, true],
        },
        {
          id: 2,
          title: 'Exercise 2: Another addition problem.',
          timeTaken: '',
          hintsUsed: 0,
          attempts: [],
        },
      ],
    },
  ],
};

export default function StudentDetailScreen() {

  const [chapters, setChapters] = useState(data.chapters);


  const toggleChapter = (index: number) => {
    const updated = [...chapters];
    updated[index].expanded = !updated[index].expanded;
    setChapters(updated);
  };

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
      <ReturnButton />

        <View style={styles.topRow}>
          <Image
            source={require('@/assets/images/avatar.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{data.name}</Text>
          <TouchableOpacity style={styles.printButton}>
            <Text style={styles.printText}>Print Report</Text>
          </TouchableOpacity>
        </View>


        {chapters.map((chapter, cIndex) => {
          const isExpanded = chapter.expanded;
          return (
            <View key={cIndex} style={styles.chapterContainer}>

              <TouchableOpacity
                style={styles.chapterHeader}
                onPress={() => toggleChapter(cIndex)}
              >
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                <Image
                  source={
                    isExpanded
                      ? require('@/assets/images/arrow-up.png')
                      : require('@/assets/images/arrow-down.png')
                  }
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>


              {isExpanded && (
                <View style={styles.exercisesContainer}>
                  {chapter.exercises.map((ex, eIndex) => {
                    const isFirst = eIndex === 0;
                    return (
                      <View
                        key={ex.id}
                        style={[
                          styles.exerciseRow,
                          isFirst && styles.highlightedExercise,
                        ]}
                      >
                        <Text
                          style={[
                            styles.exerciseTitle,
                            isFirst && styles.highlightedExerciseText,
                          ]}
                        >
                          {ex.title}
                        </Text>


                        {isFirst && (
                          <View style={styles.detailsRow}>
                            <Text style={styles.detailsText}>
                              Time taken: {ex.timeTaken || 'N/A'}
                            </Text>
                            <Text style={styles.detailsText}>
                              Hints used: {ex.hintsUsed}
                            </Text>
                            <View style={styles.attemptsContainer}>
                              <Text style={styles.detailsText}>Attempts: </Text>
                              {ex.attempts.length > 0 ? (
                                ex.attempts.map((attempt, i) => (
                                  <Text
                                    key={i}
                                    style={[
                                      styles.attemptIcon,
                                      { color: attempt ? 'green' : 'red' },
                                    ]}
                                  >
                                    {attempt ? '✓' : '✕'}
                                  </Text>
                                ))
                              ) : (
                                <Text style={styles.detailsText}>None</Text>
                              )}
                            </View>
                          </View>
                        )}


                        {!isFirst && (
                          <View style={styles.nonFirstDetails}>
                            <Text style={styles.hintText}>
                              {ex.attempts.length > 0
                                ? `Attempts: ${ex.attempts
                                    .map((a) => (a ? '✓' : '✕'))
                                    .join(', ')}`
                                : 'No attempts yet'}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingBottom: 60,
  },


  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    marginRight: 12,
  },
  name: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
  },
  printButton: {
    backgroundColor: '#487D33',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  printText: {
    color: 'white',
    fontWeight: 'bold',
  },


  chapterContainer: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  arrowIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },


  exercisesContainer: {
    marginTop: 6,
  },
  exerciseRow: {
    backgroundColor: '#fff',
    marginVertical: 4,
    borderRadius: 8,
    padding: 10,
  },
  highlightedExercise: {
    backgroundColor: '#E9FBD5', 
  },
  exerciseTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  highlightedExerciseText: {
    color: '#333',
  },
  detailsRow: {
    flexDirection: 'column',
    marginTop: 4,
  },
  detailsText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  attemptsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attemptIcon: {
    fontSize: 16,
    marginLeft: 4,
  },

  nonFirstDetails: {
    marginTop: 2,
  },
  hintText: {
    fontSize: 13,
    color: '#666',
  },
});
