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