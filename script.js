const ollamaApiBaseUrl = "http://localhost:11434"; // Default to localhost for local development

document.addEventListener('DOMContentLoaded', getModelsInfo);

function displayAPIError(message) {
    const apiErrorElement = document.getElementById('apiError');
    if (apiErrorElement) {
        apiErrorElement.innerHTML = `<p style="color: red;">${message}</p>`;
        apiErrorElement.style.display = 'block';
    }
}

function clearAPIError() {
    const apiErrorElement = document.getElementById('apiError');
    if (apiErrorElement) {
        apiErrorElement.innerHTML = '';
        apiErrorElement.style.display = 'none';
    }
}

async function generateQuote() {
    clearAPIError();
    const selectedModel = localStorage.getItem('selectedModel');
    if (!selectedModel) {
        alert('No model selected. Please go back to the homepage and select one.');
        return;
    }
    document.getElementById("quote").innerHTML = 'Loading Quote...';
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": selectedModel,
            "prompt": "Please give me 1 quote that inspire me today for coding, please only give me the quote /no_thinking",
            "stream": false
        })
    };

    try {
        const response = await fetch(`${ollamaApiBaseUrl}/api/generate`, fetchOptions);

        if (!response.ok) {
            const errorText = await response.text();
            displayAPIError(`API Error generating quote: ${response.status} - ${errorText}`);
            document.getElementById("quote").innerHTML = 'Error generating quote.';
            return;
        }

        const data = await response.json();
        const quote = data.response;
        document.getElementById("quote").innerHTML = quote;

    } catch (error) {
        console.error("Fetch error (generateQuote):", error);
        if (error instanceof TypeError || error.message === 'Failed to fetch') {
            displayAPIError('<p>Could not connect to Ollama API to generate a quote. This might be due to network issues or CORS restrictions.</p>' +
                            '<p>Please ensure Ollama is running. If not installed, download it from <a href="https://ollama.com/download" target="_blank">ollama.com/download</a>.</p>' +
                            '<p>Also, ensure you have set the OLLAMA_ORIGINS environment variable correctly if you are accessing from a different origin. For detailed instructions, please visit <a href="https://objectgraph.com/blog/ollama-cors/" target="_blank">this guide</a>.</p>');
            document.getElementById("quote").innerHTML = 'Error generating quote due to connection issues.';
        } else {
            displayAPIError(`An unexpected error occurred while generating a quote: ${error.message}`);
            document.getElementById("quote").innerHTML = 'Error generating quote.';
        }
    }
}

async function generateIdea() {
    clearAPIError();
    const selectedModel = localStorage.getItem('selectedModel');
    if (!selectedModel) {
        alert('No model selected. Please go back to the homepage and select one.');
        return;
    }
    document.getElementById("idea").innerHTML = 'Loading Idea...';
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": selectedModel,
            "prompt": "Please give me 1 website project that I can practice for today, please only give me the name of it. Only response in one short sentence. /no_thinking",
            "stream": false
        })
    };

    try {
        const response = await fetch(`${ollamaApiBaseUrl}/api/generate`, fetchOptions);

        if (!response.ok) {
            const errorText = await response.text();
            displayAPIError(`API Error generating idea: ${response.status} - ${errorText}`);
            document.getElementById("idea").innerHTML = 'Error generating idea.';
            return;
        }

        const data = await response.json();
        const idea = data.response;
        document.getElementById("idea").innerHTML = idea;

    } catch (error) {
        console.error("Fetch error (generateIdea):", error);
        if (error instanceof TypeError || error.message === 'Failed to fetch') {
            displayAPIError('<p>Could not connect to Ollama API to generate an idea. This might be due to network issues or CORS restrictions.</p>' +
                            '<p>Please ensure Ollama is running. If not installed, download it from <a href="https://ollama.com/download" target="_blank">ollama.com/download</a>.</p>' +
                            '<p>Also, ensure you have set the OLLAMA_ORIGINS environment variable correctly if you are accessing from a different origin. For detailed instructions, please visit <a href="https://objectgraph.com/blog/ollama-cors/" target="_blank">this guide</a>.</p>');
            document.getElementById("idea").innerHTML = 'Error generating idea due to connection issues.';
        } else {
            displayAPIError(`An unexpected error occurred while generating an idea: ${error.message}`);
            document.getElementById("idea").innerHTML = 'Error generating idea.';
        }
    }
}

