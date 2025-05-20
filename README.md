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

*   `index.html`: Main page for model selection and navigation.
*   `script.js`: Core JavaScript logic for API calls, model handling, and application functionality.
*   `styles.css`: Styling for all HTML pages.
*   `quote.html`: Page for quote generation.
*   `idea.html`: Page for project idea generation.
*   `translator.html`: Page for text translation.
*   `chatbot.html`: Page for chatbot interaction.
