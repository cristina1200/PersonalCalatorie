// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    loadDataFromStorage();
    setupEventListeners();
    displayAllData();
}

// ==================== DATA MANAGEMENT ====================
let appData = {
    trip: null,
    activities: [],
    packingItems: [],
    expenses: [],
    totalBudget: 0,
    experiences: [],
    currency: 'USD'
};

const STORAGE_KEY = 'travelAssistantData';   //sa nu periedem datele din localStorage sau cand dam refresh la pagina
let itemIdCounter = 0;

function saveDataToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

function loadDataFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        appData = JSON.parse(stored);
    }
}

// ==================== CURRENCY EXCHANGE RATES ====================
const EXCHANGE_RATES = {
    'USD': 1.0,
    'EUR': 0.92,
    'GBP': 0.79,
    'RON': 4.97,
    'JPY': 149.50,
    'CHF': 0.88
};

const CURRENCY_SYMBOLS = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'RON': 'lei',
    'JPY': '¥',
    'CHF': 'Fr'
};

function convertCurrency(amountUSD, targetCurrency) {
    if (!EXCHANGE_RATES[targetCurrency]) return amountUSD;
    return amountUSD * EXCHANGE_RATES[targetCurrency];
}

function formatCurrency(amount, currency) {
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    if (currency === 'RON') {
        return amount.toFixed(2) + ' ' + symbol;
    }
    return symbol + amount.toFixed(2);
}

// ==================== FORM VALIDATION ====================
function validatePlanningForm() {
    const destination = document.getElementById('destination').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const travelers = parseInt(document.getElementById('travelers').value);
    const purpose = document.getElementById('purpose').value;

    let isValid = true;

    if (!destination || destination.length < 3) {
        showError('destinationError');
        isValid = false;
    } else {
        hideError('destinationError');
    }

    if (!startDate) {
        showError('startDateError');
        isValid = false;
    } else {
        hideError('startDateError');
    }

    if (!endDate) {
        showError('endDateError');
        isValid = false;
    } else if (new Date(endDate) <= new Date(startDate)) {
        showError('endDateError');
        isValid = false;
    } else {
        hideError('endDateError');
    }

    if (isNaN(travelers) || travelers < 1) {
        showError('travelersError');
        isValid = false;
    } else {
        hideError('travelersError');
    }

    if (!purpose) {
        showError('purposeError');
        isValid = false;
    } else {
        hideError('purposeError');
    }

    return isValid;
}

function showError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.add('show');
    }
}

function hideError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    //salveaza planul
    document.getElementById('planningForm').addEventListener('submit', handlePlanningSubmit);

    //adauga activitate, save si cancel
    document.getElementById('addActivityBtn')?.addEventListener('click', toggleActivityForm);
    document.getElementById('saveActivityBtn')?.addEventListener('click', saveActivity);
    document.getElementById('cancelActivityBtn')?.addEventListener('click', toggleActivityForm);

    document.getElementById('viewMapBtn')?.addEventListener('click', showMapSection);
    document.getElementById('backFromMapBtn')?.addEventListener('click', hideMapSection);

    document.getElementById('generatePackingBtn')?.addEventListener('click', generateAutoPackingList);

    document.getElementById('addExpenseBtn')?.addEventListener('click', toggleExpenseForm);
    document.getElementById('saveExpenseBtn')?.addEventListener('click', saveExpense);
    document.getElementById('cancelExpenseBtn')?.addEventListener('click', toggleExpenseForm);

    // schimbare moneda buget
    document.getElementById('currencySelect')?.addEventListener('change', function(e) {
        appData.currency = e.target.value;
        saveDataToStorage();
        displayBudgetSummary();
    });

    document.getElementById('setTotalBudgetBtn')?.addEventListener('click', function() {
        const input = document.getElementById('totalBudgetInput');
        if (input && input.value && !isNaN(input.value) && parseFloat(input.value) > 0) {
            appData.totalBudget = parseFloat(input.value);
            saveDataToStorage();
            displayBudgetSummary();
            alert('Buget total setat: $' + appData.totalBudget.toFixed(2));
        } else {
            alert('Introdu o sumă validă!');
        }
    });

    document.getElementById('addExperienceBtn')?.addEventListener('click', toggleExperienceForm);
    document.getElementById('saveExperienceBtn')?.addEventListener('click', saveExperience);
    document.getElementById('cancelExperienceBtn')?.addEventListener('click', toggleExperienceForm);

    const ratingSlider = document.getElementById('experienceRating');
    if (ratingSlider) {
        ratingSlider.addEventListener('input', updateRatingValue);
    }

    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.stopPropagation();
            handleTabSwitch(e);
        });
    });

    document.getElementById('resetPlanningBtn')?.addEventListener('click', resetPlanning);

    document.getElementById('destination')?.addEventListener('blur', validateField);
    document.getElementById('startDate')?.addEventListener('blur', validateField);
    document.getElementById('endDate')?.addEventListener('blur', validateField);
}

