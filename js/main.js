activateBtns();

function activateBtns() {
    const nums = document.querySelectorAll('.num');
    nums.forEach(num => num.addEventListener('click', populateDisplay));

    const operatorBtns = document.querySelectorAll('.operator');
    operatorBtns.forEach(operatorBtn => operatorBtn.addEventListener('click', doOperation));

    const clearBtn = document.getElementById('clear');
    clearBtn.addEventListener('click', resetCalculator);

    const switchSignBtn = document.getElementById('switch-sign');
    switchSignBtn.addEventListener('click', switchSign);

    const percentBtn = document.getElementById('percent');
    percentBtn.addEventListener('click', convertPercent);

    const dotBtn = document.getElementById('dot');
    dotBtn.addEventListener('click', addDot);

    const backspaceBtn = document.getElementById('backspace');
    backspaceBtn.addEventListener('click', backspace);
}

function backspace() {
    const calcDisplay = document.getElementById('number-display');
    // Figure out how to remove last character of a string (don't remove if textContent is only '0')

}
function addDot() {
    // Find way to allow the dot to be the first character
    const calcDisplay = document.getElementById('number-display');
    if (calcDisplay.textContent == '0' || calcDisplay.dataset.num2 == '0') {
        calcDisplay.textContent = '.';
        calcDisplay.dataset.num2 += '.';
        return;
    }
    
    if (hasOneDot(calcDisplay)) {
        const reminderMessage = document.getElementById('reminder-message');
        reminderMessage.style.visibility = 'visible';
        reminderMessage.textContent = 'Only Enter one Dot';
        return;
    }
    
    calcDisplay.textContent += '.';
    calcDisplay.dataset.num2 += '.';
}

function hideReminderMessage() {
    document.getElementById('reminder-message').style.visibility = 'hidden';
}

function hasOneDot(display) {
    return display.textContent.includes('.')
} 

function convertPercent() {
    const calcDisplay = document.getElementById('number-display');
    const percentNum = String(+calcDisplay.dataset.num2 / 100);
    calcDisplay.dataset.num2 = calcDisplay.textContent = percentNum;
}

function switchSign() {
    const calcDisplay = document.getElementById('number-display');
    const oppSignNum = String(+calcDisplay.dataset.num2 * -1);
    calcDisplay.dataset.num2 = calcDisplay.textContent = oppSignNum;
}

function doOperation(e) {
    hideReminderMessage();
    const calcDisplay = document.getElementById('number-display');
    let num1 = +calcDisplay.dataset.num1;
    let num2 = +calcDisplay.dataset.num2;
    let oldOperator = calcDisplay.dataset.operator;
    let newOperator = e.target.getAttribute('id');
    // What happens if user presses an two operators consecutively (not dividing by 0)
    if (num2 == 0 && oldOperator != '/') return;
    let result = operate(num1, num2, oldOperator);
    if (newOperator != '=') {
        updateDisplayAndData(calcDisplay, result, newOperator);
    }
    else {
        alterDisplayAndData(calcDisplay, result);
    }
}

function alterDisplayAndData(display, result) {
    hideReminderMessage();
    display.textContent = result;
    if (result === 'ERROR') result = '0';
    display.dataset.num2 = result;
    display.dataset.operator = '+';
    display.dataset.num1 = '0';
    const nums = document.querySelectorAll('.num');
    nums.forEach(num => {
        num.removeEventListener('click', populateDisplay);
        num.addEventListener('click', partialReset);
        num.addEventListener('click', populateDisplay);
    });
    const dotBtn = document.getElementById('dot');
    dotBtn.removeEventListener('click', addDot);
    dotBtn.addEventListener('click', partialReset);
    dotBtn.addEventListener('click', addDot);
}

function partialReset() {
    const calcDisplay = document.getElementById('number-display');
    calcDisplay.textContent = calcDisplay.dataset.num1 = calcDisplay.dataset.num2 = '0';
    calcDisplay.dataset.operator = '+';
    const nums = document.querySelectorAll('.num');
    nums.forEach(num => num.removeEventListener('click', partialReset))
    const dotBtn = document.getElementById('dot');
    dotBtn.removeEventListener('click', partialReset);

}

function updateDisplayAndData(display, result, operator) {
    display.textContent = result;
    if (result === 'ERROR') result = '0';
    display.dataset.num1 = result;
    display.dataset.operator = operator;
    display.dataset.num2 = '0';
    const nums = document.querySelectorAll('.num');
    nums.forEach(num => {
        num.removeEventListener('click', populateDisplay);
        num.removeEventListener('click', partialReset);
        num.addEventListener('click', resetDisplay);
        num.addEventListener('click', populateDisplay);
    })
    const dotBtn = document.getElementById('dot');
    dotBtn.removeEventListener('click', addDot);
    dotBtn.removeEventListener('click', partialReset);
    dotBtn.addEventListener('click', resetDisplay);
    dotBtn.addEventListener('click', addDot);
}

function resetDisplay() {
    const nums = document.querySelectorAll('.num');
    document.getElementById('number-display').textContent = '';
    nums.forEach(num => num.removeEventListener('click', resetDisplay));
    const dotBtn = document.getElementById('dot');
    dotBtn.removeEventListener('click', resetDisplay);
    
}

function resetCalculator() {
    const calcDisplay = document.getElementById('number-display');
    calcDisplay.textContent = calcDisplay.dataset.num1 = calcDisplay.dataset.num2 = '0';
    calcDisplay.dataset.operator = '+';
}

function populateDisplay(e) {
    hideReminderMessage();
    const calcDisplay = document.getElementById('number-display');
    // Condition for initial state of calculator
    if (calcDisplay.textContent == '0') calcDisplay.textContent = '';
    const newNum = e.target.textContent;
    calcDisplay.textContent += newNum;
    calcDisplay.dataset.num2 += newNum;
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(num1, num2, operator) {
    switch(operator) {
        case '+':
            return add(num1, num2);
        case '-':
            return subtract(num1, num2);
        case '*':
            return multiply(num1, num2);
        case '/':
            return num2 != 0 ? divide(num1, num2) : 'ERROR';
    }
}