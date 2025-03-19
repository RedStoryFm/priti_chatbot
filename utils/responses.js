export function getBotResponse(userMessage) {
    const responses = {
        "hi": "Hello! How can I help you? 😊",
        "hello": "Hey there! 👋",
        "who are you": "I'm Priti, your AI chatbot! 🤖",
        "bye": "Goodbye! Have a great day! 🌸"
    };

    return responses[userMessage.toLowerCase()] || "I'm not sure how to respond to that. 🤔";
}
