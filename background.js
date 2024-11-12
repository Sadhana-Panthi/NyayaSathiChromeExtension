chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateContent') {
    (async () => {
      try {
        console.log('Received request to generate content:', request);

        // Check if the language model is available
        const { available } = await ai.languageModel.capabilities();
        console.log('Language model availability:', available);

        if (available !== "no") {
          // Create a session
          const session = await ai.languageModel.create();

          // Revised prompt to avoid bullet points and use paragraph formatting
          let result = await session.prompt(`
            You are a helpful assistant providing general information about fundamental rights, especially for women, without assuming any specific country unless explicitly mentioned.
            Structure the response as sentences where each right or point begins with a bold term and follows with a clear explanation in italics. No bullet points.

            Example Answer:
            Here are some key fundamental rights that are often emphasized for women's empowerment:
            * **Right to equality**: *Women are entitled to equal treatment and opportunities in all aspects of life, including employment, education, healthcare, and political participation.*
            * **Right to protection**: *The law should ensure that women are protected from discrimination.*

            Here is the user's question: "${request.prompt}"
          `);
          console.log('Generated response:', result);

          // Reformat the response for readability and emphasis
          let formattedResult = intelligentFormatResponse(result);

          // Send the reformatted response back to popup.js
          sendResponse(formattedResult);
        } else {
          console.log('Language model is not available');
          sendResponse("Sorry, the language model is not available at the moment.");
        }
      } catch (error) {
        console.error('Error generating content:', error);
        sendResponse("Sorry, there was an error processing your request.");
      }
    })();
    return true; // Keeps the message channel open for async sendResponse
  }
});

// Function to reformat AI response for enhanced readability
function intelligentFormatResponse(text) {
  // Define common keywords and phrases to bold for emphasis
  const importantWords = ["rights", "protection", "access", "justice", "freedom", "equality", "important", "support", "education", "employment"];

  // Ensure each key term and explanation is separated by a line for readability
  let formattedText = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')  // Bold
                           .replace(/\*(.+?)\*/g, '<em>$1</em>');            // Italics
  return formattedText;
}
