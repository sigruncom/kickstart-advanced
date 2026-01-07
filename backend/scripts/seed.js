import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import db from '../db/init.js';

dotenv.config();

console.log('🌱 Seeding database...');

// Create default admin user
const adminEmail = process.env.ADMIN_EMAIL || 'admin@sigrun.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync(adminPassword, 10);
    const adminId = uuidv4();

    db.prepare(`
    INSERT INTO users (id, email, password_hash, name, role)
    VALUES (?, ?, ?, 'Administrator', 'admin')
  `).run(adminId, adminEmail, passwordHash);

    console.log(`✅ Admin user created: ${adminEmail}`);
} else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
}

// Create sample students for testing
const sampleStudents = [
    { email: 'student1@example.com', name: 'Sarah Miller', cohort: 'January 2026' },
    { email: 'student2@example.com', name: 'Maike Schmidt', cohort: 'January 2026' },
    { email: 'completed@example.com', name: 'Britta Weber', cohort: 'October 2025', role: 'completed_student' }
];

const insertStudent = db.prepare(`
  INSERT OR IGNORE INTO users (id, email, password_hash, name, role, cohort)
  VALUES (?, ?, ?, ?, ?, ?)
`);

sampleStudents.forEach(student => {
    const passwordHash = bcrypt.hashSync('Student123!', 10);
    insertStudent.run(
        uuidv4(),
        student.email,
        passwordHash,
        student.name,
        student.role || 'active_student',
        student.cohort
    );
});

console.log('✅ Sample students created');

// Set up initial content schedule (Week 1 released, rest weekly)
const scheduleInsert = db.prepare(`
  INSERT OR IGNORE INTO content_schedule (id, week_index, release_date, is_released)
  VALUES (?, ?, ?, ?)
`);

const startDate = new Date('2026-01-06'); // Program start
for (let week = 0; week < 12; week++) {
    const releaseDate = new Date(startDate);
    releaseDate.setDate(releaseDate.getDate() + (week * 7));
    scheduleInsert.run(uuidv4(), week, releaseDate.toISOString(), week === 0 ? 1 : 0);
}

console.log('✅ Content schedule initialized');
console.log('🎉 Database seeding complete!');
console.log(`\n📝 Login credentials:`);
console.log(`   Admin: ${adminEmail} / ${adminPassword}`);
console.log(`   Student: student1@example.com / Student123!`);
