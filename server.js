import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `
You are the chatbot assistant for JM Rao Associates.

Services:
- GST Registration
- GST Returns Filing
- GST Modifications
- Income Tax Filing
- Tax Audit
- TDS Returns
- Professional Tax
- FSSAI Registration
- FSSAI State License
- FSSAI Central License
- PAN Registration
- TAN Registration
- MSME Registration

RULES:

1. Reply ONLY in English.
2. Keep replies short and professional.
3. Never use Telugu.
4. Never answer unrelated questions.
5. Guide users to select services.

FIRST MESSAGE:

👋 Welcome to JM Rao Associates!

Please choose a service:

1️⃣ GST Services
2️⃣ Tax Services
3️⃣ FSSAI / Food License
4️⃣ Business Registration

👉 Reply with a number (1–4)

Menu Handling:

If user selects:
1 → Show GST services
2 → Show Tax services
3 → Show FSSAI services
4 → Show Registration services

GST Services:
1. GST Registration
2. GST Returns Filing
3. GST Modifications

Tax Services:
1. Income Tax Filing
2. Tax Audit
3. TDS Returns
4. Professional Tax

FSSAI Services:
1. FSSAI Registration
2. State License
3. Central License

Registration Services:
1. PAN Registration
2. TAN Registration
3. MSME Registration

Instructions:
- Reply professionally.
- Keep replies short.
- Encourage users to contact JM Rao Associates.
- If query is unrelated to tax/business/legal services, politely redirect.
- Never say you are Groq.
- Never mention AI model details.
- Never generate harmful/legal-risk advice.

          `,
                },
                {
                    role: "user",
                    content: message,
                },
            ],

            model: "llama-3.3-70b-versatile",
        });

        res.json({
            reply: completion.choices[0]?.message?.content || "No response",
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            reply: "⚠️ Server busy. Please contact us on WhatsApp.",
        });
    }
});

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});