async function getModelsInfo() {
    clearAPIError();
    const navigationDiv = document.getElementById('navigationLinks');
    const modelsSection = document.getElementById('modelsSection');
    const errorMessageElement = document.getElementById('errorMessage') || document.getElementById('info');
    const currentPage = window.location.pathname;

    if (modelsSection) {
        if (currentPage === '/' || currentPage === '' || currentPage.includes('index.html')) {
            modelsSection.style.display = 'block';
        } else {
            modelsSection.style.display = 'none';
        }
    }

     if (errorMessageElement && (currentPage.includes('index.html') || !localStorage.getItem('selectedModel'))) {
        errorMessageElement.innerHTML = '<p>Ollama is not turned on or installed. Please download and run it from <a href="https://ollama.com/download" target="_blank">ollama.com/download</a>.</p>' +
                                        '<p>If you encounter API issues (like CORS errors) after installation, you might need to set the OLLAMA_ORIGINS environment variable. For detailed instructions for macOS, Windows, and Linux, please visit <a href="https://objectgraph.com/blog/ollama-cors/" target="_blank">this guide</a>.</p>';
    }
    
    if (navigationDiv) {
        navigationDiv.style.display = 'none';
    }

    try {
        const response = await fetch(`${ollamaApiBaseUrl}/api/tags`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            displayAPIError(`API Error getting models: ${response.status} - ${errorText}`);
            throw new Error('API not working');
        }
        const data = await response.json();
        const modelsCount = data.models.length;
        let modelNameList = [];
        for (let i = 0; i < modelsCount; i++) {
            modelNameList.push(data.models[i].model);
        }
        const selectedModel = localStorage.getItem('selectedModel');
        let infoHTML = '';
        
        const currentModelDisplayElement = document.getElementById('currentModelDisplay');
        if (currentModelDisplayElement) {
            if (selectedModel) {
                currentModelDisplayElement.innerHTML = `Current Model: <strong>${selectedModel}</strong>`;
            } else {
                currentModelDisplayElement.innerHTML = 'No model selected.';
            }
        }
        
        if (currentPage === '/' || currentPage === '' || currentPage.includes('index.html')) {
            if (modelsSection) modelsSection.style.display = 'block';
            if (selectedModel) {
                if (navigationDiv) navigationDiv.style.display = 'block';
            } else {
                if (navigationDiv) navigationDiv.style.display = 'none';
            }
        }
        
        if (currentPage.includes('quote.html') || currentPage.includes('idea.html')) {
            if (!selectedModel) {
                if(errorMessageElement) errorMessageElement.innerHTML = 'You have not selected a model. Please return to the main page to select one. Redirecting...';
                setTimeout(() => { window.location.href = 'index.html'; }, 2000);
                return;
            }
             if (navigationDiv) navigationDiv.style.display = 'block';
        }
        
        if (!selectedModel) {
            infoHTML += '<p>No model selected. Please choose one from the list below.</p>';
        }
        infoHTML += `<ul>${modelNameList.map(model => `<li>${model}</li>`).join('')}</ul>`;
        const selectElement = document.getElementById('modelSelect');
        if (selectElement) {
            selectElement.innerHTML = modelNameList.map(model => `<option value="${model}">${model}</option>`).join('');
            if(selectedModel) selectElement.value = selectedModel;
        }
        
        const infoDisplayElement = document.getElementById('info');
        if (infoDisplayElement) {
             infoDisplayElement.innerHTML = infoHTML;
        }
    
        if (navigationDiv && localStorage.getItem('selectedModel')) {
            navigationDiv.style.display = 'block';
        }

    } catch (error) {
        console.error("Fetch error:", error);
        const currentErrPage = window.location.pathname;
        
        if (error instanceof TypeError || error.message === 'Failed to fetch') {
            if (errorMessageElement) {
                errorMessageElement.innerHTML = '<p>Could not connect to Ollama API. This might be due to network issues or CORS restrictions.</p>' +
                                                '<p>Please ensure Ollama is running. If not installed, download it from <a href="https://ollama.com/download" target="_blank">ollama.com/download</a>.</p>' +
                                                '<p>Also, ensure you have set the OLLAMA_ORIGINS environment variable correctly if you are accessing from a different origin. For detailed instructions, please visit <a href="https://objectgraph.com/blog/ollama-cors/" target="_blank">this guide</a>.</p>';
            }
        } else {
            if (errorMessageElement) {
                 errorMessageElement.innerHTML = '<p>An API error occurred.</p><p>Ollama is not turned on or installed. Please download and run it from <a href="https://ollama.com/download" target="_blank">ollama.com/download</a>.</p>';
            }
        }

        if (modelsSection && currentErrPage.includes('index.html')) {
             modelsSection.style.display = 'block';
        }

        if (navigationDiv) {
            navigationDiv.style.display = 'none';
        }
        
        if (currentErrPage.includes('quote.html') || currentErrPage.includes('idea.html') || currentErrPage.includes('translate.html')) {
            if (!localStorage.getItem('selectedModel')) {
                if (errorMessageElement) {
                    errorMessageElement.innerHTML = 'Ollama is not available or no model selected. Redirecting to the main page.';
                }
                setTimeout(() => { window.location.href = 'index.html'; }, 2500);
            }
        }
    }
}
  
