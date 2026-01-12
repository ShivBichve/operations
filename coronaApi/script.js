// API Endpoint - RootNet COVID-19 India API
const API_URL = 'https://api.rootnet.in/covid19-in/stats/latest';

// DOM Elements
const stateInput = document.getElementById('stateInput');
const searchBtn = document.getElementById('searchBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const statsContainer = document.getElementById('statsContainer');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);

// Main Search Function
async function handleSearch() {
    const stateName = stateInput.value.trim();

    if (!stateName) {
        showError('Please enter a state name');
        return;
    }

    // Show loading
    showLoading();
    hideError();
    hideStats();

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error('API returned unsuccessful response');
        }

        const stateData = findStateData(result.data.regional, stateName);

        if (stateData) {
            displayStats(stateData);
        } else {
            showError(`No data found for "${stateName}". Please check the spelling and try again.`);
        }

    } catch (error) {
        console.error('Error:', error);
        showError('Unable to fetch COVID-19 data. Please try again later.');
    } finally {
        hideLoading();
    }
}

// Find State Data from Regional Array
function findStateData(regionalData, searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    return regionalData.find(state => 
        state.loc.toLowerCase() === normalizedSearch
    );
}

// Display Statistics
function displayStats(stateData) {
    // State Name and Last Updated
    document.getElementById('stateName').textContent = stateData.loc;
    
    // Calculate Active Cases
    const activeCases = stateData.totalConfirmed - stateData.discharged - stateData.deaths;
    
    // Update Statistics
    document.getElementById('totalConfirmed').innerHTML = stateData.totalConfirmed;
    
    document.getElementById('activeCases').innerHTML = activeCases;
    
    document.getElementById('recovered').innerHTML = stateData.discharged;
    
    document.getElementById('deaths').innerHTML = stateData.deaths;
    
    document.getElementById('indianCases').innerHTML = stateData.confirmedCasesIndian;

    document.getElementById('foreignCases').innerHTML = stateData.confirmedCasesForeign;

    // Show Stats Container
    statsContainer.classList.remove('d-none');
}

// Show/Hide Functions
function showLoading() {
    loadingSpinner.classList.remove('d-none');
}

function hideLoading() {
    loadingSpinner.classList.add('d-none');
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('d-none');
}

function hideError() {
    errorMessage.classList.add('d-none');
}

function hideStats() {
    statsContainer.classList.add('d-none');
}