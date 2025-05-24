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