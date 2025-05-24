const ollamaApiBaseUrl = "http://localhost:11434"; // Default to localhost for local development

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
                setTimeout(() => { window.location.href = '../index.html'; }, 2000);
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
                setTimeout(() => { window.location.href = '../index.html'; }, 2500);
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

// Initialize models on page load
document.addEventListener('DOMContentLoaded', getModelsInfo); 