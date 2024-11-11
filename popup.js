document.addEventListener('DOMContentLoaded', function() {
  const chatContainer = document.getElementById('chatContainer');
  const userInput = document.getElementById('userInput');
  const sendButton = document.getElementById('send');
  const summarizeButton = document.getElementById('summarize');
  const translateButton = document.getElementById('translate');

  async function handleUserInput(input) {
    try {
      appendMessage('user', input);
      
      // Show loading state
      const loadingMessage = appendMessage('system', 'Thinking...');
      
      const response = await chrome.runtime.sendMessage({
        action: 'generateContent',
        prompt: input
      });
      
      // Remove loading message
      loadingMessage.remove();
      
      if (response.error) {
        appendMessage('system', 'Sorry, there was an error: ' + response.error);
      } else {
        appendMessage('assistant', response.text);
      }
    } catch (error) {
      console.error('Error:', error);
      appendMessage('system', 'Sorry, there was an error processing your request.');
    }
  }

  function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return messageDiv;
  }

  sendButton.addEventListener('click', () => {
    const input = userInput.value.trim();
    if (input) {
      handleUserInput(input);
      userInput.value = '';
    }
  });

  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendButton.click();
    }
  });

  summarizeButton.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      
      // Show loading state
      const loadingMessage = appendMessage('system', 'Summarizing page...');
      
      // Get page content
      const response = await chrome.tabs.sendMessage(tab.id, {action: "getPageContent"});
      
      if (response && response.content) {
        const summary = await chrome.runtime.sendMessage({
          action: 'summarize',
          text: response.content
        });
        
        loadingMessage.remove();
        appendMessage('assistant', 'Page Summary:\n' + summary.text);
      }
    } catch (error) {
      console.error('Error:', error);
      appendMessage('system', 'Unable to summarize the page. Make sure you are on a readable webpage.');
    }
  });

  translateButton.addEventListener('click', async () => {
    appendMessage('system', 'Translation feature coming soon!');
  });
});
