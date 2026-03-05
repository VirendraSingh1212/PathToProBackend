import { prisma } from '../src/config/prisma';

async function main() {
    console.log('🌱 Seeding course content for ALL subjects...');

    // Get all published subjects
    const subjects = await prisma.subject.findMany({
        where: { is_published: true },
    });

    if (subjects.length === 0) {
        console.log('❌ No published subjects found. Run seed.ts first.');
        return;
    }

    console.log(`✅ Found ${subjects.length} published subjects`);

    // Seed content for each subject
    for (const subject of subjects) {
        await seedSubjectContent(subject);
    }

    console.log('\n🎉 All course content seeding completed!');
}

async function seedSubjectContent(subject: any) {
    console.log(`\n📚 Seeding: ${subject.title}`);

    // Check if sections already exist
    const existingSections = await prisma.section.count({
        where: { subject_id: subject.id },
    });

    if (existingSections > 0) {
        console.log(`   ✅ Content exists. Skipping.`);
        return;
    }

    // Seed based on subject slug
    switch (subject.slug) {
        case 'full-stack-masterclass':
            await seedFullStackContent(subject.id);
            break;
        case 'system-design-fundamentals':
            await seedSystemDesignContent(subject.id);
            break;
        case 'dsa-bootcamp':
            await seedDSAContent(subject.id);
            break;
        default:
            console.log(`   ⚠️  No content defined for: ${subject.slug}`);
    }
}

async function seedFullStackContent(subjectId: string) {
    console.log('   Creating Full-Stack sections...');

    // Section 1: HTML Basics
    const htmlSection = await prisma.section.create({
        data: {
            subject_id: subjectId,
            title: 'HTML Basics',
            order_index: 1,
        },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: htmlSection.id, title: 'HTML Introduction', video_url: 'https://www.youtube.com/embed/pQN-pnXPaVg', duration: 600, position: 1, is_preview: true },
            { section_id: htmlSection.id, title: 'HTML Tags Explained', video_url: 'https://www.youtube.com/embed/UB1O30fR-EE', duration: 900, position: 2, is_preview: false },
            { section_id: htmlSection.id, title: 'Forms and Inputs', video_url: 'https://www.youtube.com/embed/fNcJuPIZ2WE', duration: 1200, position: 3, is_preview: false },
        ],
    });

    // Section 2: CSS Fundamentals
    const cssSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'CSS Fundamentals', order_index: 2 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: cssSection.id, title: 'CSS Introduction', video_url: 'https://www.youtube.com/embed/1PnVor36_40', duration: 720, position: 1, is_preview: true },
            { section_id: cssSection.id, title: 'Flexbox Layout', video_url: 'https://www.youtube.com/embed/JJSoEo8JSnc', duration: 1080, position: 2, is_preview: false },
            { section_id: cssSection.id, title: 'Responsive Design', video_url: 'https://www.youtube.com/embed/srvUrASNj0s', duration: 1500, position: 3, is_preview: false },
        ],
    });

    // Section 3: JavaScript Essentials
    const jsSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'JavaScript Essentials', order_index: 3 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: jsSection.id, title: 'JavaScript Basics', video_url: 'https://www.youtube.com/embed/W6NZfCO5SIk', duration: 840, position: 1, is_preview: true },
            { section_id: jsSection.id, title: 'DOM Manipulation', video_url: 'https://www.youtube.com/embed/0ik6X4DJKCc', duration: 960, position: 2, is_preview: false },
            { section_id: jsSection.id, title: 'Async JavaScript', video_url: 'https://www.youtube.com/embed/PoRJizFvM7s', duration: 1140, position: 3, is_preview: false },
        ],
    });

    console.log('   ✅ Full-Stack content created (3 sections, 9 lessons)');
}

