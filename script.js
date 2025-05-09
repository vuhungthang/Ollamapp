document.addEventListener('DOMContentLoaded', getModelsInfo);

async function generateQuote() {
    const selectedModel = localStorage.getItem('selectedModel');
    if (!selectedModel) {
        alert('No model selected. Please go back to the homepage and select one.');
        return;
    }
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": selectedModel,
            "prompt": "Please give me 1 quote that inspire me today for coding, please only give me the quote /no_thinking",
            "stream": false
        })
    });
    const data = await response.json();
    const quote = data.response;
    console.log(quote);
    document.getElementById("quote").innerHTML = quote;
}

async function generateIdea() {
    const selectedModel = localStorage.getItem('selectedModel');
    if (!selectedModel) {
        alert('No model selected. Please go back to the homepage and select one.');
        return;
    }
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": selectedModel,
            "prompt": "Please give me 1 website project that I can practice for today, please only give me the name of it. Only response in one short sentence. /no_thinking",
            "stream": false
        })
    });
    const data = await response.json();
    const idea = data.response;
    console.log(idea);
    document.getElementById("idea").innerHTML = idea;
}

async function getModelsInfo() {
    const navigationDiv = document.getElementById('navigationLinks');
    const modelsSection = document.getElementById('modelsSection');  // Get the models section element
    if (modelsSection) modelsSection.style.display = 'none';  // Initially hide it
    try {
        const response = await fetch('http://localhost:11434/api/tags', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (!response.ok) {
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
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('index.html')) {
            if (modelsSection) modelsSection.style.display = 'block';  // Show models section if API works
            if (selectedModel) {
                if (navigationDiv) navigationDiv.style.display = 'block';
            } else {
                if (navigationDiv) navigationDiv.style.display = 'none';
            }
        }
        
        if (currentPage.includes('quote.html') || currentPage.includes('idea.html')) {
            if (!selectedModel) {
                document.getElementById('errorMessage').innerHTML = 'No model selected. Please go back to the homepage and select one.';
                setTimeout(() => { window.location.href = 'index.html'; }, 2000);
                return;
            }
        }
        
        if (selectedModel) {
            infoHTML += `<p>Current model: ${selectedModel}. <button onclick="selectModel()">Change Model</button></p>`;
        } else {
            infoHTML += '<p>No model selected. Please choose one from the list below.</p>';
        }
        infoHTML += `<ul>${modelNameList.map(model => `<li>${model}</li>`).join('')}</ul>`;
        const selectElement = document.getElementById('modelSelect');
        if (selectElement) {
            selectElement.innerHTML = modelNameList.map(model => `<option value="${model}">${model}</option>`).join('');
        }
        document.getElementById('info').innerHTML = infoHTML;
    } catch (error) {
        const errorMessageElement = document.getElementById('errorMessage') || document.getElementById('info');
        if (errorMessageElement) {
            errorMessageElement.innerHTML = '<p>Ollama API is not working. Please install Ollama from <a href="https://ollama.com/download">here</a> and run it with the command: ollama serve.</p>';
        }
        if (navigationDiv) navigationDiv.style.display = 'none';
        const currentPage = window.location.pathname;
        if (currentPage.includes('quote.html') || currentPage.includes('idea.html')) {
            setTimeout(() => { window.location.href = 'index.html'; }, 2000);
        }
    }
}

function selectModel() {
    const selectElement = document.getElementById('modelSelect');
    if (selectElement && selectElement.value) {
        localStorage.setItem('selectedModel', selectElement.value);
        alert('Model selected: ' + selectElement.value + '. You can change it from the main page.');
        getModelsInfo();  // Refresh the info to show the updated message
    } else {
        alert('Please select a model first.');
    }
}

