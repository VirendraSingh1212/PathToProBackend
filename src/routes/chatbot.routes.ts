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
            "https://api-inference.huggingface.co/models/google/flan-t5-large",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: message
                })
            }
        )

        const data = await response.json() as any

        // Handle potential API errors from Hugging Face
        if (data.error) {
            console.error("Hugging Face API Error:", data.error);
            throw new Error(data.error);
        }

        const reply =
            data?.[0]?.generated_text ||
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