// ==================== PLANNING FORM ====================
function handlePlanningSubmit(e) {
    e.preventDefault();

    if (!validatePlanningForm()) {
        return;
    }

    appData.trip = {
        destination: document.getElementById('destination').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        travelers: parseInt(document.getElementById('travelers').value),
        purpose: document.getElementById('purpose').value
    };

    // Reseteaza datele din alte calatorii
    appData.activities = [];
    appData.packingItems = [];
    appData.expenses = [];
    appData.totalBudget = 0;
    appData.experiences = [];
    appData.currency = 'USD';

    saveDataToStorage();
    showLoginSection();
}

function showLoginSection() {
    const loginSection = document.getElementById('loginSection');
    const loginButton = document.getElementById('loginButton');
    const loginPassword = document.getElementById('loginPassword');
    const errorMsg = document.getElementById('loginError');

    loginPassword.value = '';
    if (errorMsg) errorMsg.style.display = 'none';

    loginButton.onclick = function() {
        const correctPassword = appData.trip.destination.substring(0, 3).toUpperCase();
        const enteredPassword = loginPassword.value.trim().toUpperCase();

        if (enteredPassword === correctPassword) {
            loginSection.style.display = 'none';
            document.getElementById('planningFormContainer').style.display = 'none';
            document.getElementById('itinerarySection').style.display = 'block';
            
            // Marchez tab-ul Itinerar ca active
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelector('[data-section="itinerarySection"]').classList.add('active');
            
            updateWelcomeHeader();
        } else {
            if (errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.textContent = `Parola incorectă. Hint: Primele 3 litere din ${appData.trip.destination}`;
            }
            loginPassword.value = '';
        }
    };

    // Permite Enter key
    loginPassword.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });

    loginSection.style.display = 'block';
}

function updateWelcomeHeader() {
    const header = document.getElementById('welcomeHeader');
    if (appData.trip) {
        header.textContent = `Bine ai venit! Călătoria ta: ${appData.trip.destination} (${appData.trip.startDate} - ${appData.trip.endDate})`;
        header.style.display = 'block';
    }
}

