document.addEventListener('DOMContentLoaded', function() {
  const chatBox = document.getElementById('chatBox');
  const questionInput = document.getElementById('questionInput');
  const sendButton = document.getElementById('sendButton');

  function addMessage(message, isUser = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
      
      if (!isUser) {
          const formattedMessage = message
              .replace(/Answer:/g, '<strong>Answer:</strong>')
              .replace(/Relevant Laws and Regulations:/g, '<strong>Relevant Laws and Regulations:</strong>')
              .replace(/Practical Steps or Resources:/g, '<strong>Practical Steps or Resources:</strong>')
              .replace(/Emergency Contacts:/g, '<strong>Emergency Contacts:</strong>');
          messageDiv.innerHTML = formattedMessage;
      } else {
          messageDiv.textContent = message;
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
          const response = await chrome.runtime.sendMessage({
              action: 'generateContent',
              prompt: question
          });

          loadingDiv.remove();
          addMessage(response.text || 'Sorry, I could not generate a response.');
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

  document.querySelectorAll('.suggestion').forEach(suggestion => {
      suggestion.addEventListener('click', () => {
          const question = suggestion.dataset.question;
          handleQuestion(question);
      });
  });

  // Initial welcome message
  addMessage("👋 नमस्ते! I'm your Women's Rights Assistant. How can I assist you today?");
});
