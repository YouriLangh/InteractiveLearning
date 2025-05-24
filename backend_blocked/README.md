# Interactive Learning Backend

This is the backend for the Interactive Learning platform, built with **Express.js**, **Prisma ORM**, and **SQLite** (configurable).

---

## Database Structure

The database is managed using **Prisma**. Below is the relational schema:

![Class Diagram](class.png)

### Tables

#### 1. `User`
- `id` (PK)
- `name`
- `code` (part of compound UNIQUE with name)
- `role` (string)
- `createdAt`
- `updatedAt`

---

#### 2. `Chapter`
- `id` (PK)
- `title`
- `order` (for custom ordering)

---

#### 3. `Exercise`
- `id` (PK)
- `title`
- `description`
- `difficulty` (1–5)
- `chapterId` (FK → Chapter.id)
- `createdBy` (FK → User.id)
- `visibleTo` (string, for visibility control)
- `order` (for custom ordering)
- `stars` (for star rating display)
- `answer` (optional integer)

---

#### 4. `ExerciseAttempt`
- `id` (PK)
- `exerciseId` (FK → Exercise.id)
- `studentId` (FK → User.id)
- `status` (string)
- `attemptsCount`
- `hintUsedCount`
- `timeTaken` (optional, in seconds)
- `createdAt`
- `studentAnswer` (nullable string)

---

#### 5. `StudentProgress`
- `id` (PK)
- `studentId` (FK → User.id)
- `chapterId` (FK → Chapter.id)
- `completedExercises`
- `successRate`
- `lastUpdated`

---

> 💡 Note:
> - One `User` (Teacher) ➝ many `Exercise`s.
> - One `User` (Student) ➝ many `ExerciseAttempt`s.
> - Each `Exercise` ➝ belongs to one Teacher and one Chapter.
> - Each `ExerciseAttempt` ➝ connects one Student to one Exercise.
> - Each `StudentProgress` ➝ tracks a student's progress in a specific chapter.

---

## 🔧 Setup Instructions

1. Move the backend Dir:
```bash
cd backend_blocked
```

2. Install dependencies:
```bash
npm install
```

3. Setup your `.env` file :
```env
DATABASE_URL="file:./dev.db"
PORT=5000
JWT_SECRET=supersecret
```

4. Run Prisma migrations and generate client:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Ensure you have python on your local device and install the python dependencies (for CV):
```bash
pip install -r requirements.txt
```

6. Start the development server:
```bash
npm run dev
```

---

## API Endpoints

### 🔐 Auth
- `POST /api/auth/signup` — register as teacher or student.
- **Request Body:**
  ```json
  {
    "name": "Firas",
    "code": "12345",
    "role": "STUDENT"
  }
  ```

- `POST /api/auth/login` — authenticate and receive token.
- **Request Body:**
  ```json
  {
    "name": "Firas",
    "code": "12345",
    "role": "STUDENT"
  }
  ```

### 👤 User
- `GET /api/user/profile` — get current user profile (auth required)
- `PUT /api/user/profile` — update user profile (auth required)
  - **Request Body:**
    ```json
    {
      "name": "New Name"
    }
    ```
- `GET /api/user/students` — get all students (teacher only)

### 📖 Chapters
- `GET /api/chapter/` — get all chapters with exercises
- `GET /api/chapter/:id` — get chapter by id with exercises
- `POST /api/chapter/` — create chapter (teacher only)
  - **Request Body:**
    ```json
    {
      "title": "Chapter Title"
    }
    ```
- `PUT /api/chapter/:id` — update chapter (teacher only)
  - **Request Body:**
    ```json
    {
      "title": "Updated Title"
    }
    ```
- `DELETE /api/chapter/:id` — delete chapter (teacher only)
- `PUT /api/chapter/:id/order` — update chapter order (teacher only)
  - **Request Body:**
    ```json
    { "order": 3 }
    ```

### 📝 Exercises
- `GET /api/exercise/:id` — get exercise by id
- `GET /api/exercise/chapter/:chapterId` — get exercises by chapter
- `POST /api/exercise/` — create exercise (teacher only)
  - **Request Body:**
    ```json
    {
      "title": "Exercise Title",
      "description": "Exercise Description",
      "difficulty": 3,
      "chapterId": 1,
      "visibleTo": "ALL",
      "stars": 0,
      "order": 0
    }
    ```
- `PUT /api/exercise/:id` — update exercise (teacher only)
  - **Request Body:**
    ```json
    {
      "title": "Updated Title",
      "description": "Updated Description",
      "difficulty": 4,
      "visibleTo": "TEACHERS_ONLY",
      "stars": 5,
      "order": 1
    }
    ```
- `DELETE /api/exercise/:id` — delete exercise (teacher only)
- `PUT /api/exercise/:id/order` — update exercise order (teacher only)
  - **Request Body:**
    ```json
    { "order": 1 }
    ```
- `PUT /api/exercise/:id/visibility` — update exercise visibility (teacher only)
  - **Request Body:**
    ```json
    { "visibleTo": "ALL" }
    ```
- `PUT /api/exercise/:id/stars` — update exercise stars (teacher only)
  - **Request Body:**
    ```json
    { "stars": 5 }
    ```

### 🎯 Exercise Attempts
- `POST /api/exercise-attempt/` — create new attempt (student only)
  - **Request Body:**
    ```json
    { "exerciseId": "1" }
    ```
- `GET /api/exercise-attempt/:id` — get specific attempt
- `GET /api/exercise-attempt/exercise/:exerciseId` — get attempts by exercise (student only)
- `GET /api/exercise-attempt/student/:studentId` — get attempts by student (teacher or self)
- `PUT /api/exercise-attempt/:id/answer` — submit student answer
  - **Request Body:**
    ```json
    {
      "answer": "42",
      "isCorrect": true,
      "timeTaken": 120,
      "isCleanup": false
    }
    ```

### 📈 Student Progress
- `GET /api/progress/:studentId/chapter/:chapterId` — get student progress (teacher or self)
- `GET /api/progress/:studentId` — get full student progress across all chapters
- `GET /api/progress/:studentId/success-rate` — get student's overall success rate
- `PUT /api/progress/:studentId/chapter/:chapterId` — update student progress (student only)
  - **Request Body:**
    ```json
    {
      "completedExercises": 5,
      "successRate": 80
    }
    ```

### 📸 Image Processing
- `POST /api/upload/solve` — process and analyze uploaded image
  - **Request Body:**
    ```json
    {
      "image": "base64_encoded_image",
      "fileType": "image/png",
      "answer": 5
    }
    ```

---
