import express from "express"

const router = express.Router()

router.post("/message", async (req, res) => {
    const { message } = req.body

    if (!message) {
        return res.json({
            success: true,
            data: { reply: "Please enter a question." }
        })
    }

    try {
        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: process.env.HF_MODEL || "mistralai/Mistral-7B-Instruct-v0.2",
                    messages: [{ role: "user", content: message }],
                    max_tokens: 500
                })
            }
        )

        const data = await response.json() as any

        if (data.error) {
            console.error("Hugging Face API Error:", data.error);
            throw new Error(data.error.message || data.error);
        }

        const reply =
            data?.choices?.[0]?.message?.content ||
            "Sorry, I couldn't generate a response."

        return res.json({
            success: true,
            data: { reply }
        })

    } catch (error) {
        console.error("AI error:", error)

        return res.json({
            success: true,
            data: {
                reply: "AI service is temporarily unavailable. Please try again later."
            }
        })
    }
})

export default router
