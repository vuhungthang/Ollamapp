# Ollama Applications

This project provides a simple web interface to interact with the Ollama API for various language model tasks, including generating quotes, project ideas, translations, and engaging in chatbot conversations.

## Features

*   **Model Selection:** Choose from available Ollama models directly within the application.
*   **Quote Generator:** Get inspiring quotes.
*   **Project Idea Generator:** Generate website project ideas.
*   **Translator:** Translate text between languages (requires appropriate Ollama models).
*   **Chatbot:** Engage in conversational interactions with the selected model.

## Prerequisites

*   **Ollama:** You need to have Ollama installed and running on your system. Download it from [ollama.com/download](https://ollama.com/download).
*   **OLLAMA\_ORIGINS:** If you encounter API issues (like CORS errors), you might need to set the `OLLAMA_ORIGINS` environment variable. Refer to guides like [objectgraph.com/blog/ollama-cors/](https://objectgraph.com/blog/ollama-cors/) for instructions.

## Installation

1.  Clone this repository to your local machine.
2.  Navigate to the project directory in your terminal.
3.  Ensure Ollama is running and you have downloaded at least one model (e.g., `ollama run qwen2.5`).

## Usage

1.  Open the `index.html` file in your web browser.
2.  If Ollama is running, the available models will be displayed. Select a model from the dropdown.
3.  Once a model is selected, navigation links to the different applications (Quote, Idea, Translator, Chatbot) will appear.
4.  Click on a link to navigate to the desired application page and use its functionality.

## Project Structure

The project is now organized into feature-specific folders for better maintainability:

*   `index.html`: Main page for model selection and navigation.
*   `styles.css`: Global styling for all HTML pages.
*   `shared/`: Contains shared utilities and common functionality
    *   `utils.js`: Core utilities for API calls, model handling, and error management.
*   `quote/`: Quote generation feature
    *   `quote.html`: Page for quote generation.
    *   `quote.js`: JavaScript specific to quote functionality.
*   `idea/`: Project idea generation feature
    *   `idea.html`: Page for project idea generation.
    *   `idea.js`: JavaScript specific to idea generation functionality.
*   `translator/`: Translation feature
    *   `translator.html`: Page for text translation.
    *   `translator.js`: JavaScript specific to translation functionality.
*   `chatbot/`: Interactive chatbot feature
    *   `chatbot.html`: Page for chatbot interaction.
    *   `chatbot.js`: JavaScript specific to chatbot functionality.

## Architecture

The codebase follows a modular architecture:

- **Shared utilities** (`shared/utils.js`): Contains common functions for API communication, model management, and error handling
- **Feature-specific modules**: Each feature has its own folder with dedicated HTML and JavaScript files
- **Separation of concerns**: Functionality is clearly separated by feature, making the code more maintainable and easier to extend
