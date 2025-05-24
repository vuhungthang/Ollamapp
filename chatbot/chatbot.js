// Define available chatbot roles and their system prompts
const chatbotRoles = {
    // Add more roles as needed
    "Study Buddy": "You are my friend, and we can learn with each other. We can discuss anything to help together learn better. You talk with me in conversation format, not long, and should be natural.",
    "Tutor": "You are a friendly tutor that is very helpful with students. You're always answer the students' questions with good manner, and make the complex problems becomes easier to digest with analogy, examples, or breaking the problems down. You are not trying to explain it in a heavy academic way, but in conversational tone, and it should be natural as possible."
};

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the chatbot.html page
    if (window.location.pathname.includes('chatbot.html')) {
        let conversationHistory = [
            { 
                role: "system", 
                content: "You are a helpful buddy that study with me. Please have a conversation like a real person, don't answer too long, be as natural as possible" 
            }
        ];

        const chatBox = document.getElementById('chat-box');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        const newChatButton = document.getElementById('new-chat-button'); // Assuming you add a button with this ID
        const roleSelect = document.getElementById('roleSelect'); // Get the role select element

        // Populate the role select dropdown
        for (const role in chatbotRoles) {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            roleSelect.appendChild(option);
        }

        // Function to initialize or reset conversation history based on selected role
        function initializeConversation(role) {
             const systemPrompt = chatbotRoles[role];
             conversationHistory = [
                 { 
                     role: "system", 
                     content: systemPrompt
                 }
             ];
             // Display the initial assistant message for the new chat based on the role
             // This is a simplified placeholder. You might want a more dynamic intro based on role.
             displayMessage(`Hello! I am your ${role}. How can I help you today?`, 'assistant');
        }

        // Add event listener to the role select dropdown
        roleSelect.addEventListener('change', (event) => {
            const selectedRole = event.target.value;
            localStorage.setItem('selectedChatbotRole', selectedRole); // Save selected role
            startNewChat(); // Start a new chat with the new role
        });

        // Load saved role or default to 'Study Buddy'
        const savedRole = localStorage.getItem('selectedChatbotRole') || 'Study Buddy';
        if (chatbotRoles[savedRole]) {
             roleSelect.value = savedRole;
             initializeConversation(savedRole);
        } else {
             // Default to the first role if saved role is invalid
             const defaultRole = Object.keys(chatbotRoles)[0];
             roleSelect.value = defaultRole;
             localStorage.setItem('selectedChatbotRole', defaultRole);
             initializeConversation(defaultRole);
        }

        // Function to display a message in the chat box
        function displayMessage(message, role) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', role);

            // Process formatting for assistant messages
            if (role === 'assistant') {
                let formattedMessage = message;
                // Replace newline characters with <br> tags
                formattedMessage = formattedMessage.replace(/\n/g, '<br>');
                // Replace **text** with <strong>text</strong>
                formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Replace *text* with <em>text</em>
                formattedMessage = formattedMessage.replace(/\*(.*?)\*/g, '<em>$1</em>');
                messageElement.innerHTML = formattedMessage;
            } else {
                // For user messages, just use textContent
                messageElement.textContent = message;
            }

            chatBox.appendChild(messageElement);
            // Scroll to the bottom of the chat box
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        // Function to send a message to the Ollama API
        async function sendMessage() {
            const message = userInput.value.trim();
            if (!message) return;

            // Display user message
            displayMessage(message, 'user');
            userInput.value = ''; // Clear input

            // Add user message to history
            conversationHistory.push({ role: 'user', content: message });

            // Get selected model
            const selectedModel = localStorage.getItem('selectedModel');
            if (!selectedModel) {
                displayMessage('Error: No model selected. Please go back to the homepage and select one.', 'assistant');
                return;
            }

            try {
                // Show a loading indicator message from the assistant
                const loadingMessageElement = document.createElement('div');
                loadingMessageElement.classList.add('message', 'assistant', 'loading');
                loadingMessageElement.textContent = 'Thinking...';
                chatBox.appendChild(loadingMessageElement);
                 chatBox.scrollTop = chatBox.scrollHeight;

                const response = await fetch(`${ollamaApiBaseUrl}/api/chat`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: selectedModel,
                        messages: conversationHistory,
                        stream: false // Set to true for streaming responses
                    })
                });

                // Remove loading indicator
                chatBox.removeChild(loadingMessageElement);

                if (!response.ok) {
                    const errorText = await response.text();
                    displayMessage(`API Error: ${response.status} - ${errorText}`, 'assistant');
                    // Optionally, remove the last user message from history if the API call failed
                    conversationHistory.pop();
                    return;
                }

                const data = await response.json();
                const assistantMessage = data.message.content;

                // Display assistant message
                displayMessage(assistantMessage, 'assistant');

                // Add assistant message to history
                conversationHistory.push({ role: 'assistant', content: assistantMessage });

            } catch (error) {
                // Remove loading indicator in case of fetch error
                 const loadingMessageElement = chatBox.querySelector('.message.assistant.loading');
                 if(loadingMessageElement) chatBox.removeChild(loadingMessageElement);

                displayMessage(`Error sending message: ${error}`, 'assistant');
                // Optionally, remove the last user message from history if the API call failed
                conversationHistory.pop();
            }
        }

        // Function to clear the chat and start a new conversation
        function startNewChat() {
            // Clear the messages displayed in the chat box
            chatBox.innerHTML = '';
            // Re-initialize the conversation history with the current selected role
            const currentSelectedRole = roleSelect.value;
            initializeConversation(currentSelectedRole);
        }

        // Event listeners
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });

        // Add event listener for the new chat button
        if (newChatButton) {
            newChatButton.addEventListener('click', startNewChat);
        }

        const backHomeButton = document.getElementById('backHomeButton');
        if (backHomeButton) {
            backHomeButton.addEventListener('click', () => {
                window.location.href = '../index.html';
            });
        }
    }
}); 