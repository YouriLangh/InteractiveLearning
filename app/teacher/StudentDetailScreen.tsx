// This is the screen where teachers can see detailed progress for a student
// Teachers can see how well the student is doing in each chapter and exercise
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import ReturnButton from '@/app/components/ui/ReturnButton';
import api from '@/services/api';
import { formatTime, calculateBenchmarks, getInsights } from '../../utils/studentReport';

const { width } = Dimensions.get('window');

export default function StudentDetailScreen() {
  const router = useRouter();
  const { studentId, studentName } = useLocalSearchParams();
  const studentIdStr = Array.isArray(studentId) ? studentId[0] : studentId;
  const [activeTab, setActiveTab] = useState('students');

  // Store student's progress data
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<{ [key: number]: boolean }>({});
  const [showReport, setShowReport] = useState(false);

  // Load student's progress when the screen opens
  useEffect(() => {
    const fetchStudentProgress = async () => {
      if (!studentIdStr) return;

      try {
        const response = await api.get(`/progress/${studentIdStr}`);
        console.log('Progress data:', response.data);
        
        // Sort chapters by ID (oldest first)
        const sortedData = {
          ...response.data,
          chapters: response.data.chapters.sort((a: any, b: any) => a.id - b.id)
        };
        
        setData(sortedData);

        // Show all chapters expanded by default
        const expandedMap: { [key: number]: boolean } = {};
        if (sortedData?.chapters) {
          sortedData.chapters.forEach((chapter: any) => {
            expandedMap[chapter.id] = true;
          });
        }
        setExpandedChapters(expandedMap);
      } catch (err) {
        console.error("Failed to fetch student progress", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProgress();
  }, [studentIdStr]);

  // Toggle chapter expansion
  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // Get background color for exercise based on attempts
  const getExerciseBackgroundColor = (attempts: boolean[]) => {
    if (!attempts || attempts.length === 0) return '#fff'; // Not started - white
    return attempts.some(attempt => attempt) ? '#e6ffe6' : '#fff'; // Solved - light green, others - white
  };

  // Get the last 3 attempts for an exercise
  const getLastAttempts = (attempts: boolean[]) => {
    if (!attempts || attempts.length === 0) return [];
    return attempts.slice(-3).map(attempt => attempt ? '✓' : '✗');
  };

  // Create HTML for the student's progress report
  const generateReportHTML = () => {
    const currentDate = new Date().toLocaleDateString();
    const totalExercises = data.chapters.reduce((acc: number, chapter: any) => 
      acc + (chapter.exercises?.length || 0), 0);
    const solvedExercises = data.chapters.reduce((acc: number, chapter: any) => 
      acc + (chapter.exercises?.filter((ex: any) => ex.attempts?.some((a: boolean) => a))?.length || 0), 0);
    const successRate = totalExercises > 0 ? ((solvedExercises / totalExercises) * 100).toFixed(1) : 0;

    // Create HTML with student's progress
    let html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .student-info { margin-bottom: 20px; }
            .summary { background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .chapter { margin-bottom: 20px; }
            .chapter-title { font-weight: bold; font-size: 18px; margin-bottom: 10px; }
            .exercise { margin-left: 20px; margin-bottom: 10px; }
            .exercise-title { font-weight: bold; }
            .stats { color: #666; font-size: 14px; }
            .success { color: #2E7D32; }
            .fail { color: #D32F2F; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Student Progress Report</h1>
            <p>Generated on ${currentDate}</p>
          </div>
          
          <div class="student-info">
            <h2>${studentName || "Student"}</h2>
          </div>

          <div class="summary">
            <h3>Overall Progress</h3>
            <p>Total Exercises: ${totalExercises}</p>
            <p>Solved Exercises: ${solvedExercises}</p>
            <p>Success Rate: ${successRate}%</p>
          </div>
    `;

    // Add each chapter's progress
    data.chapters.forEach((chapter: any) => {
      html += `
        <div class="chapter">
          <div class="chapter-title">${chapter.title}</div>
      `;

      // Add each exercise's details
      chapter.exercises?.forEach((exercise: any) => {
        const isSolved = exercise.attempts?.some((a: boolean) => a);
        const attempts = exercise.attempts?.length || 0;
        const timeTaken = formatTime(exercise.timeTaken);
        const hintsUsed = exercise.hintsUsed || 0;
        const recentAttempts = getLastAttempts(exercise.attempts || []);

        html += `
          <div class="exercise">
            <div class="exercise-title">
              ${exercise.title}
              ${isSolved ? '<span class="success"> (Solved)</span>' : ''}
            </div>
            <div class="stats">
              <p>Time taken: ${timeTaken}</p>
              <p>Hints used: ${hintsUsed}</p>
              <p>Total attempts: ${attempts}</p>
              ${recentAttempts.length > 0 ? `<p>Recent attempts: ${recentAttempts.join(' ')}</p>` : ''}
            </div>
          </div>
        `;
      });

      html += `</div>`;
    });

    html += `
          <div class="footer">
            <p>Generated by BlockEd Learning Platform</p>
          </div>
        </body>
      </html>
    `;

    return html;
  };

  // Show the progress report
  const handleShowReport = () => {
    setShowReport(true);
  };

  // Show loading screen while getting student data
  if (loading) {
    return (
      <BackgroundWrapper nav={true} role="TEACHER">
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading student progress...</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  // Show message if no data found
  if (!data || !data.chapters || data.chapters.length === 0) {
    return (
      <BackgroundWrapper nav={true} role="TEACHER">
        <View style={styles.centered}>
          <Text style={styles.noDataText}>No progress or exercises found for this student yet.</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper nav={true} role="TEACHER">
      <View style={styles.container}>
        {/* Top navigation bar */}
        <View style={styles.headerContainer}>
          <ReturnButton />
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={styles.tabButton} 
              onPress={() => router.push('/teacher/ProfileScreen')}
            >
              <Text style={[styles.tabText, activeTab === 'students' && styles.activeTab]}>
                Students
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tabButton}
              onPress={() => router.push('/teacher/ChapterScreen')}
            >
              <Text style={[styles.tabText, activeTab === 'chapters' && styles.activeTab]}>
                Chapters
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Student info and report button */}
          <View style={styles.topRow}>
            <Image
              source={require('@/assets/images/avatar.png')}
              style={styles.avatar}
            />
            <Text style={styles.name}>{studentName || "Student"}</Text>
            <TouchableOpacity 
              style={styles.printButton}
              onPress={handleShowReport}
            >
              <Text style={styles.printText}>View Report</Text>
            </TouchableOpacity>
          </View>

          {/* List of chapters and exercises */}
          {data.chapters.map((chapter: any) => (
            <View key={chapter.id} style={styles.chapterContainer}>
              {/* Chapter header with expand/collapse button */}
              <TouchableOpacity
                style={styles.chapterHeader}
                onPress={() => toggleChapter(chapter.id)}
              >
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                <Image
                  source={
                    expandedChapters[chapter.id]
                      ? require('@/assets/images/arrow-up.png')
                      : require('@/assets/images/arrow-down.png')
                  }
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>

              {/* Show exercises if chapter is expanded */}
              {expandedChapters[chapter.id] && (
                <View style={styles.exercisesContainer}>
                  {chapter.exercises?.map((exercise: any, index: number) => (
                    <React.Fragment key={exercise.id}>
                      {index > 0 && <View style={styles.separator} />}
                      <View style={styles.exerciseRow}>
                        <View style={[
                          styles.exerciseContent,
                          { backgroundColor: getExerciseBackgroundColor(exercise.attempts) }
                        ]}>
                          {/* Exercise title and solved status */}
                          <View style={styles.exerciseHeader}>
                            <Text style={styles.exerciseTitle}>
                              {exercise.title}
                            </Text>
                            {exercise.attempts?.some((attempt: boolean) => attempt) && (
                              <Text style={styles.solvedText}>Solved</Text>
                            )}
                          </View>

                          {/* Exercise details */}
                          <View style={styles.detailsRow}>
                            <Text style={styles.detailsText}>
                              Time taken: {formatTime(exercise.timeTaken)}
                            </Text>
                            <Text style={styles.detailsText}>
                              Hints used: {exercise.hintsUsed || 0}
                            </Text>
                            <Text style={styles.detailsText}>
                              Attempts: {exercise.attempts ? exercise.attempts.length : 0}
                            </Text>
                          </View>
                          {/* Show last 3 attempts */}
                          {exercise.attempts && exercise.attempts.length > 0 && (
                            <View style={styles.lastAttemptsRow}>
                              <Text style={styles.lastAttemptsLabel}>Recent attempts:</Text>
                              <View style={styles.lastAttemptsContainer}>
                                {getLastAttempts(exercise.attempts).map((symbol, index) => (
                                  <Text 
                                    key={index} 
                                    style={[
                                      styles.attemptSymbol,
                                      symbol === '✓' ? styles.successSymbol : styles.failSymbol
                                    ]}
                                  >
                                    {symbol}
                                  </Text>
                                ))}
                              </View>
                            </View>
                          )}
                        </View>
                      </View>
                    </React.Fragment>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Progress report popup */}
        <Modal
          visible={showReport}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowReport(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Report header with close button */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Student Progress Report</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowReport(false)}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.reportContent}>
                {/* Overall progress section */}
                <View style={styles.reportSection}>
                  <Text style={styles.sectionTitle}>Overall Progress</Text>
                  {(() => {
                    const benchmarks = calculateBenchmarks(data);
                    return (
                      <>
                        {/* Key metrics */}
                        <View style={styles.benchmarkGrid}>
                          <View style={styles.benchmarkItem}>
                            <Text style={styles.benchmarkValue}>{benchmarks.successRate}%</Text>
                            <Text style={styles.benchmarkLabel}>Success Rate</Text>
                          </View>
                          <View style={styles.benchmarkItem}>
                            <Text style={styles.benchmarkValue}>{benchmarks.avgAttempts}</Text>
                            <Text style={styles.benchmarkLabel}>Avg. Attempts</Text>
                          </View>
                          <View style={styles.benchmarkItem}>
                            <Text style={styles.benchmarkValue}>{benchmarks.avgTime}</Text>
                            <Text style={styles.benchmarkLabel}>Avg. Time</Text>
                          </View>
                          <View style={styles.benchmarkItem}>
                            <Text style={styles.benchmarkValue}>{benchmarks.hintsPerExercise}</Text>
                            <Text style={styles.benchmarkLabel}>Hints/Exercise</Text>
                          </View>
                        </View>

                        {/* Insights about student's performance */}
                        <View style={styles.insightsContainer}>
                          <Text style={styles.insightsTitle}>Key Insights</Text>
                          {getInsights(benchmarks).map((insight, index) => (
                            <View key={index} style={styles.insightItem}>
                              <Text style={styles.insightBullet}>•</Text>
                              <Text style={styles.insightText}>{insight}</Text>
                            </View>
                          ))}
                        </View>
                      </>
                    );
                  })()}
                </View>

                {/* Chapter progress section */}
                <View style={styles.reportSection}>
                  <Text style={styles.sectionTitle}>Chapter Progress</Text>
                  {data.chapters.map((chapter: any) => (
                    <View key={chapter.id} style={styles.chapterReport}>
                      <Text style={styles.chapterReportTitle}>{chapter.title}</Text>
                      {chapter.exercises?.map((exercise: any) => {
                        const isSolved = exercise.attempts?.some((a: boolean) => a);
                        return (
                          <View key={exercise.id} style={styles.exerciseReport}>
                            {/* Exercise title and solved status */}
                            <View style={styles.exerciseReportHeader}>
                              <Text style={styles.exerciseReportTitle}>{exercise.title}</Text>
                              {isSolved && (
                                <View style={styles.solvedBadge}>
                                  <Text style={styles.solvedBadgeText}>Solved</Text>
                                </View>
                              )}
                            </View>
                            {/* Exercise statistics */}
                            <View style={styles.exerciseStats}>
                              <Text style={styles.exerciseStat}>
                                Time: {formatTime(exercise.timeTaken)}
                              </Text>
                              <Text style={styles.exerciseStat}>
                                Attempts: {exercise.attempts?.length || 0}
                              </Text>
                              <Text style={styles.exerciseStat}>
                                Hints: {exercise.hintsUsed || 0}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </BackgroundWrapper>
  );
}

// Styles for making the screen look nice on all devices
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  activeTab: {
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  scrollContent: {
    padding: 25,
    paddingBottom: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
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
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  exerciseRow: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  exerciseTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
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
  lastAttemptsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  lastAttemptsLabel: {
    fontSize: 14,
    color: '#666',
  },
  lastAttemptsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  attemptSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  successSymbol: {
    color: '#2E7D32',
  },
  failSymbol: {
    color: '#D32F2F',
  },
  exerciseContent: {
    padding: 10,
    borderRadius: 8,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  solvedText: {
    color: '#2E7D32',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    height: '90%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  reportContent: {
    flex: 1,
  },
  reportSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  benchmarkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  benchmarkItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  benchmarkValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#487D33',
    marginBottom: 5,
  },
  benchmarkLabel: {
    fontSize: 14,
    color: '#666',
  },
  insightsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  insightBullet: {
    fontSize: 16,
    color: '#487D33',
    marginRight: 8,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  chapterReport: {
    marginBottom: 20,
  },
  chapterReportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  exerciseReport: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseReportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseReportTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  solvedBadge: {
    backgroundColor: '#e6ffe6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  solvedBadgeText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '500',
  },
  exerciseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  exerciseStat: {
    fontSize: 14,
    color: '#666',
  },
});
