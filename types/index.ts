<<<<<<< HEAD
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn?: number; 
  }
    
export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: UserRole;
    created_at: Date;
  }
  
  export interface Category {
    id: number;
    title: string;
    color: string;
    icon_path: string;
  }
  
  export interface Chapter {
    id: number;
    category_id: number;
    title: string;
  }
  
  export interface Exercise {
    id: number;
    chapter_id: number;
    title: string;
    description: string;
    difficulty: ExerciseDifficulty;
    created_by: number; 
    created_at: Date;
  }
  
  export interface ExerciseAttempt {
    id: number;
    exercise_id: number;
    student_id: number;
    status: ExerciseStatus;
    attempts_count: number;
    hint_used_count: number;
    created_at: Date;
  }
  
  export interface StudentProgress {
    id: number;
    student_id: number;
    chapter_id: number;
    completed_exercises: number;
    success_rate: number;
    last_updated: Date;
  }
  
  export enum UserRole {
    STUDENT = 'student',
    TEACHER = 'teacher',
  }
  
  export enum ExerciseStatus {
    PASSED = 'passed',
    FAILED = 'failed',
  }
  
  export type ExerciseDifficulty = 1 | 2 | 3 | 4 | 5;
  
  // API Response Types
  export type SafeUser = Omit<User, 'password_hash'>;
  export type AuthResponse = {
    user: User;
    tokens: AuthTokens;
  };
  
  // Relationship Types
  export interface ExerciseWithRelations extends Exercise {
    chapter?: Chapter;
    created_by_user?: SafeUser;
  }
  
  export interface ChapterWithProgress extends Chapter {
    category?: Category;
    progress?: StudentProgress;
    exercises?: Exercise[];
  }
  
  export interface CategoryWithChapters extends Category {
    chapters?: Chapter[];
    completedChapters?: number;
  }
  
  export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface ExerciseAttemptPayload {
    exerciseId: number;
    studentAnswer: string;
    timeSpent: number;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
  }
=======
export interface User {
  id: number;
  name: string;
  code: string;
  role: UserRole;
  created_at: Date;
}

export interface Category {
  id: number;
  title: string;
  color: string;
  icon_path: string;
}

export interface Chapter {
  id: number;
  category_id: number;
  title: string;
}

export interface Exercise {
  id: number;
  chapter_id: number;
  title: string;
  description: string;
  difficulty: ExerciseDifficulty;
  created_by: number;
  created_at: Date;
}

export interface ExerciseAttempt {
  id: number;
  exercise_id: number;
  student_id: number;
  status: ExerciseStatus;
  attempts_count: number;
  hint_used_count: number;
  student_answer?: string;
  created_at: Date;
}

export interface StudentProgress {
  id: number;
  student_id: number;
  chapter_id: number;
  completed_exercises: number;
  success_rate: number;
  last_updated: Date;
}

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export enum ExerciseStatus {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}

export type ExerciseDifficulty = 1 | 2 | 3 | 4 | 5;

// API Response Types
export type SafeUser = Omit<User, 'code'>;

export type AuthResponse = {
  token: string;
  user: SafeUser;
};

// Relationship Types
export interface ExerciseWithRelations extends Exercise {
  chapter?: Chapter;
  created_by_user?: SafeUser;
}

export interface ChapterWithProgress extends Chapter {
  category?: Category;
  progress?: StudentProgress;
  exercises?: Exercise[];
}

export interface CategoryWithChapters extends Category {
  chapters?: Chapter[];
  completedChapters?: number;
}

export interface LoginPayload {
  name: string;
  code: string;
}

export interface SignupPayload {
  name: string;
  code: string;
  role: UserRole;
}

export interface ExerciseAttemptPayload {
  exerciseId: number;
  studentAnswer: string;
  timeSpent: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
>>>>>>> Fahim2