// ==================== ACTIVITY MANAGEMENT ====================
function toggleActivityForm() {
    const form = document.getElementById('activityFormContainer');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

function saveActivity() {
    const date = document.getElementById('activityDate').value;
    const time = document.getElementById('activityTime').value;
    const name = document.getElementById('activityName').value.trim();
    const location = document.getElementById('activityLocation').value.trim();
    const category = document.getElementById('activityCategory').value;
    const duration = document.getElementById('activityDuration').value;
    const notes = document.getElementById('activityNotes').value.trim();

    if (!date || !time || !name || !location || !category) {
        alert('Completați toate câmpurile obligatorii!');
        return;
    }

    const activity = {
        id: Date.now(),
        date,
        time,
        name,
        location,
        category,
        duration: parseInt(duration),
        notes
    };

    appData.activities.push(activity);
    saveDataToStorage();
    displayActivities();
    toggleActivityForm();
    clearActivityForm();
}

function clearActivityForm() {
    document.getElementById('activityDate').value = '';
    document.getElementById('activityTime').value = '';
    document.getElementById('activityName').value = '';
    document.getElementById('activityLocation').value = '';
    document.getElementById('activityCategory').value = '';
    document.getElementById('activityDuration').value = '60';
    document.getElementById('activityNotes').value = '';
}

function deleteActivity(id) {
    appData.activities = appData.activities.filter(a => a.id !== id);
    saveDataToStorage();
    displayActivities();
}

function displayActivities() {
    const container = document.getElementById('activitiesList');
    if (!container) return;

    if (appData.activities.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Nicio activitate adăugată încă.</p>';
        return;
    }

    const sortedActivities = [...appData.activities].sort((a, b) => {
        return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
    });

    container.innerHTML = sortedActivities.map(activity => `
        <div class="activity-item">
            <div>
                <h4>${activity.name}</h4>
                <div class="activity-time">📅 ${activity.date} | 🕐 ${activity.time}</div>
                <div class="activity-location">📍 ${activity.location}</div>
                <div>⏱️ ${activity.duration} minute | 🏷️ ${activity.category}</div>
                ${activity.notes ? `<div class="activity-notes">"${activity.notes}"</div>` : ''}
            </div>
            <div class="activity-actions">
                <button class="delete-activity-btn" onclick="deleteActivity(${activity.id})">Șterge</button>
            </div>
        </div>
    `).join('');
}

// ==================== MAP SECTION ====================
function showMapSection() {
    document.getElementById('itinerarySection').style.display = 'none';
    document.getElementById('mapSection').style.display = 'block';
    drawMap();
    displayTimeline();
}

function hideMapSection() {
    document.getElementById('mapSection').style.display = 'none';
    document.getElementById('itinerarySection').style.display = 'block';
}

function drawMap() {
    const container = document.getElementById('mapCircles');
    const title = document.getElementById('mapTitle');
    
    container.innerHTML = '';
    title.textContent = `${appData.trip?.destination || 'Destinație'} - Hartă interactivă`;

    if (appData.activities.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 50px; color: #999;">Nicio activitate planificată.</p>';
        return;
    }

    const sortedActivities = [...appData.activities].sort((a, b) => {
        return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
    });

    sortedActivities.forEach((activity, index) => {
        const x = 100 + (index % 5) * 150;
        const y = 80 + Math.floor(index / 5) * 150;

        const circleDiv = document.createElement('div');
        circleDiv.style.position = 'absolute';
        circleDiv.style.left = (x - 30) + 'px';
        circleDiv.style.top = y + 'px';
        circleDiv.style.width = '60px';
        circleDiv.style.height = '60px';
        circleDiv.style.borderRadius = '50%';
        circleDiv.style.backgroundColor = '#667eea';
        circleDiv.style.display = 'flex';
        circleDiv.style.alignItems = 'center';
        circleDiv.style.justifyContent = 'center';
        circleDiv.style.color = 'white';
        circleDiv.style.fontWeight = 'bold';
        circleDiv.style.fontSize = '18px';
        circleDiv.style.cursor = 'pointer';
        circleDiv.style.transition = 'transform 0.2s';
        circleDiv.textContent = index + 1;

        circleDiv.addEventListener('mouseenter', () => {
            circleDiv.style.transform = 'scale(1.15)';
            const timelineItem = document.querySelector(`.timeline-item-${index}`);
            if (timelineItem) timelineItem.style.backgroundColor = '#fff3cd';
        });
        
        circleDiv.addEventListener('mouseleave', () => {
            circleDiv.style.transform = 'scale(1)';
            const timelineItem = document.querySelector(`.timeline-item-${index}`);
            if (timelineItem) timelineItem.style.backgroundColor = 'white';
        });

        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.left = x + 'px';
        label.style.top = (y + 70) + 'px';
        label.style.transform = 'translateX(-50%)';
        label.style.fontSize = '12px';
        label.style.color = '#333';
        label.style.textAlign = 'center';
        label.style.width = '100px';
        label.textContent = activity.location.substring(0, 15);

        container.appendChild(circleDiv);
        container.appendChild(label);
    });
}

function displayTimeline() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    if (appData.activities.length === 0) {
        timeline.innerHTML = '<p style="color: #999;">Nicio activitate planificată.</p>';
        return;
    }

    const sortedActivities = [...appData.activities].sort((a, b) => {
        return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
    });

    timeline.innerHTML = sortedActivities.map((activity, index) => `
        <div class="timeline-item timeline-item-${index}" style="transition: background-color 0.3s ease;">
            <div>
                <div class="timeline-time">${activity.time}</div>
                <div style="font-weight: 600;">${activity.name}</div>
                <div style="color: #666; font-size: 0.9em;">${activity.location}</div>
            </div>
            <div style="text-align: right;">
                <div style="color: #764ba2; font-weight: 600;">${activity.duration} min</div>
            </div>
        </div>
    `).join('');
}

