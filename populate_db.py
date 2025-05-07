
import sqlite3
from datetime import datetime

# Path to your SQLite DB file (update if needed)
DB_PATH = "./backend_blocked/prisma/dev.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# 1️⃣ Insert Dummy Category (required because Chapter has categoryId)
cursor.execute("""
INSERT INTO Category (title, color, iconPath, "order")
VALUES (?, ?, ?, ?)
""", ("General", "#FFFFFF", "/icons/general.png", 0))
category_id = cursor.lastrowid
print(f"Inserted Category with id {category_id}")

# 2️⃣ Insert Dummy User (required because Exercise has createdBy)
cursor.execute("""
INSERT INTO User (name, email, passwordHash, role, createdAt)
VALUES (?, ?, ?, ?, ?)
""", ("Admin User", "admin@example.com", "dummyhash", "admin", datetime.now()))
user_id = cursor.lastrowid
print(f"Inserted User with id {user_id}")

# 3️⃣ Insert Chapters (linked to category_id)
chapters = [
    ("Chapter 1: Numbers", 0),
    ("Chapter 2: Addition", 1),
    ("Chapter 3: Subtraction", 2),
    ("Chapter 4: Multiplication", 3),
]

chapter_ids = []
for title, order in chapters:
    cursor.execute("""
    INSERT INTO Chapter (title, categoryId, "order")
    VALUES (?, ?, ?)
    """, (title, category_id, order))
    chapter_ids.append(cursor.lastrowid)

print("Inserted Chapters:", chapter_ids)

# 4️⃣ Insert Exercises (linked to chapters)
exercises = [
    # Chapter 1
    (chapter_ids[0], "Build the number 17 with blocks.", "Build the number 17 with blocks.", 1, user_id, "student", 0, 2),
    (chapter_ids[0], "Build the number 35 with blocks.", "Build the number 35 with blocks.", 2, user_id, "student", 1, 5),
    (chapter_ids[0], "Build the number 215 with blocks.", "Build the number 215 with blocks.", 3, user_id, "student", 2, 3),
    
    # Chapter 2
    (chapter_ids[1], "What is 15 + 6?", "Calculate 15 + 6.", 1, user_id, "student", 0, 0),
    (chapter_ids[1], "What is 20 + 15?", "Calculate 20 + 15.", 1, user_id, "student", 1, 0),
    (chapter_ids[1], "What is 120 + 95?", "Calculate 120 + 95.", 2, user_id, "student", 2, 0),

    # Chapter 3
    (chapter_ids[2], "What is 50 - 29?", "Calculate 50 - 29.", 1, user_id, "student", 0, 0),
    (chapter_ids[2], "What is 70 - 35?", "Calculate 70 - 35.", 2, user_id, "student", 1, 0),
    (chapter_ids[2], "What is 300 - 85?", "Calculate 300 - 85.", 3, user_id, "student", 2, 0),

    # Chapter 4
    (chapter_ids[3], "What is 3 × 7?", "Calculate 3 × 7.", 1, user_id, "student", 0, 0),
    (chapter_ids[3], "What is 5 × 7?", "Calculate 5 × 7.", 2, user_id, "student", 1, 0),
    (chapter_ids[3], "What is 43 × 5?", "Calculate 43 × 5.", 3, user_id, "student", 2, 0),
]

cursor.executemany("""
INSERT INTO Exercise (chapterId, title, description, difficulty, createdBy, visibleTo, "order", stars)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
""", exercises)

print("Inserted Exercises")

# Commit and close
conn.commit()
conn.close()
print("✅ Done populating database.")
