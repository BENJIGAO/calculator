addKeyboardSupport();

function addKeyboardSupport() {
    document.addEventListener('keydown', executeKeyIfValid)
}

function executeKeyIfValid(e) {
    console.log(e.key)
    const keyPressed = e.key;
    const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const operators = ['+', '-', 'x', '/', '='];
    switch (true) {
        case nums.includes(keyPressed):
            populateDisplay({
                target: {
                    textContent: keyPressed,
                }
            })
            return;
        case operators.includes(keyPressed):
            if (keyPressed == 'x') {
                doOperation({
                    target: {
                        getAttribute: function (irrelevantStr) {
                            return '*';
                    }
                    }
                })
                return
            }
            else if (keyPressed == '=') {
                doOperation({
                    target: {
                        getAttribute: function (irrelevantStr) {
                            return '=';
                    }
                    }
                })
                return;
            }
            else {
                doOperation({
                    target: {
                        getAttribute: function (irrelevantStr) {
                            return keyPressed;
                    }
                    }
                })
                return;
            }
        case keyPressed == '.':
            addDot();
            return;
        case keyPressed == 'Backspace':
            backspace();
            return;
        case keyPressed == 's':
            switchSign();
            return;
        case keyPressed == 'Escape':
            resetCalculator();
            return;
        case keyPressed == '%':
            convertPercent();
            return;
        case keyPressed == '^':
            square();
            return;
    }
}

function alterDisplayAndData(display, result) {
    hideReminderMessage();
    if (checkSpecialCases(display)) result = 'ERROR';
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
    document.removeEventListener('keydown', executeKeyIfValid);
    document.addEventListener('keydown', keyPartialReset);
    document.addEventListener('keydown', executeKeyIfValid);
}

function checkSpecialCases(display) {
    return display.textContent == '-' ? true : false;
}

function keyPartialReset(e) {
    const numsAndDot = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    if (numsAndDot.includes(e.key)) {
        partialReset();
    }

}

function updateDisplayAndData(display, result, operator) {
    if (checkSpecialCases(display)) result = 'ERROR';
    display.textContent = result;
    if (result === 'ERROR') result = '0';
    display.dataset.num1 = result;
    display.dataset.operator = operator;
    display.dataset.num2 = '0';
    const nums = document.querySelectorAll('.num');
    document.removeEventListener('keydown', executeKeyIfValid);
    document.removeEventListener('keydown', keyPartialReset);
    document.addEventListener('keydown', keyResetDisplay);
    document.addEventListener('keydown', executeKeyIfValid);
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

function keyResetDisplay(e) {
    const numsAndDot = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    if (numsAndDot.includes(e.key)) {
        resetDisplay();
    }
}

function doOperation(e) {
    hideReminderMessage();
    const calcDisplay = document.getElementById('number-display');
    let num1 = calcDisplay.dataset.num1;
    let num2 = calcDisplay.dataset.num2;
    let oldOperator = calcDisplay.dataset.operator;
    let newOperator = e.target.getAttribute('id');
    // What happens if user presses an two operators consecutively (not dividing by 0)
    if (num2 == '0' && oldOperator != '/') return;
    let result = operate(+num1, +num2, oldOperator);
    if (newOperator != '=') {
        updateDisplayAndData(calcDisplay, result, newOperator);
    }
    else {
        alterDisplayAndData(calcDisplay, result);
    }
}
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

    const squaredBtn = document.getElementById('squared');
    squaredBtn.addEventListener('click', square);
}

function square() {
    hideReminderMessage();
    const calcDisplay = document.getElementById('number-display');
    const squaredNum = (+calcDisplay.textContent * +calcDisplay.textContent).toFixed(8);
    calcDisplay.textContent = String(squaredNum);
    calcDisplay.dataset.num2 = '0' + squaredNum;
}

function backspace() {
    const calcDisplay = document.getElementById('number-display');
    let currentDisplay = calcDisplay.textContent
    if (currentDisplay != ' 0') {
        let tmpArr = currentDisplay.split('');
        tmpArr.pop();
        let newDisplay = tmpArr.join('');
        calcDisplay.textContent = newDisplay;
        calcDisplay.dataset.num2 = '0' + newDisplay;
    }

}
function addDot() {
    hideReminderMessage();
    const calcDisplay = document.getElementById('number-display');
    if (calcDisplay.textContent == ' 0' || calcDisplay.dataset.num2 == '0') {
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
    const percentNum = +(+calcDisplay.dataset.num2 / 100).toFixed(8);
    if (isTinyNum(percentNum)) {
        const reminderMessage = document.getElementById('reminder-message');
        reminderMessage.style.visibility = 'visible';
        reminderMessage.textContent = 'Calculator only works to 8 eight decimals. Please input something else';
        return;
    }
    hideReminderMessage();
    calcDisplay.dataset.num2 = calcDisplay.textContent = String(percentNum);
}

function isTinyNum(num) {
    return num < 0.00000001 ? true : false;
}

function switchSign() {
    hideReminderMessage()
    const calcDisplay = document.getElementById('number-display');
    const oppSignNum = String(+calcDisplay.dataset.num2 * -1);
    if (calcDisplay.textContent != ' 0') {
        calcDisplay.dataset.num2 = calcDisplay.textContent = oppSignNum;
    }
}

function partialReset() {
    const calcDisplay = document.getElementById('number-display');
    calcDisplay.textContent = '';
    calcDisplay.dataset.num1 = calcDisplay.dataset.num2 = '0';
    calcDisplay.dataset.operator = '+';
    const nums = document.querySelectorAll('.num');
    nums.forEach(num => num.removeEventListener('click', partialReset))
    const dotBtn = document.getElementById('dot');
    dotBtn.removeEventListener('click', partialReset);
    document.removeEventListener('keydown', keyPartialReset);
}

function resetDisplay() {
    const nums = document.querySelectorAll('.num');
    document.getElementById('number-display').textContent = '';
    nums.forEach(num => num.removeEventListener('click', resetDisplay));
    const dotBtn = document.getElementById('dot');
    dotBtn.removeEventListener('click', resetDisplay);
    document.removeEventListener('keydown', keyResetDisplay);
}

function resetCalculator() {
    const calcDisplay = document.getElementById('number-display');
    calcDisplay.textContent = ' 0'
    calcDisplay.dataset.num1 = calcDisplay.dataset.num2 = '0';
    calcDisplay.dataset.operator = '+';
    const nums = document.querySelectorAll('.num');
    nums.forEach(num => num.removeEventListener('click', partialReset));
    const dotBtn = document.getElementById('dot');
    dotBtn.removeEventListener('click', partialReset);
}

function populateDisplay(e) {
    hideReminderMessage();
    const calcDisplay = document.getElementById('number-display');
    // Condition for initial state of calculator
    if (calcDisplay.textContent == ' 0') calcDisplay.textContent = '';
    const newNum = e.target.textContent;
    calcDisplay.textContent += newNum;
    calcDisplay.dataset.num2 += newNum;
}

function add(a, b) {
    return +(a + b).toFixed(8);
}

function subtract(a, b) {
    return +(a - b).toFixed(8);
}

function multiply(a, b) {
    return +(a * b).toFixed(8);
}

function divide(a, b) {
    return +(a / b).toFixed(8);
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