function selectModel() {
    const selectElement = document.getElementById('modelSelect');
    if (selectElement && selectElement.value) {
        localStorage.setItem('selectedModel', selectElement.value);
        alert('Model selected: ' + selectElement.value + '. You can change it from the main page.');
        getModelsInfo();
    } else {
        alert('Please select a model first.');
    }
}

async function getTranslation() {
    clearAPIError();
    const selectedModel = localStorage.getItem('selectedModel');
    if (!selectedModel) {
        alert('No model selected. Please go back to the homepage and select one.');
        return;
    }

    const wordToTranslate = document.getElementById('wordInput').value;
    if (!wordToTranslate) {
        alert('Please enter a word to translate.');
        return;
    }


    const selectedLanguage = document.getElementById('languages').value;

    document.getElementById("translation").innerHTML = 'Loading translation...';
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": selectedModel,
            "prompt": `translate the following text "${wordToTranslate}" to ${selectedLanguage}`,
            "stream": false
        })
    };

    try {
        const response = await fetch(`${ollamaApiBaseUrl}/api/generate`, fetchOptions);

        if (!response.ok) {
            const errorText = await response.text();
            displayAPIError(`API Error getting translation: ${response.status} - ${errorText}`);
            document.getElementById("translation").innerHTML = 'Error getting translation.';
            return;
        }

        const data = await response.json();
        const translation = data.response;
        document.getElementById("translation").innerHTML = translation;

    } catch (error) {
        console.error("Fetch error (getTranslation):", error);
        if (error instanceof TypeError || error.message === 'Failed to fetch') {
            displayAPIError('<p>Could not connect to Ollama API to get a translation. This might be due to network issues or CORS restrictions.</p>' +
                            '<p>Please ensure Ollama is running. If not installed, download it from <a href="https://ollama.com/download" target="_blank">ollama.com/download</a>.</p>' +
                            '<p>Also, ensure you have set the OLLAMA_ORIGINS environment variable correctly if you are accessing from a different origin. For detailed instructions, please visit <a href="https://objectgraph.com/blog/ollama-cors/" target="_blank">this guide</a>.</p>');
            document.getElementById("translation").innerHTML = 'Error getting translation due to connection issues.';
        } else {
            displayAPIError(`An unexpected error occurred while getting a translation: ${error.message}`);
            document.getElementById("translation").innerHTML = 'Error getting translation.';
        }
    }
}

// Add chat functionality for chatbot.html

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
                window.location.href = 'index.html';
            });
        }
    }
});