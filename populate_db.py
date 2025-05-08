import sqlite3
import random
from datetime import datetime

# DB path (same as Prisma uses -> adjust if needed)
DB_PATH = "./backend_blocked/prisma/dev.db"

# Connect to SQLite
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Create dummy Teachers
teacher_ids = []
for i in range(1, 6):
    name = f"Teacher{i}"
    code = f"CODE{i:03}"
    role = "TEACHER"
    createdAt = datetime.now().isoformat()
    updatedAt = datetime.now().isoformat()
    
    cursor.execute("""
        INSERT INTO User (name, code, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)
    """, (name, code, role, createdAt, updatedAt))
    
    teacher_ids.append(cursor.lastrowid)

print(f"Inserted {len(teacher_ids)} teachers.")

# Create Chapters
chapter_ids = []
for i in range(1, 11):
    title = f"Chapter {i}"
    order = i
    
    cursor.execute("""
        INSERT INTO Chapter (title, "order") VALUES (?, ?)
    """, (title, order))
    
    chapter_ids.append(cursor.lastrowid)

print(f"Inserted {len(chapter_ids)} chapters.")

# Create Exercises for each Chapter
for chapter_id in chapter_ids:
    for i in range(1, 6):
        title = f"Exercise {i} for Chapter {chapter_id}"
        description = f"This is exercise {i} for chapter {chapter_id}."
        difficulty = random.randint(1, 5)
        createdBy = random.choice(teacher_ids)
        visibleTo = "ALL"
        order = i
        stars = random.randint(0, 5)
        createdAt = datetime.now().isoformat()

        cursor.execute("""
            INSERT INTO Exercise (title, description, difficulty, chapterId, createdBy, visibleTo, "order", stars) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (title, description, difficulty, chapter_id, createdBy, visibleTo, order, stars))


print("Inserted exercises for all chapters.")

# Commit and close
conn.commit()
conn.close()

print("✅ Database populated successfully!")
