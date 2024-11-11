const MAX_TOKENS = 1000;

async function generatePromptResponse(prompt) {
  try {
    const response = await chrome.runtime.sendNativeMessage(
      'com.google.chrome.generative',
      {
        prompt: `You are a helpful assistant focused on women's rights topics. 
                Please provide accurate, supportive information for the following question: ${prompt}`,
        max_tokens: MAX_TOKENS,
      }
    );
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    return { error: error.message };
  }
}

async function generateSummary(text) {
  try {
    const response = await chrome.runtime.sendNativeMessage(
      'com.google.chrome.generative',
      {
        prompt: `Please provide a concise summary of the following text, 
                focusing on any women's rights related content: ${text}`,
        max_tokens: MAX_TOKENS,
      }
    );
    return response;
  } catch (error) {
    console.error('Error generating summary:', error);
    return { error: error.message };
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateContent') {
    generatePromptResponse(request.prompt)
      .then(response => sendResponse(response));
    return true;
  } else if (request.action === 'summarize') {
    generateSummary(request.text)
      .then(response => sendResponse(response));
    return true;
  }
});