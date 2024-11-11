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

          // Prompt the model and wait for the result
          const result = await session.prompt(request.prompt);
          console.log('Generated response:', result);

          // Send the response back to popup.js
          sendResponse(result); // Directly sending the result
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
