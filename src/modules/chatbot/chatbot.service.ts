import axios from "axios";
import { LRUCache } from "lru-cache";

// ─── Rule-based fallback ──────────────────────────────────────────────────────

export const generateRuleBasedReply = (message: string): string => {
    const msg = message.toLowerCase();

    if (msg.includes("course") || msg.includes("subjects")) {
        return "You can explore all available courses from the Subjects page.";
    }
    if (msg.includes("progress")) {
        return "Your learning progress updates whenever you mark a lesson as complete.";
    }
    if (msg.includes("lesson") || msg.includes("video")) {
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
    if (msg.includes("dsa") || msg.includes("data structure")) {
        return "Data Structures and Algorithms help you write efficient programs and solve coding interview problems.";
    }
    if (msg.includes("full stack")) {
        return "Full Stack Development covers frontend technologies like React and backend systems such as Node.js and databases.";
    }
    if (msg.includes("cap theorem")) {
        return "CAP theorem states that a distributed system can only guarantee two of three properties simultaneously: Consistency, Availability, and Partition Tolerance.";
    }

    return "I'm here to help you with courses, lessons, and learning progress.";
};

// ─── Response cache (lru-cache v10+) ─────────────────────────────────────────

const cache = new LRUCache<string, string>({
    max: 500,
    ttl: (Number(process.env.HF_CACHE_TTL_SEC) || 30) * 1000,
});

// ─── AI reply via HuggingFace Router (OpenAI-compatible) ─────────────────────

export const generateAIReply = async (
    message: string
): Promise<{ reply: string; source: "ai" | "cache" | "fallback" }> => {
    // 1. Check cache first
    const cached = cache.get(message);
    if (cached) {
        return { reply: cached, source: "cache" };
    }

    const apiKey = process.env.HF_API_KEY;
    // Default to a small, fast, chat-capable model
    const model =
        process.env.HF_MODEL || "meta-llama/Llama-3.2-3B-Instruct";

    // 2. No API key → rule-based fallback
    if (!apiKey) {
        console.warn("[Chatbot] HF_API_KEY not set — using rule-based fallback");
        return { reply: generateRuleBasedReply(message), source: "fallback" };
    }

    // 3. Call HuggingFace Router (OpenAI-compatible chat completions endpoint)
    try {
        const response = await axios.post(
            "https://router.huggingface.co/v1/chat/completions",
            {
                model,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a helpful assistant for PathToPro, an online learning platform. Answer clearly and concisely in 2-3 short sentences.",
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],
                max_tokens: Number(process.env.HF_MAX_NEW_TOKENS) || 200,
                temperature: Number(process.env.HF_TEMPERATURE) || 0.2,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                timeout: 20000,
            }
        );

        const content: string | undefined =
            response.data?.choices?.[0]?.message?.content;

        if (!content || !content.trim()) {
            return { reply: generateRuleBasedReply(message), source: "fallback" };
        }

        const reply = content.trim();

        // Store in cache
        cache.set(message, reply);
        return { reply, source: "ai" };
    } catch (error: any) {
        const status = error?.response?.status;
        const hint =
            error?.response?.data?.error?.message ||
            error?.message ||
            "unknown error";
        console.error(`[Chatbot] HuggingFace error (${status ?? "timeout"}): ${hint}`);

        return { reply: generateRuleBasedReply(message), source: "fallback" };
    }
};
