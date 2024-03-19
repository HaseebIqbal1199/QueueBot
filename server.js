const express = require('express');
const app = express();
const port = 3000;

app.set('debug', true);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
// Handle POST request from the textarea form
app.post('/submit', async (req, res) => {
  const textData = req.body.textareadata;
  const repli = ""
  const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY = "AIzaSyD2ZGPP0-eOBTtpWU7yDaD7PxrOFFxXWmg";
  
  async function runChat(query) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.75,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "hi"}],
        },
        {
          role: "model",
          parts: [{ text: "Hello! How can I assist you today?"}],
        },
        {
          role: "user",
          parts: [{ text: "hi"}],
        },
        {
          role: "model",
          parts: [{ text: "Hello again! Is there anything specific you need help with today? I'm here to assist you in any way I can."}],
        },
        {
          role: "user",
          parts: [{ text: "hi"}],
        },
        {
          role: "model",
          parts: [{ text: "Hello there! How are you doing today? Is there anything I can help you with? I'm here to assist you in any way I can."}],
        },
        {
          role: "user",
          parts: [{ text: "hi"}],
        },
        {
          role: "model",
          parts: [{ text: "Hello! How are you doing today? Is there anything specific I can help you with? I'm here to provide assistance and answer any questions you may have."}],
        },
      ],
    });
  
    const result = await chat.sendMessage(query);
    const response = result.response;
    repli = response
    console.log(response.text());
  }
  runChat(textData)
  // Your chatbot logic here
  res.json({ repli });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
