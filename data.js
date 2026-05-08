// ================================
// AXIOM — Data Storage Engine
// All data saved to localStorage
// ================================

const AXIOM_DATA_KEY = 'axiom_financial_data';
const AXIOM_GOALS_KEY = 'axiom_goals';

// SAVE DATA
function saveData() {
    const data = {
        // Liquid Assets
        savings: getVal('savings'),
        fd: getVal('fd'),
        cash: getVal('cash'),
        
        // Investments
        mutual_funds: getVal('mutual_funds'),
        stocks: getVal('stocks'),
        ppf: getVal('ppf'),
        nps: getVal('nps'),
        crypto: getVal('crypto'),
        
        // Real Assets
        property: getVal('property'),
        gold: getVal('gold'),
        vehicle: getVal('vehicle'),
        business: getVal('business'),
        
        // Liabilities
        home_loan: getVal('home_loan'),
        car_loan: getVal('car_loan'),
        personal_loan: getVal('personal_loan'),
        edu_loan: getVal('edu_loan'),
        credit_card: getVal('credit_card'),
        other_loans: getVal('other_loans'),
        
        // Income
        monthly_income: getVal('monthly_income'),
        monthly_expenses: getVal('monthly_expenses'),
        monthly_invest: getVal('monthly_invest'),
        monthly_emi: getVal('monthly_emi'),
        user_age: getVal('user_age'),
        
        // Insurance
        life_insurance: getVal('life_insurance'),
        health_insurance: getVal('health_insurance'),
        
        // Metadata
        saved_at: new Date().toISOString()
    };
    
    localStorage.setItem(AXIOM_DATA_KEY, JSON.stringify(data));
    showToast('✅ Financial data saved successfully!');
    calculateAll();
    return data;
}

// LOAD DATA
function loadData() {
    const saved = localStorage.getItem(AXIOM_DATA_KEY);
    if (!saved) return null;
    
    try {
        const data = JSON.parse(saved);
        
        // Fill all inputs
        const fields = [
            'savings', 'fd', 'cash',
            'mutual_funds', 'stocks', 'ppf', 'nps', 'crypto',
            'property', 'gold', 'vehicle', 'business',
            'home_loan', 'car_loan', 'personal_loan', 'edu_loan', 
            'credit_card', 'other_loans',
            'monthly_income', 'monthly_expenses', 
            'monthly_invest', 'monthly_emi', 'user_age',
            'life_insurance', 'health_insurance'
        ];
        
        fields.forEach(field => {
            const el = document.getElementById(field);
            if (el && data[field]) {
                el.value = data[field];
            }
        });
        
        return data;
    } catch(e) {
        return null;
    }
}

// SAVE GOALS
function saveGoals(goals) {
    localStorage.setItem(AXIOM_GOALS_KEY, JSON.stringify(goals));
}

// LOAD GOALS
function loadGoals() {
    const saved = localStorage.getItem(AXIOM_GOALS_KEY);
    if (!saved) return [];
    try {
        return JSON.parse(saved);
    } catch(e) {
        return [];
    }
}

// HELPER: Get input value
function getVal(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    return parseFloat(el.value) || 0;
}

// FORMAT CURRENCY (Indian system)
function formatCurrency(amount) {
    if (amount >= 10000000) {
        return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
    } else if (amount >= 100000) {
        return '₹' + (amount / 100000).toFixed(2) + ' L';
    } else if (amount >= 1000) {
        return '₹' + (amount / 1000).toFixed(1) + 'K';
    }
    return '₹' + amount.toFixed(0);
}

// FORMAT NUMBER
function formatNumber(n) {
    return new Intl.NumberFormat('en-IN').format(Math.round(n));
}

// SHOW TOAST
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}