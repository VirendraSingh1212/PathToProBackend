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

    const htmlSection = await prisma.section.create({
        data: {
            subject_id: subjectId,
            title: 'HTML Basics',
            order_index: 1,
        },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: htmlSection.id, title: 'Introduction to HTML', video_url: 'https://www.youtube.com/watch?v=UB1O30fR-EE', duration: 600, position: 1, is_preview: true },
            { section_id: htmlSection.id, title: 'HTML Elements & Tags', video_url: 'https://www.youtube.com/watch?v=p68sZ0kOCXw', duration: 900, position: 2, is_preview: false },
            { section_id: htmlSection.id, title: 'HTML Forms & Input Types', video_url: 'https://www.youtube.com/watch?v=fNcJuPIZ2WE', duration: 1200, position: 3, is_preview: false },
        ],
    });

    const cssSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'CSS Fundamentals', order_index: 2 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: cssSection.id, title: 'CSS Selectors & Specificity', video_url: 'https://www.youtube.com/watch?v=UzEVg5S-ubc', duration: 720, position: 1, is_preview: true },
            { section_id: cssSection.id, title: 'Flexbox Layout', video_url: 'https://www.youtube.com/watch?v=fYq5BXgJ4Ac', duration: 1080, position: 2, is_preview: false },
            { section_id: cssSection.id, title: 'CSS Grid Mastery', video_url: 'https://www.youtube.com/watch?v=jV8B24rKDnE', duration: 1500, position: 3, is_preview: false },
        ],
    });

    const jsSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'JavaScript Essentials', order_index: 3 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: jsSection.id, title: 'Variables & Data Types', video_url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', duration: 840, position: 1, is_preview: true },
            { section_id: jsSection.id, title: 'Functions & Scope', video_url: 'https://www.youtube.com/watch?v=xUI5Tsl2JpY', duration: 960, position: 2, is_preview: false },
            { section_id: jsSection.id, title: 'Async/Await & Promises', video_url: 'https://www.youtube.com/watch?v=ZYb_ZU8LNxs', duration: 1140, position: 3, is_preview: false },
            { section_id: jsSection.id, title: 'DOM Manipulation', video_url: 'https://www.youtube.com/watch?v=y17RuWkWdn8', duration: 1020, position: 4, is_preview: false },
        ],
    });

    const backendSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Backend Development', order_index: 4 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: backendSection.id, title: 'Node.js & Express Basics', video_url: 'https://www.youtube.com/watch?v=L72fhGm1tfE', duration: 1200, position: 1, is_preview: false },
            { section_id: backendSection.id, title: 'REST API Design', video_url: 'https://www.youtube.com/watch?v=pKd0Rpw7CE4', duration: 1080, position: 2, is_preview: false },
            { section_id: backendSection.id, title: 'Database Integration', video_url: 'https://www.youtube.com/watch?v=QwevGzVu_zk', duration: 1380, position: 3, is_preview: false },
        ],
    });

    console.log('   ✅ Full-Stack content created (4 sections, 13 lessons)');
}