// ==================== PACKING LIST ====================
function generateAutoPackingList() {
    const categories = {
        documents: ['Pașaport', 'Bilet aerian', 'Confirmări hotel', 'Asigurare de călătorie', 'Cartă de credit'],
        clothing: ['Îmbrăcăminte corespunzătoare', 'Încălțăminte confortabilă', 'Haine pentru noapte', 'Jachetă', 'Șapcă/Pălărie'],
        toiletries: ['Periuță de dinți', 'Pasta de dinți', 'Săpun', 'Șampon', 'Deodorant', 'Medicamente personale'],
        electronics: ['Telefon', 'Încărcător', 'Adaptor electric', 'Camera foto', 'Power bank'],
        accessories: ['Portofel', 'Chei', 'Ochelari de soare', 'Umbrelă', 'Rucsac'],
        medications: ['Aspirină', 'Antidiaraic', 'Bandaje', 'Cremă SPF']
    };

    appData.packingItems = [];

    Object.entries(categories).forEach(([category, items]) => {
        items.forEach((item) => {
            itemIdCounter++;
            appData.packingItems.push({
                id: itemIdCounter,
                name: item,
                category: category,
                quantity: 1,
                packed: false
            });
        });
    });

    saveDataToStorage();
    displayPacking();
    alert('Lista de bagaj a fost generată automat!');
}

