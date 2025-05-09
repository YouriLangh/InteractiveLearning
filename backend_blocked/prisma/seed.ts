import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.exerciseAttempt.deleteMany();
  await prisma.studentProgress.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.user.deleteMany();

  // Create teachers
  const teacher1 = await prisma.user.create({
    data: {
      name: "Teacher One",
      code: "T123",
      role: "teacher",
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      name: "Teacher Two",
      code: "T456",
      role: "teacher",
    },
  });

  // Create students
  const student1 = await prisma.user.create({
    data: {
      name: "Student One",
      code: "S123",
      role: "student",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: "Student Two",
      code: "S456",
      role: "student",
    },
  });

  // Create chapters
  const chapter1 = await prisma.chapter.create({
    data: {
      title: "Introduction to Counting",
      order: 1,
    },
  });

  const chapter2 = await prisma.chapter.create({
    data: {
      title: "Basic Addition",
      order: 2,
    },
  });

  // Create exercises for chapter 1
  const exercise1 = await prisma.exercise.create({
    data: {
      title: "Build the number 17 with blocks",
      description: "Use the number blocks to build the number 17",
      difficulty: 1,
      chapterId: chapter1.id,
      createdBy: teacher1.id,
      visibleTo: "all",
      order: 1,
      stars: 2,
      answer: 17,
    },
  });

  const exercise2 = await prisma.exercise.create({
    data: {
      title: "Build the number 35 with blocks",
      description: "Use the number blocks to build the number 35",
      difficulty: 2,
      chapterId: chapter1.id,
      createdBy: teacher1.id,
      visibleTo: "all",
      order: 2,
      stars: 5,
      answer: 35,
    },
  });

  const exercise3 = await prisma.exercise.create({
    data: {
      title: "Build the number 215 with blocks",
      description: "Use the number blocks to build the number 215",
      difficulty: 3,
      chapterId: chapter1.id,
      createdBy: teacher1.id,
      visibleTo: "all",
      order: 3,
      stars: 3,
      answer: 215,
    },
  });

  // Create exercises for chapter 2
  const exercise4 = await prisma.exercise.create({
    data: {
      title: "Add the Dots",
      description: "Add the number of dots in both images",
      difficulty: 2,
      chapterId: chapter2.id,
      createdBy: teacher2.id,
      visibleTo: "all",
      order: 1,
      stars: 3,
      answer: 8,
    },
  });

  const exercise5 = await prisma.exercise.create({
    data: {
      title: "Add the Stars",
      description: "Add the number of stars in both images",
      difficulty: 3,
      chapterId: chapter2.id,
      createdBy: teacher2.id,
      visibleTo: "all",
      order: 2,
      stars: 1,
      answer: 4,
    },
  });

  // Create exercise attempts
  await prisma.exerciseAttempt.create({
    data: {
      status: "completed",
      attemptsCount: 1,
      hintUsedCount: 0,
      studentAnswer: "17",
      exerciseId: exercise1.id,
      studentId: student1.id,
    },
  });

  await prisma.exerciseAttempt.create({
    data: {
      status: "in_progress",
      attemptsCount: 2,
      hintUsedCount: 1,
      studentAnswer: "35",
      exerciseId: exercise2.id,
      studentId: student1.id,
    },
  });

  // Create student progress
  await prisma.studentProgress.create({
    data: {
      studentId: student1.id,
      chapterId: chapter1.id,
      completedExercises: 1,
      successRate: 0.5,
    },
  });

  await prisma.studentProgress.create({
    data: {
      studentId: student1.id,
      chapterId: chapter2.id,
      completedExercises: 0,
      successRate: 0.0,
    },
  });

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 