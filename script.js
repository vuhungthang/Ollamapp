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
    const response = await fetch(`${ollamaApiBaseUrl}/api/generate`, {
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
    clearAPIError();
    const selectedModel = localStorage.getItem('selectedModel');
    if (!selectedModel) {
        alert('No model selected. Please go back to the homepage and select one.');
        return;
    }
    document.getElementById("idea").innerHTML = 'Loading Idea...';
    const response = await fetch(`${ollamaApiBaseUrl}/api/generate`, {
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
    if (!response.ok) {
        const errorText = await response.text();
        displayAPIError(`API Error generating idea: ${response.status} - ${errorText}`);
        document.getElementById("idea").innerHTML = 'Error generating idea.';
        return;
    }
    const data = await response.json();
    const idea = data.response;
    document.getElementById("idea").innerHTML = idea;
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
        errorMessageElement.innerHTML = '<p>Ollama is not turned on or installed. Please install it from <a href="https://ollama.com/download" target="_blank">here</a> and run it.</p>' +
                                        '<p>If you encounter API issues (like CORS errors) after installation, you might need to set the OLLAMA_ORIGINS environment variable. ' +
                                        'For detailed instructions for macOS, Windows, and Linux, please visit <a href="https://objectgraph.com/blog/ollama-cors/" target="_blank">this guide</a>.</p>';
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
            const currentErrPage = window.location.pathname;
            if (modelsSection && currentErrPage.includes('index.html')) {
                 modelsSection.style.display = 'block';
            }
            if (errorMessageElement) {
                 errorMessageElement.innerHTML = '<p>Ollama is not turned on or installed. Please install it from <a href="https://ollama.com/download" target="_blank">here</a> and run it.</p><p>If you encounter API issues (like CORS errors) after installation, you might need to set the OLLAMA_ORIGINS environment variable. ' +
                                        'For detailed instructions for macOS, Windows, and Linux, please visit <a href="https://objectgraph.com/blog/ollama-cors/" target="_blank">this guide</a>.</p>';
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
    const response = await fetch(`${ollamaApiBaseUrl}/api/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": selectedModel,
            "prompt": `translate ${wordToTranslate} into ${selectedLanguage}`,
            "stream": false
        })
    });
    if (!response.ok) {
        const errorText = await response.text();
        displayAPIError(`API Error getting translation: ${response.status} - ${errorText}`);
        document.getElementById("translation").innerHTML = 'Error getting translation.';
        return;
    }
    const data = await response.json();
    const translation = data.response;
    document.getElementById("translation").innerHTML = translation;

}