function displayPacking() {
    const container = document.getElementById('packingList');
    if (!container) return;

    if (appData.packingItems.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Nicio articol de bagaj. Generați o listă automată!</p>';
        return;
    }

    const categories = {};
    appData.packingItems.forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = [];
        }
        categories[item.category].push(item);
    });

    const categoryLabels = {
        documents: '📄 Documente',
        clothing: '👕 Îmbrăcăminte',
        toiletries: '🧴 Igienă personală',
        electronics: '🔌 Electronice',
        accessories: '🎒 Accesorii',
        medications: '💊 Medicamente'
    };

    let html = '';
    Object.entries(categories).forEach(([category, items]) => {
        html += `
            <div class="packing-category">
                <h4>${categoryLabels[category] || category}</h4>
                <div class="packing-items">
                    ${items.map(item => `
                        <div class="packing-item ${item.packed ? 'checked' : ''}">
                            <input type="checkbox" ${item.packed ? 'checked' : ''} onchange="togglePackingItem(${item.id})">
                            <div class="packing-item-info">
                                <div class="packing-item-name">${item.name}</div>
                                <div class="packing-item-quantity">Cantitate: ${item.quantity}</div>
                            </div>
                            <button class="delete-packing-btn" onclick="deletePackingItem(${item.id})">Șterge</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function togglePackingItem(id) {
    const item = appData.packingItems.find(i => i.id === id);
    if (item) {
        item.packed = !item.packed;
        saveDataToStorage();
        displayPacking();
    }
}

function deletePackingItem(id) {
    appData.packingItems = appData.packingItems.filter(i => i.id !== id);
    saveDataToStorage();
    displayPacking();
}

// ==================== BUDGET MANAGEMENT ====================
function toggleExpenseForm() {
    const form = document.getElementById('expenseFormContainer');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

function saveExpense() {
    const category = document.getElementById('expenseCategory').value;
    const description = document.getElementById('expenseDescription').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);

    if (!category || !description || isNaN(amount) || amount <= 0) {
        alert('Completați toate câmpurile corect!');
        return;
    }

    const expense = {
        id: Date.now(),
        category,
        description,
        amount
    };

    appData.expenses.push(expense);
    saveDataToStorage();
    displayBudgetSummary();
    displayExpenses();
    toggleExpenseForm();
    clearExpenseForm();
}

function clearExpenseForm() {
    document.getElementById('expenseCategory').value = '';
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseStatus').value = 'planned';
}

function deleteExpense(id) {
    appData.expenses = appData.expenses.filter(e => e.id !== id);
    saveDataToStorage();
    displayBudgetSummary();
    displayExpenses();
}

function displayBudgetSummary() {
    const currency = appData.currency || 'USD';
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) {
        currencySelect.value = currency;
    }

    const totalBudget = appData.totalBudget;
    const totalSpent = appData.expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalBudget - totalSpent;

    const totalConverted = convertCurrency(totalBudget, currency);
    const spentConverted = convertCurrency(totalSpent, currency);
    const remainingConverted = convertCurrency(remaining, currency);

    document.getElementById('totalBudget').textContent = formatCurrency(totalConverted, currency);
    document.getElementById('totalSpent').textContent = formatCurrency(spentConverted, currency);
    document.getElementById('remainingBudget').textContent = formatCurrency(remainingConverted, currency);
}

function displayExpenses() {
    const container = document.getElementById('expensesList');
    if (!container) return;

    const currency = appData.currency || 'USD';

    if (appData.expenses.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Nicio cheltuială înregistrată.</p>';
        return;
    }

    container.innerHTML = appData.expenses.map(expense => {
        const convertedAmount = convertCurrency(expense.amount, currency);
        return `
        <div class="expense-item ${expense.status}">
            <div class="expense-info">
                <div class="expense-category">${expense.category}</div>
                <div class="expense-description">${expense.description}</div>
                <div class="expense-status">${expense.status === 'planned' ? '⏳ Planificată' : '✅ Cheltuită'}</div>
            </div>
            <div class="expense-amount">${formatCurrency(convertedAmount, currency)}</div>
            <button class="delete-expense-btn" onclick="deleteExpense(${expense.id})">Șterge</button>
        </div>
    `}).join('');
}

// ==================== EXPERIENCES ====================
function toggleExperienceForm() {
    const form = document.getElementById('experienceFormContainer');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

function updateRatingValue() {
    const rating = document.getElementById('experienceRating').value;
    document.getElementById('ratingValue').textContent = rating;
}

function saveExperience() {
    const name = document.getElementById('experienceName').value.trim();
    const type = document.getElementById('experienceType').value;
    const description = document.getElementById('experienceDescription').value.trim();
    const location = document.getElementById('experienceLocation').value.trim();
    const rating = parseInt(document.getElementById('experienceRating').value);

    if (!name || !type || !description || !location) {
        alert('Completați toate câmpurile!');
        return;
    }

    const experience = {
        id: Date.now(),
        name,
        type,
        description,
        location,
        rating
    };

    appData.experiences.push(experience);
    saveDataToStorage();
    displayExperiences();
    toggleExperienceForm();
    clearExperienceForm();
}

function clearExperienceForm() {
    document.getElementById('experienceName').value = '';
    document.getElementById('experienceType').value = '';
    document.getElementById('experienceDescription').value = '';
    document.getElementById('experienceLocation').value = '';
    document.getElementById('experienceRating').value = '3';
    document.getElementById('ratingValue').textContent = '3';
}

function deleteExperience(id) {
    appData.experiences = appData.experiences.filter(e => e.id !== id);
    saveDataToStorage();
    displayExperiences();
}

function displayExperiences() {
    const container = document.getElementById('experiencesGrid');
    if (!container) return;

    if (appData.experiences.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1/-1;">Nicio experiență adăugată.</p>';
        return;
    }

    const typeLabels = {
        authentic: '🌍 Autentică',
        tourist: '📸 Turistică',
        mixed: '🎭 Amestecată'
    };

    const stars = (rating) => '⭐'.repeat(rating);

    container.innerHTML = appData.experiences.map(experience => `
        <div class="experience-card">
            <div class="experience-card-header">
                <h3>${experience.name}</h3>
                <span class="experience-type">${typeLabels[experience.type]}</span>
            </div>
            <div class="experience-card-body">
                <div class="experience-location">📍 ${experience.location}</div>
                <div class="experience-description">${experience.description}</div>
                <div class="experience-rating">${stars(experience.rating)} ${experience.rating}/5</div>
                <div class="experience-actions">
                    <button class="delete-experience-btn" onclick="deleteExperience(${experience.id})">Șterge</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== NAVIGATION ====================
function handleTabSwitch(e) {
    // Gaseste butonul
    let button = e.target;
    while (button && !button.classList.contains('nav-tab')) {
        button = button.parentElement;
    }
    
    if (!button) return;
    
    const sectionId = button.getAttribute('data-section');
    if (!sectionId) return;

    console.log('Schimb la secțiune:', sectionId);

    // Ascunde TOATE sectiunile
    document.getElementById('planningFormContainer').style.display = 'none';
    document.getElementById('itinerarySection').style.display = 'none';
    document.getElementById('mapSection').style.display = 'none';
    document.getElementById('packingSection').style.display = 'none';
    document.getElementById('budgetSection').style.display = 'none';
    document.getElementById('experiencesSection').style.display = 'none';

    // Arata sectiunea selectata
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        console.log('Arătat:', sectionId);
    }

    // Schimba active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    button.classList.add('active');
}

// ==================== FIELD VALIDATION ====================
function validateField(e) {
    const field = e.target;
    if (field.id === 'destination' && field.value.length < 3) {
        showError('destinationError');
    } else if (field.id === 'startDate' && !field.value) {
        showError('startDateError');
    } else if (field.id === 'endDate') {
        const startDate = document.getElementById('startDate').value;
        if (!field.value || new Date(field.value) <= new Date(startDate)) {
            showError('endDateError');
        } else {
            hideError('endDateError');
        }
    }
}

// ==================== RESET PLANNING ====================
function resetPlanning() {
    if (!confirm('Ești sigur? Vei pierde TOATE datele călătoriei (activități, bagaj, bugete, experiențe).')) {
        return;
    }

    appData = {
        trip: null,
        activities: [],
        packingItems: [],
        expenses: [],
        experiences: [],
        currency: 'USD'
    };

    localStorage.removeItem('travelAssistantData');

    document.getElementById('planningFormContainer').style.display = 'block';
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('welcomeHeader').style.display = 'none';
    document.getElementById('itinerarySection').style.display = 'none';
    document.getElementById('packingSection').style.display = 'none';
    document.getElementById('budgetSection').style.display = 'none';
    document.getElementById('experiencesSection').style.display = 'none';
    document.getElementById('mapSection').style.display = 'none';
    document.getElementById('planningForm').reset();

    alert('Plan resetat! Poți introduce o nouă călătorie.');
}

// ==================== DISPLAY ALL DATA ====================
function displayAllData() {
    displayActivities();
    displayPacking();
    displayBudgetSummary();
    displayExpenses();
    displayExperiences();

    if (appData.trip) {
        updateWelcomeHeader();
        document.getElementById('planningFormContainer').style.display = 'block';
        document.getElementById('planningForm').style.display = 'block';
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('itinerarySection').style.display = 'none';
        
        // Umple input-ul cu valoarea salvata
        const totalBudgetInput = document.getElementById('totalBudgetInput');
        if (totalBudgetInput && appData.totalBudget > 0) {
            totalBudgetInput.value = appData.totalBudget;
        }
    }
}