async function seedSystemDesignContent(subjectId: string) {
    console.log('   Creating System Design sections...');

    // Section 1: System Design Basics
    const basicsSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'System Design Basics', order_index: 1 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: basicsSection.id, title: 'What is System Design', video_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', duration: 600, position: 1, is_preview: true },
            { section_id: basicsSection.id, title: 'Client Server Architecture', video_url: 'https://www.youtube.com/watch?v=CNjAOMvoLHc', duration: 700, position: 2, is_preview: false },
            { section_id: basicsSection.id, title: 'Monolith vs Microservices', video_url: 'https://www.youtube.com/watch?v=Cc2eFxUH', duration: 650, position: 3, is_preview: false },
            { section_id: basicsSection.id, title: 'Basic Web Architecture', video_url: 'https://www.youtube.com/watch?v=UzEVg5S-ubc', duration: 720, position: 4, is_preview: false },
            { section_id: basicsSection.id, title: 'Load Balancers Explained', video_url: 'https://www.youtube.com/watch?v=fYq5BXgJ4Ac', duration: 680, position: 5, is_preview: false },
        ],
    });

    // Section 2: Scalability Fundamentals
    const scalabilitySection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Scalability Fundamentals', order_index: 2 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: scalabilitySection.id, title: 'Vertical vs Horizontal Scaling', video_url: 'https://www.youtube.com/watch?v=jV8B24rKDnE', duration: 720, position: 1, is_preview: true },
            { section_id: scalabilitySection.id, title: 'Scaling Databases', video_url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', duration: 840, position: 2, is_preview: false },
            { section_id: scalabilitySection.id, title: 'Replication & Sharding', video_url: 'https://www.youtube.com/watch?v=xUI5Tsl2JpY', duration: 900, position: 3, is_preview: false },
            { section_id: scalabilitySection.id, title: 'CAP Theorem', video_url: 'https://www.youtube.com/watch?v=ZYb_ZU8LNxs', duration: 780, position: 4, is_preview: false },
        ],
    });

    // Section 3: Databases & Storage
    const dbSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Databases & Storage', order_index: 3 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: dbSection.id, title: 'SQL vs NoSQL', video_url: 'https://www.youtube.com/watch?v=y17RuWkWdn8', duration: 660, position: 1, is_preview: true },
            { section_id: dbSection.id, title: 'Database Indexing', video_url: 'https://www.youtube.com/watch?v=L72fhGm1tfE', duration: 720, position: 2, is_preview: false },
            { section_id: dbSection.id, title: 'Data Partitioning', video_url: 'https://www.youtube.com/watch?v=pKd0Rpw7CE4', duration: 780, position: 3, is_preview: false },
            { section_id: dbSection.id, title: 'Caching Strategies', video_url: 'https://www.youtube.com/watch?v=QwevGzVu_zk', duration: 840, position: 4, is_preview: false },
        ],
    });

    // Section 4: Caching & Performance
    const cacheSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Caching & Performance', order_index: 4 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: cacheSection.id, title: 'CDN Fundamentals', video_url: 'https://www.youtube.com/watch?v=UB1O30fR-EE', duration: 600, position: 1, is_preview: false },
            { section_id: cacheSection.id, title: 'Redis & Memcached', video_url: 'https://www.youtube.com/watch?v=p68sZ0kOCXw', duration: 720, position: 2, is_preview: false },
            { section_id: cacheSection.id, title: 'Cache Invalidation', video_url: 'https://www.youtube.com/watch?v=fNcJuPIZ2WE', duration: 660, position: 3, is_preview: false },
            { section_id: cacheSection.id, title: 'Performance Optimization', video_url: 'https://www.youtube.com/watch?v=UzEVg5S-ubc', duration: 780, position: 4, is_preview: false },
        ],
    });

    // Section 5: Real World System Design
    const realWorldSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Real World System Design', order_index: 5 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: realWorldSection.id, title: 'Design URL Shortener', video_url: 'https://www.youtube.com/watch?v=fYq5BXgJ4Ac', duration: 900, position: 1, is_preview: false },
            { section_id: realWorldSection.id, title: 'Design Twitter', video_url: 'https://www.youtube.com/watch?v=jV8B24rKDnE', duration: 1020, position: 2, is_preview: false },
            { section_id: realWorldSection.id, title: 'Design YouTube', video_url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', duration: 1080, position: 3, is_preview: false },
            { section_id: realWorldSection.id, title: 'Design Chat Application', video_url: 'https://www.youtube.com/watch?v=xUI5Tsl2JpY', duration: 960, position: 4, is_preview: false },
        ],
    });

    console.log('   ✅ System Design content created (5 sections, 21 lessons)');
}

