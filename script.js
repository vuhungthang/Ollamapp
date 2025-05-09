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
    document.getElementById("idea").innerHTML = idea;
}

async function getModelsInfo() {
    const navigationDiv = document.getElementById('navigationLinks');
    const modelsSection = document.getElementById('modelsSection');
    const errorMessageElement = document.getElementById('errorMessage') || document.getElementById('info');
    const currentPage = window.location.pathname;

    if (modelsSection) {
        if (currentPage.includes('index.html')) {
            modelsSection.style.display = 'block';
        } else {
            modelsSection.style.display = 'none';
        }
    }

    if (errorMessageElement && (currentPage.includes('index.html') || !localStorage.getItem('selectedModel'))) {
        errorMessageElement.innerHTML = '<p>Ollama is not turned on or installed. Please install it from <a href="https://ollama.com/download">here</a> and run it.</p>';
    }
    
    if (navigationDiv) {
        navigationDiv.style.display = 'none';
    }

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
        
        if (currentPage.includes('index.html')) {
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
        
        if (selectedModel) {
            infoHTML += `<p>Current model: ${selectedModel}. <button onclick="selectModel()">Change Model</button></p>`;
        } else {
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
            const currentErrPage = window.location.pathname;
            if (modelsSection && currentErrPage.includes('index.html')) {
                 modelsSection.style.display = 'block';
            }
            if (errorMessageElement) {
                 errorMessageElement.innerHTML = '<p>Ollama is not turned on or installed. Please install it from <a href="https://ollama.com/download">here</a> and run it.</p>';
            }
            if (navigationDiv) {
                navigationDiv.style.display = 'none';
            }
            if (currentErrPage.includes('quote.html') || currentErrPage.includes('idea.html')) {
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