async function seedSystemDesignContent(subjectId: string) {
    console.log('   Creating System Design sections...');

    // Section 1: System Design Basics
    const basicsSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'System Design Basics', order_index: 1 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: basicsSection.id, title: 'What is System Design', video_url: 'https://www.youtube.com/embed/UzLMhqg3_Wc', duration: 600, position: 1, is_preview: true },
            { section_id: basicsSection.id, title: 'Client Server Architecture', video_url: 'https://www.youtube.com/embed/ZgdS0EUmn70', duration: 700, position: 2, is_preview: false },
            { section_id: basicsSection.id, title: 'Monolith vs Microservices', video_url: 'https://www.youtube.com/embed/CZ3wIuvmHeM', duration: 650, position: 3, is_preview: false },
            { section_id: basicsSection.id, title: 'Load Balancers Explained', video_url: 'https://www.youtube.com/embed/K0Ta65OqQkY', duration: 680, position: 4, is_preview: false },
        ],
    });

    // Section 2: Scalability Fundamentals
    const scalabilitySection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Scalability Fundamentals', order_index: 2 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: scalabilitySection.id, title: 'Vertical vs Horizontal Scaling', video_url: 'https://www.youtube.com/embed/xpDnVSmNFX0', duration: 720, position: 1, is_preview: true },
            { section_id: scalabilitySection.id, title: 'Database Scaling', video_url: 'https://www.youtube.com/embed/bUHFg8CZFws', duration: 840, position: 2, is_preview: false },
            { section_id: scalabilitySection.id, title: 'Replication and Sharding', video_url: 'https://www.youtube.com/embed/5faMjKuB9bc', duration: 900, position: 3, is_preview: false },
            { section_id: scalabilitySection.id, title: 'CAP Theorem', video_url: 'https://www.youtube.com/embed/k-Yaq8AHlFA', duration: 780, position: 4, is_preview: false },
        ],
    });

    // Section 3: Databases & Storage
    const dbSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Databases & Storage', order_index: 3 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: dbSection.id, title: 'SQL vs NoSQL', video_url: 'https://www.youtube.com/embed/QC3h-9t6w5o', duration: 660, position: 1, is_preview: true },
            { section_id: dbSection.id, title: 'Database Indexing', video_url: 'https://www.youtube.com/embed/FS1A1yS9OQ8', duration: 720, position: 2, is_preview: false },
            { section_id: dbSection.id, title: 'Data Partitioning', video_url: 'https://www.youtube.com/embed/tXH8rWqYcAU', duration: 780, position: 3, is_preview: false },
        ],
    });

    // Section 4: Caching & Performance
    const cacheSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Caching & Performance', order_index: 4 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: cacheSection.id, title: 'Caching Strategies', video_url: 'https://www.youtube.com/embed/6V9UkX7yVqA', duration: 840, position: 1, is_preview: false },
        ],
    });

    console.log('   ✅ System Design content created (4 sections, 12 lessons)');
}

async function seedDSAContent(subjectId: string) {
    console.log('   Creating DSA sections...');

    // Section 1: Arrays & Strings
    const arraysSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Arrays & Strings', order_index: 1 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: arraysSection.id, title: 'Introduction to Arrays', video_url: 'https://www.youtube.com/embed/QJNwK2uJyGs', duration: 600, position: 1, is_preview: true },
            { section_id: arraysSection.id, title: 'Two Pointer Technique', video_url: 'https://www.youtube.com/embed/JXk4C8vYbFQ', duration: 650, position: 2, is_preview: false },
            { section_id: arraysSection.id, title: 'Sliding Window', video_url: 'https://www.youtube.com/embed/MK-NZ4hN7rs', duration: 630, position: 3, is_preview: false },
        ],
    });

    // Section 2: Linked Lists
    const linkedListSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Linked Lists', order_index: 2 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: linkedListSection.id, title: 'Linked List Basics', video_url: 'https://www.youtube.com/embed/SMIq13-FZSE', duration: 720, position: 1, is_preview: true },
            { section_id: linkedListSection.id, title: 'Reverse Linked List', video_url: 'https://www.youtube.com/embed/O0By4Zq0OFc', duration: 660, position: 2, is_preview: false },
        ],
    });

    // Section 3: Trees
    const treeSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Trees', order_index: 3 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: treeSection.id, title: 'Binary Trees', video_url: 'https://www.youtube.com/embed/oSWTXtMglKE', duration: 780, position: 1, is_preview: true },
            { section_id: treeSection.id, title: 'Tree Traversal', video_url: 'https://www.youtube.com/embed/9RHO6jU--GU', duration: 840, position: 2, is_preview: false },
        ],
    });

    // Section 4: Graph Algorithms
    const graphSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Graph Algorithms', order_index: 4 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: graphSection.id, title: 'Graph BFS', video_url: 'https://www.youtube.com/embed/pcKY4hjDrxk', duration: 900, position: 1, is_preview: true },
            { section_id: graphSection.id, title: 'Graph DFS', video_url: 'https://www.youtube.com/embed/7fujbpJ0LB4', duration: 720, position: 2, is_preview: false },
        ],
    });

    console.log('   ✅ DSA content created (4 sections, 9 lessons)');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
