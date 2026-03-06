export const generateChatbotResponse = async (message: string): Promise<string> => {
    const msg = message.toLowerCase();

    if (msg.includes("course") || msg.includes("subjects")) {
        return "You can explore all available courses from the Subjects page.";
    }

    if (msg.includes("progress")) {
        return "Your learning progress updates whenever you mark a lesson as complete.";
    }

    if (msg.includes("lesson")) {
        return "Open a subject and select a lesson from the sidebar to start watching.";
    }

    if (msg.includes("complete")) {
        return "Use the 'Mark as Complete' button below the video to track your learning progress.";
    }

    if (msg.includes("resume")) {
        return "To resume learning, open your course and continue from the next lesson.";
    }

    if (msg.includes("system design")) {
        return "System design focuses on building scalable systems using concepts like load balancing, caching, and distributed databases.";
    }

    if (msg.includes("data structure") || msg.includes("dsa")) {
        return "Data Structures and Algorithms help you write efficient programs and solve coding interview problems.";
    }

    if (msg.includes("full stack")) {
        return "Full Stack Development covers frontend technologies like React and backend systems such as Node.js and databases.";
    }

    return "I'm here to help you with courses, lessons, and learning progress.";
};
