document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chatBox');
    const questionInput = document.getElementById('questionInput');
    const sendButton = document.getElementById('sendButton');
  
    function addMessage(message, isUser = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
  
      if (typeof message === 'string') {
        messageDiv.textContent = message;
      } else {
        messageDiv.innerHTML = message;
      }
  
      chatBox.appendChild(messageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  
    function showLoading() {
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'message bot-message loading';
      loadingDiv.textContent = 'Typing...';
      chatBox.appendChild(loadingDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
      return loadingDiv;
    }
  
    async function handleQuestion(question) {
      addMessage(question, true);
      const loadingDiv = showLoading();
  
      try {
        const response = await new Promise((resolve, reject) => {
          chrome.runtime.sendMessage(
            { action: 'generateContent', prompt: question },
            (response) => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
              } else {
                resolve(response); // Resolving only the text message
              }
            }
          );
        });
  
        console.log('Response from background script:', response);
  
        loadingDiv.remove();
        if (response) {
          addMessage(response);
        } else {
          addMessage('Sorry, I could not generate a response.');
        }
      } catch (error) {
        loadingDiv.remove();
        addMessage('Sorry, there was an error processing your question.');
        console.error('Error:', error);
      }
    }
  
    sendButton.addEventListener('click', () => {
      const question = questionInput.value.trim();
      if (question) {
        handleQuestion(question);
        questionInput.value = '';
      }
    });
  
    questionInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendButton.click();
      }
    });
  
    document.querySelectorAll('.suggestion').forEach((suggestion) => {
      suggestion.addEventListener('click', () => {
        const question = suggestion.dataset.question;
        handleQuestion(question);
      });
    });
  
    // Initial welcome message
    addMessage("👋 नमस्ते! I'm your Women's Rights Assistant. How can I assist you today?");
  });
  