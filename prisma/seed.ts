import { prisma } from '../src/config/prisma';

async function main() {
    console.log('🌱 Seeding subjects...');

    // Check if subjects already exist
    const existingSubjects = await prisma.subject.count();
    
    if (existingSubjects > 0) {
        console.log('✅ Subjects already exist. Skipping seed.');
        return;
    }

    // Create published subjects
    const subjects = [
        {
            title: 'Full-Stack Development Masterclass',
            slug: 'full-stack-masterclass',
            description: 'Complete development roadmap covering frontend, backend, databases, and deployment strategies.',
            is_published: true,
        },
        {
            title: 'System Design Fundamentals',
            slug: 'system-design-fundamentals',
            description: 'Learn to design scalable distributed systems with real-world examples.',
            is_published: true,
        },
        {
            title: 'Data Structures & Algorithms',
            slug: 'dsa-bootcamp',
            description: 'Master DSA concepts essential for technical interviews and problem-solving.',
            is_published: true,
        },
    ];

    for (const subject of subjects) {
        await prisma.subject.create({
            data: subject,
        });
        console.log(`✅ Created: ${subject.title}`);
    }

    console.log('🎉 Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
