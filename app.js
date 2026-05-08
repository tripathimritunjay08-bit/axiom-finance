// ================================
// AXIOM - Complete App Logic
// ================================

var goals = [];
var COLORS = ['#6c63ff','#00d084','#ff6b9d','#ffa502','#00d2d3','#ff4757'];

// ================================
// NAVIGATION - THIS IS THE KEY FIX
// ================================

function showSection(name) {

    // Step 1: Hide ALL sections
    var sections = document.querySelectorAll('.content-section');
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
        sections[i].style.display = 'none';
    }

    // Step 2: Show the ONE we want
    var target = document.getElementById('section-' + name);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }

    // Step 3: Update sidebar highlight
    var navItems = document.querySelectorAll('.nav-item');
    for (var j = 0; j < navItems.length; j++) {
        navItems[j].classList.remove('active');
    }
    event.currentTarget.classList.add('active');

    // Step 4: Update page title
    var titles = {
        overview:  ['Financial Overview', 'Your complete financial picture'],
        assets:    ['My Assets and Liabilities', 'Enter your financial data here'],
        portfolio: ['Investment Portfolio', 'Track your investments'],
        goals:     ['Financial Goals', 'Plan your future'],
        insights:  ['AI Insights', 'Personalized recommendations'],
        risk:      ['Risk Analysis', 'Understand your financial risk']
    };

    if (titles[name]) {
        var titleEl = document.getElementById('page-title');
        var subEl = document.getElementById('page-subtitle');
        if (titleEl) titleEl.textContent = titles[name][0];
        if (subEl) subEl.textContent = titles[name][1];
    }

    // Step 5: Run calculations
    calculateAll();
}

// ================================
// GET VALUE FROM INPUT
// ================================

function getVal(id) {
    var el = document.getElementById(id);
    if (!el) return 0;
    var val = parseFloat(el.value);
    return isNaN(val) ? 0 : val;
}

// ================================
// FORMAT CURRENCY
// ================================

