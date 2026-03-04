import { prisma } from '../src/config/prisma';

async function main() {
    console.log('🌱 Seeding course content (sections and lessons)...');

    // Find the Full-Stack Development subject
    const fullStackSubject = await prisma.subject.findUnique({
        where: { slug: 'full-stack-masterclass' },
    });

    if (!fullStackSubject) {
        console.log('❌ Full-Stack Development subject not found. Run seed.ts first.');
        return;
    }

    console.log(`✅ Found subject: ${fullStackSubject.title}`);

    // Check if sections already exist
    const existingSections = await prisma.section.count({
        where: { subject_id: fullStackSubject.id },
    });

    if (existingSections > 0) {
        console.log('✅ Sections already exist. Skipping seed.');
        return;
    }

    // Create Section 1: HTML Basics
    const htmlSection = await prisma.section.create({
        data: {
            subject_id: fullStackSubject.id,
            title: 'HTML Basics',
            order_index: 1,
        },
    });
    console.log(`✅ Created section: ${htmlSection.title}`);

    // Create lessons for HTML section
    await prisma.lesson.createMany({
        data: [
            {
                section_id: htmlSection.id,
                title: 'Introduction to HTML',
                video_url: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
                duration: 600, // 10 minutes
                position: 1,
                is_preview: true,
            },
            {
                section_id: htmlSection.id,
                title: 'HTML Elements & Tags',
                video_url: 'https://www.youtube.com/watch?v=p68sZ0kOCXw',
                duration: 900, // 15 minutes
                position: 2,
                is_preview: false,
            },
            {
                section_id: htmlSection.id,
                title: 'HTML Forms & Input Types',
                video_url: 'https://www.youtube.com/watch?v=fNcJuPIZ2WE',
                duration: 1200, // 20 minutes
                position: 3,
                is_preview: false,
            },
        ],
    });
    console.log('✅ Created 3 HTML lessons');

    // Create Section 2: CSS Fundamentals
    const cssSection = await prisma.section.create({
        data: {
            subject_id: fullStackSubject.id,
            title: 'CSS Fundamentals',
            order_index: 2,
        },
    });
    console.log(`✅ Created section: ${cssSection.title}`);

    // Create lessons for CSS section
    await prisma.lesson.createMany({
        data: [
            {
                section_id: cssSection.id,
                title: 'CSS Selectors & Specificity',
                video_url: 'https://www.youtube.com/watch?v=UzEVg5S-ubc',
                duration: 720, // 12 minutes
                position: 1,
                is_preview: true,
            },
            {
                section_id: cssSection.id,
                title: 'Flexbox Layout',
                video_url: 'https://www.youtube.com/watch?v=fYq5BXgJ4Ac',
                duration: 1080, // 18 minutes
                position: 2,
                is_preview: false,
            },
            {
                section_id: cssSection.id,
                title: 'CSS Grid Mastery',
                video_url: 'https://www.youtube.com/watch?v=jV8B24rKDnE',
                duration: 1500, // 25 minutes
                position: 3,
                is_preview: false,
            },
        ],
    });
    console.log('✅ Created 3 CSS lessons');

    // Create Section 3: JavaScript Essentials
    const jsSection = await prisma.section.create({
        data: {
            subject_id: fullStackSubject.id,
            title: 'JavaScript Essentials',
            order_index: 3,
        },
    });
    console.log(`✅ Created section: ${jsSection.title}`);

    // Create lessons for JavaScript section
    await prisma.lesson.createMany({
        data: [
            {
                section_id: jsSection.id,
                title: 'Variables & Data Types',
                video_url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
                duration: 840, // 14 minutes
                position: 1,
                is_preview: true,
            },
            {
                section_id: jsSection.id,
                title: 'Functions & Scope',
                video_url: 'https://www.youtube.com/watch?v=xUI5Tsl2JpY',
                duration: 960, // 16 minutes
                position: 2,
                is_preview: false,
            },
            {
                section_id: jsSection.id,
                title: 'Async/Await & Promises',
                video_url: 'https://www.youtube.com/watch?v=ZYb_ZU8LNxs',
                duration: 1140, // 19 minutes
                position: 3,
                is_preview: false,
            },
            {
                section_id: jsSection.id,
                title: 'DOM Manipulation',
                video_url: 'https://www.youtube.com/watch?v=y17RuWkWdn8',
                duration: 1020, // 17 minutes
                position: 4,
                is_preview: false,
            },
        ],
    });
    console.log('✅ Created 4 JavaScript lessons');

    // Create Section 4: Backend Development
    const backendSection = await prisma.section.create({
        data: {
            subject_id: fullStackSubject.id,
            title: 'Backend Development',
            order_index: 4,
        },
    });
    console.log(`✅ Created section: ${backendSection.title}`);

    // Create lessons for Backend section
    await prisma.lesson.createMany({
        data: [
            {
                section_id: backendSection.id,
                title: 'Node.js & Express Basics',
                video_url: 'https://www.youtube.com/watch?v=L72fhGm1tfE',
                duration: 1200, // 20 minutes
                position: 1,
                is_preview: false,
            },
            {
                section_id: backendSection.id,
                title: 'REST API Design',
                video_url: 'https://www.youtube.com/watch?v=pKd0Rpw7CE4',
                duration: 1080, // 18 minutes
                position: 2,
                is_preview: false,
            },
            {
                section_id: backendSection.id,
                title: 'Database Integration',
                video_url: 'https://www.youtube.com/watch?v=QwevGzVu_zk',
                duration: 1380, // 23 minutes
                position: 3,
                is_preview: false,
            },
        ],
    });
    console.log('✅ Created 3 Backend lessons');

    console.log('\n🎉 Course content seeding completed successfully!');
    console.log('📊 Summary:');
    console.log('   - 4 sections created');
    console.log('   - 13 lessons created');
    console.log('   - 4 preview lessons available');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
