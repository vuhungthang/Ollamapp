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