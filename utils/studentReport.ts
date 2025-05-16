interface Benchmark {
  totalExercises: number;
  solvedExercises: number;
  successRate: number;
  avgAttempts: number;
  avgTime: string;
  hintsPerExercise: number;
  totalHints: number;
  totalAttempts: number;
  totalTime: number;
}

export const formatTime = (seconds: number): string => {
  if (!seconds) return 'N/A';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${seconds}s`;
  }
};

export const calculateBenchmarks = (data: any): Benchmark => {
  const totalExercises = data.chapters.reduce((acc: number, chapter: any) => 
    acc + (chapter.exercises?.length || 0), 0);
  const solvedExercises = data.chapters.reduce((acc: number, chapter: any) => 
    acc + (chapter.exercises?.filter((ex: any) => ex.attempts?.some((a: boolean) => a))?.length || 0), 0);
  
  // Calculate total attempts and check if any exercises were attempted
  const totalAttempts = data.chapters.reduce((acc: number, chapter: any) => 
    acc + chapter.exercises?.reduce((sum: number, ex: any) => sum + (ex.attempts?.length || 0), 0) || 0, 0);
  const attemptedExercises = data.chapters.reduce((acc: number, chapter: any) => 
    acc + (chapter.exercises?.filter((ex: any) => ex.attempts?.length > 0)?.length || 0), 0);

  // Only calculate rates if there are attempts
  const successRate = attemptedExercises > 0 ? 
    Number(((solvedExercises / attemptedExercises) * 100).toFixed(1)) : 0;
  const avgAttempts = attemptedExercises > 0 ? 
    Number((totalAttempts / attemptedExercises).toFixed(1)) : 0;

  // Calculate time metrics
  const totalTime = data.chapters.reduce((acc: number, chapter: any) => 
    acc + chapter.exercises?.reduce((sum: number, ex: any) => sum + (ex.timeTaken || 0), 0) || 0, 0);
  const avgTime = attemptedExercises > 0 ? 
    formatTime(Math.floor(totalTime / attemptedExercises)) : 'N/A';

  // Calculate hint metrics
  const totalHints = data.chapters.reduce((acc: number, chapter: any) => 
    acc + chapter.exercises?.reduce((sum: number, ex: any) => sum + (ex.hintsUsed || 0), 0) || 0, 0);
  const hintsPerExercise = attemptedExercises > 0 ? 
    Number((totalHints / attemptedExercises).toFixed(1)) : 0;

  return {
    totalExercises,
    solvedExercises,
    successRate,
    avgAttempts,
    avgTime,
    hintsPerExercise,
    totalHints,
    totalAttempts,
    totalTime
  };
};

export const getInsights = (benchmarks: Benchmark): string[] => {
  const insights = [];
  
  // Check if student has any activity
  if (benchmarks.totalExercises === 0) {
    insights.push("No exercises available yet.");
    return insights;
  }

  if (benchmarks.totalAttempts === 0) {
    insights.push("Student hasn't attempted any exercises yet.");
    return insights;
  }

  // Success rate insights (only for attempted exercises)
  const attemptedExercises = benchmarks.totalAttempts > 0 ? 
    Math.ceil(benchmarks.totalAttempts / benchmarks.avgAttempts) : 0;
  const successRate = attemptedExercises > 0 ? 
    Number(((benchmarks.solvedExercises / attemptedExercises) * 100).toFixed(1)) : 0;

  if (successRate >= 90) {
    insights.push("Outstanding performance! Student has mastered most attempted exercises.");
  } else if (successRate >= 75) {
    insights.push("Strong performance with good understanding of attempted concepts.");
  } else if (successRate >= 50) {
    insights.push("Moderate progress on attempted exercises. Some concepts need reinforcement.");
  } else {
    insights.push("Needs additional support on attempted exercises. Consider reviewing fundamental concepts.");
  }

  // Attempt efficiency insights (only for attempted exercises)
  if (benchmarks.totalAttempts === 0) {
    insights.push("No attempts made yet.");
  } else if (successRate === 0) {
    insights.push("No successful attempts yet. Consider reviewing the concepts.");
  } else if (benchmarks.avgAttempts <= 1.5) {
    insights.push("Excellent first-attempt success rate, showing strong comprehension.");
  } else if (benchmarks.avgAttempts <= 2.5) {
    insights.push("Good learning curve, typically solving within 2-3 attempts.");
  } else if (benchmarks.avgAttempts <= 3.5) {
    insights.push("Shows persistence but may benefit from more practice.");
  } else {
    insights.push("High number of attempts suggests challenging areas need attention.");
  }

  // Time management insights (only for attempted exercises)
  if (benchmarks.totalAttempts === 0) {
    insights.push("No time data available yet.");
  } else if (successRate === 0) {
    insights.push("Quick attempts but no success yet. Consider taking more time to understand the problems.");
  } else {
    const avgTimeInSeconds = benchmarks.avgTime.split(' ').reduce((total: number, part: string) => {
      if (part.includes('h')) return total + parseInt(part) * 3600;
      if (part.includes('m')) return total + parseInt(part) * 60;
      if (part.includes('s')) return total + parseInt(part);
      return total;
    }, 0);

    if (avgTimeInSeconds <= 60) {
      insights.push("Quick problem-solving indicates strong understanding.");
    } else if (avgTimeInSeconds <= 180) {
      insights.push("Reasonable time spent per exercise, showing good engagement.");
    } else {
      insights.push("Extended time per exercise may indicate need for additional support.");
    }
  }

  // Hint usage insights (only for attempted exercises)
  if (benchmarks.totalAttempts === 0) {
    insights.push("No hint usage data available yet.");
  } else if (successRate === 0) {
    insights.push("No successful attempts yet. Consider using hints to understand the concepts better.");
  } else if (benchmarks.hintsPerExercise <= 0.5) {
    insights.push("High independence in problem-solving, rarely needs hints.");
  } else if (benchmarks.hintsPerExercise <= 1) {
    insights.push("Moderate hint usage, shows good balance of independence and guidance.");
  } else {
    insights.push("Frequent hint usage suggests areas needing more direct instruction.");
  }

  // Add note about unstarted exercises if any
  const exercisesWithAttempts = benchmarks.totalAttempts > 0 ? 
    Math.ceil(benchmarks.totalAttempts / benchmarks.avgAttempts) : 0;
  const unstartedExercises = benchmarks.totalExercises - exercisesWithAttempts;
  if (unstartedExercises > 0) {
    insights.push(`${unstartedExercises} exercise${unstartedExercises > 1 ? 's' : ''} not attempted yet.`);
  }

  return insights;
}; 