async function seedDSAContent(subjectId: string) {
    console.log('   Creating DSA sections...');

    // Section 1: Programming Foundations
    const foundationsSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Programming Foundations', order_index: 1 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: foundationsSection.id, title: 'Time & Space Complexity', video_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', duration: 720, position: 1, is_preview: true },
            { section_id: foundationsSection.id, title: 'Big O Notation', video_url: 'https://www.youtube.com/watch?v=CNjAOMvoLHc', duration: 660, position: 2, is_preview: false },
            { section_id: foundationsSection.id, title: 'Recursion Basics', video_url: 'https://www.youtube.com/watch?v=UzEVg5S-ubc', duration: 780, position: 3, is_preview: false },
        ],
    });

    // Section 2: Arrays & Strings
    const arraysSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Arrays & Strings', order_index: 2 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: arraysSection.id, title: 'Two Pointer Technique', video_url: 'https://www.youtube.com/watch?v=8hly31xKli0', duration: 600, position: 1, is_preview: true },
            { section_id: arraysSection.id, title: 'Sliding Window', video_url: 'https://www.youtube.com/watch?v=frKjLeuXyME', duration: 650, position: 2, is_preview: false },
            { section_id: arraysSection.id, title: 'Prefix Sum', video_url: 'https://www.youtube.com/watch?v=ph-NOF9ZlU0', duration: 630, position: 3, is_preview: false },
            { section_id: arraysSection.id, title: 'Array Problem Solving', video_url: 'https://www.youtube.com/watch?v=Hc64Da-wB-E', duration: 700, position: 4, is_preview: false },
        ],
    });

    // Section 3: Linked Lists
    const linkedListSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Linked Lists', order_index: 3 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: linkedListSection.id, title: 'Singly Linked Lists', video_url: 'https://www.youtube.com/watch?v=Nq7KmdudksU', duration: 720, position: 1, is_preview: true },
            { section_id: linkedListSection.id, title: 'Doubly Linked Lists', video_url: 'https://www.youtube.com/watch?v=J5BCNP3uaZA', duration: 660, position: 2, is_preview: false },
            { section_id: linkedListSection.id, title: 'Fast & Slow Pointers', video_url: 'https://www.youtube.com/watch?v=9AtZzrqWQjs', duration: 780, position: 3, is_preview: false },
            { section_id: linkedListSection.id, title: 'Reverse Linked List', video_url: 'https://www.youtube.com/watch?v=S0-I1zu7izM', duration: 600, position: 4, is_preview: false },
        ],
    });

    // Section 4: Stacks & Queues
    const stackQueueSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Stacks & Queues', order_index: 4 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: stackQueueSection.id, title: 'Stack Implementation', video_url: 'https://www.youtube.com/watch?v=I5lq6sCuABY', duration: 540, position: 1, is_preview: false },
            { section_id: stackQueueSection.id, title: 'Queue Implementation', video_url: 'https://www.youtube.com/watch?v=M6GnoUDpqEE', duration: 600, position: 2, is_preview: false },
            { section_id: stackQueueSection.id, title: 'Monotonic Stack', video_url: 'https://www.youtube.com/watch?v=DuPzwIe9oXI', duration: 720, position: 3, is_preview: false },
        ],
    });

    // Section 5: Trees & Graphs
    const treeGraphSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Trees & Graphs', order_index: 5 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: treeGraphSection.id, title: 'Binary Trees', video_url: 'https://www.youtube.com/watch?v=OnSn2cxGT4A', duration: 780, position: 1, is_preview: false },
            { section_id: treeGraphSection.id, title: 'BST Operations', video_url: 'https://www.youtube.com/watch?v=pYT9F8_LFTM', duration: 840, position: 2, is_preview: false },
            { section_id: treeGraphSection.id, title: 'DFS & BFS', video_url: 'https://www.youtube.com/watch?v=pcKY4hjDrxk', duration: 900, position: 3, is_preview: false },
            { section_id: treeGraphSection.id, title: 'Graph Representation', video_url: 'https://www.youtube.com/watch?v=gXgEDyodOJU', duration: 720, position: 4, is_preview: false },
        ],
    });

    // Section 6: Sorting & Searching
    const sortSearchSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Sorting & Searching', order_index: 6 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: sortSearchSection.id, title: 'Binary Search', video_url: 'https://www.youtube.com/watch?v=T2sFYY-fT5o', duration: 660, position: 1, is_preview: false },
            { section_id: sortSearchSection.id, title: 'Merge Sort', video_url: 'https://www.youtube.com/watch?v=4VqmGXwpLqc', duration: 720, position: 2, is_preview: false },
            { section_id: sortSearchSection.id, title: 'Quick Sort', video_url: 'https://www.youtube.com/watch?v=Hoixgm4-P4M', duration: 780, position: 3, is_preview: false },
        ],
    });

    // Section 7: Dynamic Programming
    const dpSection = await prisma.section.create({
        data: { subject_id: subjectId, title: 'Dynamic Programming', order_index: 7 },
    });

    await prisma.lesson.createMany({
        data: [
            { section_id: dpSection.id, title: 'DP Introduction', video_url: 'https://www.youtube.com/watch?v=oBt53YbR9Kk', duration: 900, position: 1, is_preview: false },
            { section_id: dpSection.id, title: 'Memoization vs Tabulation', video_url: 'https://www.youtube.com/watch?v=hfMko-kDD2g', duration: 780, position: 2, is_preview: false },
            { section_id: dpSection.id, title: 'Classic DP Problems', video_url: 'https://www.youtube.com/watch?v=TYbXAlm97KI', duration: 1020, position: 3, is_preview: false },
            { section_id: dpSection.id, title: 'DP Pattern Recognition', video_url: 'https://www.youtube.com/watch?v=YBSt1jYw0F0', duration: 960, position: 4, is_preview: false },
        ],
    });

    console.log('   ✅ DSA content created (7 sections, 27 lessons)');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