function formatCurrency(amount) {
    if (amount >= 10000000) {
        return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
    } else if (amount >= 100000) {
        return '₹' + (amount / 100000).toFixed(2) + ' L';
    } else if (amount >= 1000) {
        return '₹' + (amount / 1000).toFixed(1) + 'K';
    }
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

function formatNumber(n) {
    return Math.round(n).toLocaleString('en-IN');
}

// ================================
// SET TEXT HELPER
// ================================

function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ================================
// SHOW TOAST MESSAGE
// ================================

function showToast(msg) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

// ================================
// SAVE DATA
// ================================

function saveData() {
    var data = {
        savings: getVal('savings'),
        fd: getVal('fd'),
        cash: getVal('cash'),
        mutual_funds: getVal('mutual_funds'),
        stocks: getVal('stocks'),
        ppf: getVal('ppf'),
        nps: getVal('nps'),
        crypto: getVal('crypto'),
        property: getVal('property'),
        gold: getVal('gold'),
        vehicle: getVal('vehicle'),
        business: getVal('business'),
        home_loan: getVal('home_loan'),
        car_loan: getVal('car_loan'),
        personal_loan: getVal('personal_loan'),
        edu_loan: getVal('edu_loan'),
        credit_card: getVal('credit_card'),
        other_loans: getVal('other_loans'),
        monthly_income: getVal('monthly_income'),
        monthly_expenses: getVal('monthly_expenses'),
        monthly_invest: getVal('monthly_invest'),
        monthly_emi: getVal('monthly_emi'),
        user_age: getVal('user_age'),
        life_insurance: getVal('life_insurance'),
        health_insurance: getVal('health_insurance')
    };

    localStorage.setItem('axiom_data', JSON.stringify(data));
    showToast('Data saved successfully!');
    calculateAll();
}

// ================================
// LOAD SAVED DATA
// ================================

function loadSavedData() {
    var saved = localStorage.getItem('axiom_data');
    if (!saved) return;

    try {
        var data = JSON.parse(saved);
        var fields = Object.keys(data);
        for (var i = 0; i < fields.length; i++) {
            var el = document.getElementById(fields[i]);
            if (el && data[fields[i]]) {
                el.value = data[fields[i]];
            }
        }
        calculateAll();
    } catch(e) {
        console.log('No saved data found');
    }
}

// ================================
// MAIN CALCULATE FUNCTION
// ================================

function calculateAll() {

    // Get all values
    var savings      = getVal('savings');
    var fd           = getVal('fd');
    var cash         = getVal('cash');
    var mutual_funds = getVal('mutual_funds');
    var stocks       = getVal('stocks');
    var ppf          = getVal('ppf');
    var nps          = getVal('nps');
    var crypto       = getVal('crypto');
    var property     = getVal('property');
    var gold         = getVal('gold');
    var vehicle      = getVal('vehicle');
    var business     = getVal('business');

    var home_loan    = getVal('home_loan');
    var car_loan     = getVal('car_loan');
    var personal_loan = getVal('personal_loan');
    var edu_loan     = getVal('edu_loan');
    var credit_card  = getVal('credit_card');
    var other_loans  = getVal('other_loans');

    var monthly_income   = getVal('monthly_income');
    var monthly_expenses = getVal('monthly_expenses');
    var monthly_invest   = getVal('monthly_invest');
    var monthly_emi      = getVal('monthly_emi');
    var user_age         = getVal('user_age') || 18;

    // Calculate totals
    var liquidAssets  = savings + fd + cash;
    var investments   = mutual_funds + stocks + ppf + nps + crypto;
    var realAssets    = property + gold + vehicle + business;
    var totalAssets   = liquidAssets + investments + realAssets;
    var totalLiab     = home_loan + car_loan + personal_loan + 
                        edu_loan + credit_card + other_loans;
    var netWorth      = totalAssets - totalLiab;

    // ---- UPDATE OVERVIEW ----

    setText('total-networth', '₹' + formatNumber(netWorth));
    setText('total-assets-display', '₹' + formatNumber(totalAssets));
    setText('total-liabilities-display', '₹' + formatNumber(totalLiab));

    // Net worth message
    var changeEl = document.getElementById('networth-change');
    if (changeEl) {
        if (netWorth > 0) {
            changeEl.textContent = 'Positive net worth — you own more than you owe';
            changeEl.style.color = 'var(--green)';
        } else if (netWorth < 0) {
            changeEl.textContent = 'Negative net worth — focus on reducing debt first';
            changeEl.style.color = 'var(--red)';
        } else {
            changeEl.textContent = 'Enter your assets to begin';
            changeEl.style.color = 'var(--text-muted)';
        }
    }

    // Quick stats
    setText('liquid-cash', formatCurrency(liquidAssets));
    setText('liquid-percent', totalAssets > 0 ? 
        ((liquidAssets/totalAssets)*100).toFixed(1) + '% of assets' : '0%');

    setText('total-investments', formatCurrency(investments));
    setText('invest-percent', totalAssets > 0 ? 
        ((investments/totalAssets)*100).toFixed(1) + '% of assets' : '0%');

    setText('real-assets', formatCurrency(realAssets));
    setText('real-percent', totalAssets > 0 ? 
        ((realAssets/totalAssets)*100).toFixed(1) + '% of assets' : '0%');

    setText('total-debt', formatCurrency(totalLiab));
    setText('debt-ratio', totalAssets > 0 ? 
        ((totalLiab/totalAssets)*100).toFixed(1) + '% debt ratio' : '0%');

    // Allocation bars
    if (totalAssets > 0) {
        var allocs = [
            {name: 'Savings and Cash', value: liquidAssets, color: '#6c63ff'},
            {name: 'Mutual Funds',     value: mutual_funds, color: '#00d084'},
            {name: 'Stocks',           value: stocks,       color: '#ff6b9d'},
            {name: 'Property',         value: property,     color: '#ffa502'},
            {name: 'Gold',             value: gold,         color: '#ffd700'},
            {name: 'PPF and NPS',      value: ppf + nps,    color: '#00d2d3'},
            {name: 'Crypto',           value: crypto,       color: '#ff4757'},
            {name: 'Business',         value: business,     color: '#5352ed'}
        ].filter(function(a) { return a.value > 0; });

        var allocEl = document.getElementById('allocation-bars');
        if (allocEl) {
            if (allocs.length === 0) {
                allocEl.innerHTML = '<div class="empty-state"><span>📊</span><p>No assets yet</p></div>';
            } else {
                var html = '';
                for (var i = 0; i < allocs.length; i++) {
                    var pct = ((allocs[i].value / totalAssets) * 100).toFixed(1);
                    html += '<div class="allocation-item">' +
                        '<div class="allocation-label-row">' +
                        '<span class="allocation-name">' + allocs[i].name + '</span>' +
                        '<span class="allocation-pct">' + pct + '% — ' + 
                            formatCurrency(allocs[i].value) + '</span>' +
                        '</div>' +
                        '<div class="allocation-bar-track">' +
                        '<div class="allocation-bar-fill" style="width:' + pct + 
                            '%;background:' + allocs[i].color + '"></div>' +
                        '</div></div>';
                }
                allocEl.innerHTML = html;
            }
        }
    }

    // Health Score
    var score = 0;

    // Emergency fund check
    var emergMonths = monthly_income > 0 ? liquidAssets / monthly_income : 0;
    var emergEl = document.getElementById('emergency-status');
    if (emergMonths >= 6) {
        score += 25;
        if (emergEl) { emergEl.textContent = 'Excellent (6+ months)'; emergEl.style.color = 'var(--green)'; }
    } else if (emergMonths >= 3) {
        score += 15;
        if (emergEl) { emergEl.textContent = 'Good (3-6 months)'; emergEl.style.color = 'var(--yellow)'; }
    } else {
        if (emergEl) { emergEl.textContent = 'Low (under 3 months)'; emergEl.style.color = 'var(--red)'; }
    }

    // Investment rate
    var investRate = monthly_income > 0 ? (monthly_invest / monthly_income) * 100 : 0;
    var investEl = document.getElementById('invest-status');
    if (investRate >= 20) {
        score += 25;
        if (investEl) { investEl.textContent = 'Excellent (' + investRate.toFixed(0) + '%)'; investEl.style.color = 'var(--green)'; }
    } else if (investRate >= 10) {
        score += 15;
        if (investEl) { investEl.textContent = 'Good (' + investRate.toFixed(0) + '%)'; investEl.style.color = 'var(--yellow)'; }
    } else {
        if (investEl) { investEl.textContent = 'Low (' + investRate.toFixed(0) + '%)'; investEl.style.color = 'var(--red)'; }
    }

    // Debt ratio
    var debtRatio = totalAssets > 0 ? (totalLiab / totalAssets) * 100 : 0;
    var debtEl = document.getElementById('debt-status');
    if (debtRatio === 0) {
        score += 25;
        if (debtEl) { debtEl.textContent = 'Debt Free!'; debtEl.style.color = 'var(--green)'; }
    } else if (debtRatio <= 30) {
        score += 20;
        if (debtEl) { debtEl.textContent = 'Healthy (' + debtRatio.toFixed(0) + '%)'; debtEl.style.color = 'var(--green)'; }
    } else if (debtRatio <= 50) {
        score += 10;
        if (debtEl) { debtEl.textContent = 'Moderate (' + debtRatio.toFixed(0) + '%)'; debtEl.style.color = 'var(--yellow)'; }
    } else {
        if (debtEl) { debtEl.textContent = 'High (' + debtRatio.toFixed(0) + '%)'; debtEl.style.color = 'var(--red)'; }
    }

    // Diversification
    var types = [mutual_funds, stocks, ppf, nps, gold, property, crypto, business]
        .filter(function(v) { return v > 0; }).length;
    var diversEl = document.getElementById('divers-status');
    if (types >= 4) {
        score += 25;
        if (diversEl) { diversEl.textContent = 'Excellent (' + types + ' types)'; diversEl.style.color = 'var(--green)'; }
    } else if (types >= 2) {
        score += 15;
        if (diversEl) { diversEl.textContent = 'Moderate (' + types + ' types)'; diversEl.style.color = 'var(--yellow)'; }
    } else {
        if (diversEl) { diversEl.textContent = 'Low (' + types + ' types)'; diversEl.style.color = 'var(--red)'; }
    }

    setText('health-score', totalAssets > 0 ? score : '--');

    // ---- PORTFOLIO ----

    setText('port-invested', formatCurrency(investments));
    setText('port-percent', totalAssets > 0 ? 
        ((investments/totalAssets)*100).toFixed(1) + '%' : '0%');
    setText('port-sip', formatCurrency(monthly_invest));

    var investItems = [
        {name: 'Mutual Funds', value: mutual_funds},
        {name: 'Stocks',       value: stocks},
        {name: 'PPF / EPF',    value: ppf},
        {name: 'NPS',          value: nps},
        {name: 'Crypto',       value: crypto}
    ].filter(function(i) { return i.value > 0; })
     .sort(function(a,b) { return b.value - a.value; });

    setText('port-largest', investItems.length > 0 ? investItems[0].name : 'None');

    var portEl = document.getElementById('portfolio-breakdown');
    if (portEl) {
        if (investItems.length === 0) {
            portEl.innerHTML = '<div class="empty-state"><span>📈</span><p>Add investments in Assets section</p></div>';
        } else {
            var portHtml = '';
            for (var p = 0; p < investItems.length; p++) {
                var ppct = investments > 0 ? ((investItems[p].value/investments)*100).toFixed(1) : 0;
                portHtml += '<div class="portfolio-item">' +
                    '<div class="portfolio-color" style="background:' + COLORS[p] + '"></div>' +
                    '<span class="portfolio-name">' + investItems[p].name + '</span>' +
                    '<span class="portfolio-value">' + formatCurrency(investItems[p].value) + '</span>' +
                    '<span class="portfolio-pct">' + ppct + '%</span>' +
                    '</div>';
            }
            portEl.innerHTML = portHtml;
        }
    }

    // Age-based recommended allocation
    var recEl = document.getElementById('recommended-allocation');
    if (recEl && user_age > 0) {
        var equityPct = Math.max(100 - user_age, 30);
        var debtPct   = Math.min(user_age, 50);
        var goldPct   = 10;
        var adjEquity = equityPct - goldPct;

        recEl.innerHTML = 
            makeAllocationBar('Equity (Stocks and MF)', adjEquity, '#6c63ff') +
            makeAllocationBar('Debt (FD, PPF, Bonds)', debtPct, '#00d084') +
            makeAllocationBar('Gold', goldPct, '#ffd700') +
            '<p style="font-size:12px;color:var(--text-muted);margin-top:12px;">' +
            'Based on your age ' + user_age + ' — Rule: ' + (100-user_age) + '% in equity</p>';
    }

    // ---- INSIGHTS ----
    updateInsights(
        liquidAssets, investments, totalAssets, totalLiab, netWorth,
        monthly_income, monthly_invest, monthly_expenses, monthly_emi,
        user_age, savings, fd, mutual_funds, stocks, ppf, nps, 
        crypto, property, gold, credit_card, business
    );

    // ---- RISK ----
    updateRisk(totalAssets, totalLiab, stocks, mutual_funds, crypto, liquidAssets);

     // ---- CHARTS ----        
    updateCharts();           
}

// Helper for allocation bar
function makeAllocationBar(name, pct, color) {
    return '<div class="allocation-item" style="margin-bottom:16px;">' +
        '<div class="allocation-label-row">' +
        '<span class="allocation-name">' + name + '</span>' +
        '<span class="allocation-pct">' + pct + '%</span>' +
        '</div>' +
        '<div class="allocation-bar-track">' +
        '<div class="allocation-bar-fill" style="width:' + pct + '%;background:' + color + '"></div>' +
        '</div></div>';
}

// ================================
// SIP CALCULATOR
// ================================

function calculateSIP() {
    var monthly  = getVal('sip_amount');
    var annual   = getVal('sip_return');
    var years    = getVal('sip_years');

    if (!monthly || !annual || !years) return;

    var r  = annual / 12 / 100;
    var n  = years * 12;
    var fv = monthly * ((Math.pow(1+r, n) - 1) / r) * (1+r);
    var invested = monthly * n;
    var gains    = fv - invested;

    setText('sip-invested', '₹' + formatNumber(invested));
    setText('sip-gains', '₹' + formatNumber(gains));
    setText('sip-final', '₹' + formatNumber(fv));
}

// ================================
// EMI CALCULATOR
// ================================

function checkEMI() {
    var loan   = getVal('loan_amount_check');
    var rate   = getVal('loan_rate_check');
    var tenure = getVal('loan_tenure_check');
    var income = getVal('monthly_income');

    if (!loan || !rate || !tenure) return;

    var r    = rate / 12 / 100;
    var n    = tenure * 12;
    var emi  = loan * r * Math.pow(1+r,n) / (Math.pow(1+r,n) - 1);
    var total = emi * n;
    var interest = total - loan;

    setText('emi-monthly', '₹' + formatNumber(emi));
    setText('emi-interest', '₹' + formatNumber(interest));
    setText('emi-total', '₹' + formatNumber(total));

    var affordEl = document.getElementById('emi-afford-status');
    if (affordEl && income > 0) {
        var pct = (emi / income) * 100;
        if (pct <= 30) {
            affordEl.textContent = 'Affordable (' + pct.toFixed(1) + '% of income)';
            affordEl.style.color = 'var(--green)';
        } else if (pct <= 50) {
            affordEl.textContent = 'Stretching (' + pct.toFixed(1) + '% of income)';
            affordEl.style.color = 'var(--yellow)';
        } else {
            affordEl.textContent = 'Unaffordable (' + pct.toFixed(1) + '% of income)';
            affordEl.style.color = 'var(--red)';
        }
    } else if (affordEl) {
        affordEl.textContent = 'Enter monthly income to check';
    }
}

// ================================
// INSURANCE CALCULATOR
// ================================

function calculateInsurance() {
    var income = getVal('monthly_income');
    var life   = getVal('life_insurance');
    var health = getVal('health_insurance');
    var el     = document.getElementById('insurance-analysis');
    if (!el) return;

    if (income === 0) {
        el.innerHTML = '<div class="empty-state"><p>Enter monthly income in Assets section first</p></div>';
        return;
    }

    var annualIncome  = income * 12;
    var neededLife    = annualIncome * 12;
    var neededHealth  = 1000000;
    var lifeGap       = neededLife - life;
    var healthGap     = neededHealth - health;

    el.innerHTML =
        '<div class="insurance-item ' + (lifeGap <= 0 ? 'good' : 'bad') + '">' +
        '<div><strong>' + (lifeGap <= 0 ? 'Life Insurance: Covered' : 'Life Insurance: Gap Found') + '</strong>' +
        '<div style="font-size:12px;margin-top:4px;">You have: ' + formatCurrency(life) + 
        ' | Recommended: ' + formatCurrency(neededLife) + '</div></div>' +
        '<strong>' + (lifeGap > 0 ? 'Gap: ' + formatCurrency(lifeGap) : 'Good!') + '</strong>' +
        '</div>' +
        '<div class="insurance-item ' + (healthGap <= 0 ? 'good' : 'bad') + '" style="margin-top:12px;">' +
        '<div><strong>' + (healthGap <= 0 ? 'Health Insurance: Covered' : 'Health Insurance: Gap Found') + '</strong>' +
        '<div style="font-size:12px;margin-top:4px;">You have: ' + formatCurrency(health) + 
        ' | Recommended: ' + formatCurrency(neededHealth) + '</div></div>' +
        '<strong>' + (healthGap > 0 ? 'Gap: ' + formatCurrency(healthGap) : 'Good!') + '</strong>' +
        '</div>';
}

// ================================
// AI INSIGHTS
// ================================

function updateInsights(
    liquidAssets, investments, totalAssets, totalLiab, netWorth,
    income, monthlyInvest, expenses, emi,
    age, savings, fd, mf, stocks, ppf, nps, 
    crypto, property, gold, creditCard, business
) {
    var insights = [];

    if (totalAssets === 0 && income === 0) {
        var emptyHtml = '<div class="empty-state full-width">' +
            '<span>🤖</span><p>Add your financial data to get AI insights</p>' +
            '<button class="btn-primary-small" onclick="showSection(\'assets\')">Add Assets</button></div>';

        var full = document.getElementById('full-insights');
        var prev = document.getElementById('insights-preview');
        if (full) full.innerHTML = emptyHtml;
        if (prev) prev.innerHTML = emptyHtml;
        return;
    }

    // Emergency fund
    var emergMonths = income > 0 ? liquidAssets / income : 0;
    if (income > 0 && emergMonths < 3) {
        insights.push({
            type: 'danger', icon: '🚨',
            title: 'Emergency Fund Missing',
            text: 'You have only ' + emergMonths.toFixed(1) + ' months of emergency coverage. You need 6 months minimum. One job loss or medical bill could be devastating.',
            action: 'Open a separate savings account and auto-transfer 10% of income every month until you reach 6 months of expenses.'
        });
    } else if (emergMonths >= 6) {
        insights.push({
            type: 'good', icon: '✅',
            title: 'Emergency Fund is Excellent',
            text: 'You have ' + emergMonths.toFixed(1) + ' months of emergency coverage. This is great financial discipline.',
            action: 'Deploy any excess beyond 6 months into higher-return investments like equity mutual funds.'
        });
    }

    // Investment rate
    if (income > 0) {
        var rate = (monthlyInvest / income) * 100;
        if (rate < 10) {
            insights.push({
                type: 'warning', icon: '📊',
                title: 'Investment Rate Too Low',
                text: 'You are investing only ' + rate.toFixed(1) + '% of income. Experts recommend minimum 20%. At this rate building real wealth will take very long.',
                action: 'Start a SIP of even Rs 500 per month more. Increase by 10% every year. Small amounts compound into crores over time.'
            });
        } else if (rate >= 30) {
            insights.push({
                type: 'good', icon: '🏆',
                title: 'Excellent Savings Rate',
                text: 'Investing ' + rate.toFixed(1) + '% of income puts you in the top 5% of Indians. You are building serious wealth.',
                action: 'Ensure your portfolio is diversified across equity, debt, and gold for the best risk-adjusted returns.'
            });
        }
    }

    // Credit card debt
    if (creditCard > 0) {
        insights.push({
            type: 'danger', icon: '💳',
            title: 'Pay Credit Card Immediately',
            text: 'Credit cards charge 36 to 45% annual interest. This is destroying your wealth faster than any investment can build it. Rs ' + formatCurrency(creditCard) + ' in debt is costing you Rs ' + formatCurrency(creditCard * 0.4) + ' per year.',
            action: 'Stop all non-essential spending. Pay off Rs ' + formatCurrency(creditCard) + ' credit card debt before making any new investments. Never carry credit card balance again.'
        });
    }

    // FD vs inflation
    var fdPct = totalAssets > 0 ? (fd / totalAssets) * 100 : 0;
    if (fdPct > 40) {
        insights.push({
            type: 'warning', icon: '📉',
            title: 'Fixed Deposits Losing Value',
            text: fdPct.toFixed(1) + '% of your wealth is in FDs. FD gives 6-7% but inflation is also 6-7%. Your real return is near zero. You are working hard to stay in the same place.',
            action: 'Move 30% of FD amount to equity mutual funds via SIP. Historical equity returns are 12-15% annually. Rs ' + formatCurrency(fd * 0.3) + ' could triple in 10 years.'
        });
    }

    // Property concentration
    if (totalAssets > 0 && property > 0) {
        var propPct = (property / totalAssets) * 100;
        if (propPct > 70) {
            insights.push({
                type: 'warning', icon: '🏠',
                title: 'Too Much in Real Estate',
                text: propPct.toFixed(1) + '% of wealth in property is very concentrated. Real estate is illiquid. You cannot sell one bathroom in an emergency.',
                action: 'Build liquid investments alongside property. Target reducing real estate to 40-50% of total portfolio over 3 to 5 years.'
            });
        }
    }

    // Diversification
    var typeCount = [mf, stocks, ppf, nps, gold, crypto, property, business]
        .filter(function(v) { return v > 0; }).length;
    if (typeCount <= 1 && totalAssets > 0) {
        insights.push({
            type: 'warning', icon: '⚠️',
            title: 'Dangerously Under-Diversified',
            text: 'Only ' + typeCount + ' asset type in your portfolio. A single bad event in that sector could wipe out your wealth.',
            action: 'Minimum target: Equity Mutual Fund plus PPF or FD plus Gold. This gives growth, safety, and inflation protection together.'
        });
    }

    // Cash flow
    if (income > 0 && expenses > 0) {
        var cashflow = income - expenses - monthlyInvest - emi;
        if (cashflow < 0) {
            insights.push({
                type: 'danger', icon: '🔴',
                title: 'Negative Cash Flow',
                text: 'You are spending Rs ' + formatCurrency(Math.abs(cashflow)) + ' more than you earn each month. This is unsustainable and building hidden debt.',
                action: 'Audit every expense this weekend. Find and cut Rs ' + formatCurrency(Math.abs(cashflow) + 5000) + ' per month. Create a zero-based budget immediately.'
            });
        }
    }

    // Crypto warning
    if (totalAssets > 0 && crypto > 0) {
        var cryptoPct = (crypto / totalAssets) * 100;
        if (cryptoPct > 10) {
            insights.push({
                type: 'warning', icon: '₿',
                title: 'High Crypto Risk',
                text: cryptoPct.toFixed(1) + '% of wealth in crypto is high risk. Crypto can drop 80% in months. Never invest more than you can afford to lose completely.',
                action: 'Keep crypto below 5-10% of portfolio. Consider booking partial profits and moving to stable assets.'
            });
        }
    }

    // Render insights
    var fullHtml = '';
    var prevHtml = '';

    for (var i = 0; i < insights.length; i++) {
        var ins = insights[i];
        var card = '<div class="insight-card ' + ins.type + '">' +
            '<div class="insight-icon">' + ins.icon + '</div>' +
            '<div class="insight-title">' + ins.title + '</div>' +
            '<div class="insight-text">' + ins.text + '</div>' +
            '<div class="insight-action">Action: ' + ins.action + '</div>' +
            '</div>';
        fullHtml += card;

        if (i < 3) {
            prevHtml += '<div class="insight-preview-item">' +
                '<span class="insight-preview-icon">' + ins.icon + '</span>' +
                '<span class="insight-preview-text"><strong>' + ins.title + ':</strong> ' + 
                ins.text.substring(0, 90) + '...</span></div>';
        }
    }

    var fullEl = document.getElementById('full-insights');
    var prevEl = document.getElementById('insights-preview');
    if (fullEl) fullEl.innerHTML = fullHtml || '<div class="empty-state full-width"><span>✅</span><p>Your finances look healthy! Keep it up.</p></div>';
    if (prevEl) prevEl.innerHTML = prevHtml || '<div class="empty-state"><span>✅</span><p>Your finances look healthy!</p></div>';
}

// ================================
// RISK ASSESSMENT
// ================================

function updateRisk(totalAssets, totalLiab, stocks, mf, crypto, liquidAssets) {
    if (totalAssets === 0) return;

    var riskScore = 0;
    var factors = [];

    var equityPct = ((stocks + mf + crypto) / totalAssets) * 100;
    if (equityPct > 70) {
        riskScore += 30;
        factors.push({name: 'Equity Exposure', val: equityPct.toFixed(1) + '%', label: 'High Risk', color: 'var(--red)'});
    } else if (equityPct > 40) {
        riskScore += 15;
        factors.push({name: 'Equity Exposure', val: equityPct.toFixed(1) + '%', label: 'Moderate', color: 'var(--yellow)'});
    } else {
        factors.push({name: 'Equity Exposure', val: equityPct.toFixed(1) + '%', label: 'Conservative', color: 'var(--green)'});
    }

    var cryptoPct = (crypto / totalAssets) * 100;
    if (cryptoPct > 10) {
        riskScore += 25;
        factors.push({name: 'Crypto Exposure', val: cryptoPct.toFixed(1) + '%', label: 'Very High Risk', color: 'var(--red)'});
    } else if (cryptoPct > 0) {
        riskScore += 5;
        factors.push({name: 'Crypto Exposure', val: cryptoPct.toFixed(1) + '%', label: 'Acceptable', color: 'var(--green)'});
    }

    var debtRatio = (totalLiab / totalAssets) * 100;
    if (debtRatio > 50) {
        riskScore += 25;
        factors.push({name: 'Debt Ratio', val: debtRatio.toFixed(1) + '%', label: 'Dangerous', color: 'var(--red)'});
    } else if (debtRatio > 25) {
        riskScore += 10;
        factors.push({name: 'Debt Ratio', val: debtRatio.toFixed(1) + '%', label: 'Manageable', color: 'var(--yellow)'});
    } else {
        factors.push({name: 'Debt Ratio', val: debtRatio.toFixed(1) + '%', label: 'Healthy', color: 'var(--green)'});
    }

    var liqPct = (liquidAssets / totalAssets) * 100;
    if (liqPct < 5) {
        riskScore += 20;
        factors.push({name: 'Liquidity', val: liqPct.toFixed(1) + '% liquid', label: 'Very Low', color: 'var(--red)'});
    } else if (liqPct < 15) {
        riskScore += 10;
        factors.push({name: 'Liquidity', val: liqPct.toFixed(1) + '% liquid', label: 'Moderate', color: 'var(--yellow)'});
    } else {
        factors.push({name: 'Liquidity', val: liqPct.toFixed(1) + '% liquid', label: 'Good', color: 'var(--green)'});
    }

    riskScore = Math.min(riskScore, 100);

    var bar = document.getElementById('risk-bar');
    if (bar) bar.style.left = riskScore + '%';

    setText('risk-score-number', riskScore);
    var riskText = document.getElementById('risk-score-text');
    if (riskText) {
        if (riskScore < 30) {
            riskText.textContent = 'Conservative Portfolio';
            riskText.style.color = 'var(--green)';
        } else if (riskScore < 60) {
            riskText.textContent = 'Moderate Risk';
            riskText.style.color = 'var(--yellow)';
        } else {
            riskText.textContent = 'High Risk Portfolio';
            riskText.style.color = 'var(--red)';
        }
    }

    var factorsEl = document.getElementById('risk-factors');
    if (factorsEl) {
        var fHtml = '';
        for (var f = 0; f < factors.length; f++) {
            fHtml += '<div class="risk-factor-item">' +
                '<span>' + factors[f].name + ': <strong>' + factors[f].val + '</strong></span>' +
                '<span class="risk-factor-score" style="color:' + factors[f].color + 
                ';background:' + factors[f].color + '15;">' + factors[f].label + '</span>' +
                '</div>';
        }
        factorsEl.innerHTML = fHtml;
    }
}

// ================================
// GOALS
// ================================

function addGoal() {
    var name   = document.getElementById('goal_name') ? 
                 document.getElementById('goal_name').value : '';
    var amount = getVal('goal_amount');
    var year   = getVal('goal_year');
    var saved  = getVal('goal_saved');

    if (!name || !amount || !year) {
        showToast('Please fill Goal Name, Amount and Year');
        return;
    }

    var currentYear = new Date().getFullYear();
    var yearsLeft   = year - currentYear;

    if (yearsLeft <= 0) {
        showToast('Target year must be in the future');
        return;
    }

    var remaining  = amount - saved;
    var months     = yearsLeft * 12;
    var r          = 12 / 12 / 100;
    var reqMonthly = remaining > 0 ?
        remaining * r / ((Math.pow(1+r, months) - 1) * (1+r)) : 0;

    var goal = {
        id: Date.now(),
        name: name,
        amount: amount,
        year: year,
        saved: saved,
        yearsLeft: yearsLeft,
        remaining: remaining,
        reqMonthly: Math.ceil(reqMonthly),
        progress: amount > 0 ? Math.min((saved/amount)*100, 100) : 0
    };

    goals.push(goal);
    localStorage.setItem('axiom_goals', JSON.stringify(goals));
    renderGoals();
    showToast('Goal added: ' + name);

    document.getElementById('goal_name').value = '';
    document.getElementById('goal_amount').value = '';
    document.getElementById('goal_year').value = '';
    document.getElementById('goal_saved').value = '';
}

function deleteGoal(id) {
    goals = goals.filter(function(g) { return g.id !== id; });
    localStorage.setItem('axiom_goals', JSON.stringify(goals));
    renderGoals();
    showToast('Goal removed');
}

function renderGoals() {
    var el = document.getElementById('goals-list');
    if (!el) return;

    var saved = localStorage.getItem('axiom_goals');
    if (saved) {
        try { goals = JSON.parse(saved); } catch(e) { goals = []; }
    }

    if (goals.length === 0) {
        el.innerHTML = '<div class="empty-state"><span>🎯</span><p>No goals yet. Add your first goal above!</p></div>';
        return;
    }

    var html = '';
    for (var i = 0; i < goals.length; i++) {
        var g = goals[i];
        html += '<div class="goal-card">' +
            '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">' +
            '<div class="goal-name">' + g.name + '</div>' +
            '<button onclick="deleteGoal(' + g.id + ')" ' +
            'style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px;">×</button>' +
            '</div>' +
            '<div class="goal-target">Target: ₹' + formatNumber(g.amount) + ' by ' + g.year + '</div>' +
            '<div class="goal-progress-bar">' +
            '<div class="goal-progress-fill" style="width:' + g.progress + '%;background:' + COLORS[i % COLORS.length] + '"></div>' +
            '</div>' +
            '<div class="goal-stats">' +
            '<span>Saved: ₹' + formatNumber(g.saved) + ' (' + g.progress.toFixed(1) + '%)</span>' +
            '<span>Remaining: ₹' + formatNumber(g.remaining) + '</span>' +
            '</div>' +
            '<div class="goal-monthly">Invest ₹' + formatNumber(g.reqMonthly) + 
            '/month to reach this goal in ' + g.yearsLeft + ' years at 12% return</div>' +
            '</div>';
    }
    el.innerHTML = html;
}

var pieChartInstance = null;
var barChartInstance = null;
var growthChartInstance = null;

function updateCharts() {
    // Get data
    var savings = getVal('savings') + getVal('fd') + getVal('cash');
    var mf = getVal('mutual_funds');
    var stocks = getVal('stocks');
    var ppf = getVal('ppf') + getVal('nps');
    var crypto = getVal('crypto');
    var property = getVal('property');
    var gold = getVal('gold');
    var business = getVal('business');
    var vehicle = getVal('vehicle');

    var totalAssets = savings + mf + stocks + ppf + crypto + 
                      property + gold + business + vehicle;

    var totalLiab = getVal('home_loan') + getVal('car_loan') + 
                    getVal('personal_loan') + getVal('edu_loan') + 
                    getVal('credit_card') + getVal('other_loans');

    // ===== PIE CHART =====
    var pieCanvas = document.getElementById('pieChart');
    if (pieCanvas && totalAssets > 0) {

        // Destroy old chart if exists
        if (pieChartInstance) pieChartInstance.destroy();

        var pieData = [
            {label: 'Savings & Cash', value: savings, color: '#6c63ff'},
            {label: 'Mutual Funds', value: mf, color: '#00d084'},
            {label: 'Stocks', value: stocks, color: '#ff6b9d'},
            {label: 'PPF/NPS', value: ppf, color: '#00d2d3'},
            {label: 'Crypto', value: crypto, color: '#ff4757'},
            {label: 'Property', value: property, color: '#ffa502'},
            {label: 'Gold', value: gold, color: '#ffd700'},
            {label: 'Business', value: business, color: '#5352ed'},
            {label: 'Vehicle', value: vehicle, color: '#888888'}
        ].filter(function(item) { return item.value > 0; });

        pieChartInstance = new Chart(pieCanvas, {
            type: 'doughnut',
            data: {
                labels: pieData.map(function(d) { return d.label; }),
                datasets: [{
                    data: pieData.map(function(d) { return d.value; }),
                    backgroundColor: pieData.map(function(d) { return d.color; }),
                    borderColor: '#16161f',
                    borderWidth: 3,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#ffffff',
                            font: { size: 12, family: 'Inter' },
                            padding: 12,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: '#16161f',
                        titleColor: '#ffffff',
                        bodyColor: '#8888aa',
                        borderColor: '#2a2a3a',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                var value = context.parsed;
                                var pct = ((value/totalAssets)*100).toFixed(1);
                                return ' ₹' + value.toLocaleString('en-IN') + ' (' + pct + '%)';
                            }
                        }
                    }
                }
            }
        });
    }

    // ===== BAR CHART =====
    var barCanvas = document.getElementById('barChart');
    if (barCanvas) {

        if (barChartInstance) barChartInstance.destroy();

        barChartInstance = new Chart(barCanvas, {
            type: 'bar',
            data: {
                labels: ['Liquid Assets', 'Investments', 'Real Assets', 'Total Liabilities'],
                datasets: [{
                    label: 'Amount in ₹',
                    data: [
                        savings,
                        mf + stocks + ppf + crypto,
                        property + gold + vehicle + business,
                        totalLiab
                    ],
                    backgroundColor: [
                        '#6c63ff',
                        '#00d084',
                        '#ffa502',
                        '#ff4757'
                    ],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#16161f',
                        titleColor: '#ffffff',
                        bodyColor: '#8888aa',
                        callbacks: {
                            label: function(context) {
                                return ' ₹' + context.parsed.y.toLocaleString('en-IN');
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#8888aa',
                            callback: function(value) {
                                if (value >= 10000000) return '₹' + (value/10000000).toFixed(1) + 'Cr';
                                if (value >= 100000) return '₹' + (value/100000).toFixed(1) + 'L';
                                if (value >= 1000) return '₹' + (value/1000).toFixed(0) + 'K';
                                return '₹' + value;
                            }
                        },
                        grid: { color: '#2a2a3a' }
                    },
                    x: {
                        ticks: { color: '#8888aa' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // ===== GROWTH PROJECTION CHART =====
    var growthCanvas = document.getElementById('growthChart');
    var monthlyInvest = getVal('monthly_invest');

    if (growthCanvas) {

        if (growthChartInstance) growthChartInstance.destroy();

        // Calculate wealth growth for next 20 years
        var currentInvestments = mf + stocks + ppf + crypto;
        var years = [];
        var conservative = [];  // 8% return
        var moderate = [];      // 12% return
        var aggressive = [];    // 15% return

        for (var y = 0; y <= 20; y++) {
            years.push('Year ' + y);

            // Future value calculation
            // FV = P(1+r)^n + PMT * [((1+r)^n - 1) / r] * (1+r)
            var n = y * 12;

            // Conservative 8%
            var r1 = 0.08 / 12;
            var fv1 = currentInvestments * Math.pow(1+r1, n);
            if (n > 0 && r1 > 0) {
                fv1 += monthlyInvest * ((Math.pow(1+r1, n) - 1) / r1) * (1+r1);
            }
            conservative.push(Math.round(fv1));

            // Moderate 12%
            var r2 = 0.12 / 12;
            var fv2 = currentInvestments * Math.pow(1+r2, n);
            if (n > 0 && r2 > 0) {
                fv2 += monthlyInvest * ((Math.pow(1+r2, n) - 1) / r2) * (1+r2);
            }
            moderate.push(Math.round(fv2));

            // Aggressive 15%
            var r3 = 0.15 / 12;
            var fv3 = currentInvestments * Math.pow(1+r3, n);
            if (n > 0 && r3 > 0) {
                fv3 += monthlyInvest * ((Math.pow(1+r3, n) - 1) / r3) * (1+r3);
            }
            aggressive.push(Math.round(fv3));
        }

        growthChartInstance = new Chart(growthCanvas, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Conservative (8%)',
                        data: conservative,
                        borderColor: '#00d2d3',
                        backgroundColor: 'rgba(0, 210, 211, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Moderate (12%)',
                        data: moderate,
                        borderColor: '#6c63ff',
                        backgroundColor: 'rgba(108, 99, 255, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3
                    },
                    {
                        label: 'Aggressive (15%)',
                        data: aggressive,
                        borderColor: '#00d084',
                        backgroundColor: 'rgba(0, 208, 132, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#ffffff',
                            font: { size: 12, family: 'Inter' },
                            usePointStyle: true,
                            padding: 16
                        }
                    },
                    tooltip: {
                        backgroundColor: '#16161f',
                        titleColor: '#ffffff',
                        bodyColor: '#8888aa',
                        callbacks: {
                            label: function(context) {
                                var value = context.parsed.y;
                                var formatted;
                                if (value >= 10000000) formatted = '₹' + (value/10000000).toFixed(2) + ' Cr';
                                else if (value >= 100000) formatted = '₹' + (value/100000).toFixed(2) + ' L';
                                else formatted = '₹' + value.toLocaleString('en-IN');
                                return context.dataset.label + ': ' + formatted;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#8888aa',
                            callback: function(value) {
                                if (value >= 10000000) return '₹' + (value/10000000).toFixed(1) + 'Cr';
                                if (value >= 100000) return '₹' + (value/100000).toFixed(0) + 'L';
                                if (value >= 1000) return '₹' + (value/1000).toFixed(0) + 'K';
                                return '₹' + value;
                            }
                        },
                        grid: { color: '#2a2a3a' }
                    },
                    x: {
                        ticks: { color: '#8888aa' },
                        grid: { color: '#2a2a3a' }
                    }
                }
            }
        });
    }
}

// ================================
// START APP WHEN PAGE LOADS
// ================================
// ================================
// CHARTS - The Magic
// ================================

window.onload = function() {

    // Make sure overview shows first
    var allSections = document.querySelectorAll('.content-section');
    for (var i = 0; i < allSections.length; i++) {
        allSections[i].style.display = 'none';
        allSections[i].classList.remove('active');
    }
    var overview = document.getElementById('section-overview');
    if (overview) {
        overview.style.display = 'block';
        overview.classList.add('active');
    }

    // Load any saved data
    var saved = localStorage.getItem('axiom_data');
    if (saved) {
        try {
            var data = JSON.parse(saved);
            var keys = Object.keys(data);
            for (var k = 0; k < keys.length; k++) {
                var el = document.getElementById(keys[k]);
                if (el && data[keys[k]]) {
                    el.value = data[keys[k]];
                }
            }
            calculateAll();
            showToast('Previous data loaded');
        } catch(e) {}
    }

    // Load goals
    var savedGoals = localStorage.getItem('axiom_goals');
    if (savedGoals) {
        try { goals = JSON.parse(savedGoals); } catch(e) { goals = []; }
    }

    console.log('AXIOM Financial Dashboard loaded successfully');
};