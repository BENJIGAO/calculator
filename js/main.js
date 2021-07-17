addKeyboardSupport();
activateBtns();

function addKeyboardSupport() {
    document.addEventListener('keydown', executeKeyIfValid);
}

function createObjUsingId(id) {
    return {
        target: document.getElementById(`_${id}`)
    }
}

function executeKeyIfValid(e) {
    const keyPressed = e.key;
    const validNumKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const validOperatorsKeys = ['+', '-', 'x', '/', '='];
    switch (true) {
        // First three cases use objects as arguments b/c the functions require object arguments as they were designed around using event objects from event listeners
        case validNumKeys.includes(keyPressed):
            populateDisplay(createObjUsingId(keyPressed));
            return;
        case validOperatorsKeys.includes(keyPressed):
            // Special case for 'x' key b/c 'x' isn't the multiplication symbol ('*' is in js) 
            if (keyPressed == 'x') {
                doOperation(createObjUsingId('*'))
                return
            }
            // '=' case triggers diff function within doOperation()
            else if (keyPressed == '=') {
                doOperation(createObjUsingId('='))
                return;
            }
            else {
                doOperation(createObjUsingId(keyPressed))
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

function populateDisplay(e) {
    hideReminderMessage();
    const numEle = e.target;
    addTransition(numEle);
    if (isDisplayingTinyNumMessage()) return
    const calcDisplay = document.getElementById('number-display');
    if (checkSpecialCase(calcDisplay)) return;
    if (isInitialState(calcDisplay)) calcDisplay.textContent = '';
    let appendedNum = numEle.textContent;
    calcDisplay.textContent += appendedNum;
    calcDisplay.dataset.num2 += appendedNum;
}

function doOperation(e) {
    hideReminderMessage();
    const calcDisplay = document.getElementById('number-display');
    const operatorEle = e.target;
    addTransition(operatorEle);
    let num1 = calcDisplay.dataset.num1;
    let num2 = calcDisplay.dataset.num2;
    let oldOperator = calcDisplay.dataset.operator;
    let newOperator = operatorEle.getAttribute('id').split('').pop();
    if (isConsecutiveOperator(num2, oldOperator)) return;
    let result = operate(+num1, +num2, oldOperator);
    if (isTinyNum(result)) {
        outputTinyNumMessage();
        return;
    }
    if (newOperator == '=') {
        alterDisplayAndData(calcDisplay, result);
    }
    else {
        updateDisplayAndData(calcDisplay, result, newOperator);
    }
}

function addTransition(ele) {
    ele.classList.add('no-transition')
    ele.classList.add('active')
    ele.offsetHeight;
    ele.classList.remove('no-transition');
    ele.classList.remove('active');

}

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



function configureDocumentForOperator() {
    document.removeEventListener('keydown', executeKeyIfValid);
    document.removeEventListener('keydown', keyPartialReset);
    document.addEventListener('keydown', keyResetDisplay);
    document.addEventListener('keydown', executeKeyIfValid);
}

function configureNumBtnsForOperator() {
    const nums = document.querySelectorAll('.num');
    nums.forEach(num => {
        num.removeEventListener('click', populateDisplay);
        num.removeEventListener('click', partialReset);
        num.addEventListener('click', resetDisplay);
        num.addEventListener('click', populateDisplay);
    })
}

function configureDotBtnForOperator() {
    const dotBtn = document.getElementById('dot');
    dotBtn.removeEventListener('click', addDot);
    dotBtn.removeEventListener('click', partialReset);
    dotBtn.addEventListener('click', resetDisplay);
    dotBtn.addEventListener('click', addDot);
}

function updateDisplayAndData(display, result, operator) {
    if (checkSpecialCase(display)) return
    else if (result == 'ERROR') {
        display.textContent = 'ERROR';
        outputClearMessage();
        return;
    } 
    display.textContent = result;
    
    display.dataset.num1 = result;
    display.dataset.operator = operator;
    display.dataset.num2 = '0';

    removePartialResetFromAll();
    configureDocumentForOperator();
    configureNumBtnsForOperator();
    configureDotBtnForOperator();
}

function configureDocumentForEqualsSign() {
    document.removeEventListener('keydown', executeKeyIfValid);
    document.addEventListener('keydown', keyPartialReset);
    document.addEventListener('keydown', executeKeyIfValid);
}

function configureNumBtnsForEqualsSign() {
    const nums = document.querySelectorAll('.num');
    nums.forEach(num => {
        num.removeEventListener('click', populateDisplay);
        num.addEventListener('click', partialReset);
        num.addEventListener('click', populateDisplay);
    });
}

function configureDotBtnForEqualsSign() {
    const dotBtn = document.getElementById('dot');
    dotBtn.removeEventListener('click', addDot);
    dotBtn.addEventListener('click', partialReset);
    dotBtn.addEventListener('click', addDot);

}

function alterDisplayAndData(display, result) {
    if (checkSpecialCase(display)) return
    else if (result == 'ERROR') {
        display.textContent = 'ERROR';
        outputClearMessage();
        return;
    } 
    display.textContent = result;
    display.dataset.num2 = result;
    display.dataset.operator = '+';
    display.dataset.num1 = '0';

    configureDocumentForEqualsSign();
    configureNumBtnsForEqualsSign();
    configureDotBtnForEqualsSign();
}

function checkSpecialCase(display) {
    const text = display.textContent;
    const lastChar = text.length - 1;
    if (text == '-' || text[lastChar] == '-' && text[lastChar - 1] == 'e' || text[lastChar] == 'e' || text.includes('E') || text.includes('e-') && text[lastChar - 1] != '-') {
        display.textContent = 'ERROR';
        outputClearMessage();
        return true;
    }
}

function keyPartialReset(e) {
    const numsAndDot = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    if (numsAndDot.includes(e.key)) {
        partialReset();
    }
}

function keyResetDisplay(e) {
    const numsAndDot = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    if (numsAndDot.includes(e.key)) {
        resetDisplay();
    }
}

function outputClearMessage() {
    const reminderMessage = document.getElementById('reminder-message');
    reminderMessage.style.visibility = 'visible';
    reminderMessage.textContent = 'Press CLEAR to continue'
}

function square() {
    hideReminderMessage();
    configureDocumentForEqualsSign();
    configureNumBtnsForEqualsSign();
    configureDotBtnForEqualsSign();
    addTransition(document.getElementById('squared'));
    const calcDisplay = document.getElementById('number-display');
    if (checkSpecialCase(calcDisplay)) return;
    const squaredNum = +calcDisplay.textContent * +calcDisplay.textContent;
    if (isTinyNum(squaredNum)) {
        outputTinyNumMessage();
        return;
    }
    newStringNum = +squaredNum.toFixed(8);
    if (!isInitialState(calcDisplay)) {
    calcDisplay.textContent = newStringNum;
    calcDisplay.dataset.num2 = '0' + newStringNum;
    }
}

function backspace() {
    addTransition(document.getElementById('backspace'));
    const calcDisplay = document.getElementById('number-display');
    let currentDisplay = calcDisplay.textContent;
    if (!isInitialState(calcDisplay)) {
        let tmpArr = currentDisplay.split('');
        tmpArr.pop();
        let newDisplay = tmpArr.join('');
        calcDisplay.textContent = newDisplay;
        calcDisplay.dataset.num2 = '0' + newDisplay;
    }

}
function addDot() {
    hideReminderMessage();
    addTransition(document.getElementById('dot'));
    const calcDisplay = document.getElementById('number-display');
    if (checkSpecialCase(calcDisplay)) return;
    if (isInitialState(calcDisplay) || calcDisplay.dataset.num2 == '0') {
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
    hideReminderMessage();
    configureDocumentForEqualsSign();
    configureNumBtnsForEqualsSign();
    configureDotBtnForEqualsSign();
    addTransition(document.getElementById('percent'));
    const calcDisplay = document.getElementById('number-display');
    if (checkSpecialCase(calcDisplay)) return;
    const percentNum = (+calcDisplay.dataset.num2 / 100);
    if (isTinyNum(percentNum)) {
        outputTinyNumMessage();
        return;
    }
    if (!isInitialState(calcDisplay)) {
        calcDisplay.dataset.num2 = calcDisplay.textContent = String(+percentNum.toFixed(8));
    }
}

function outputTinyNumMessage() {
    const reminderMessage = document.getElementById('reminder-message');
    reminderMessage.style.visibility = 'visible';
    reminderMessage.textContent = 'Calculator only works to 8 eight decimals. Please input something else.';
}

function isTinyNum(num) {
    return num < 0.00000001 && num > 0 ? true : false;
}

function switchSign() {
    hideReminderMessage();
    configureDocumentForEqualsSign();
    configureNumBtnsForEqualsSign();
    configureDotBtnForEqualsSign();
    addTransition(document.getElementById('switch-sign'));
    const calcDisplay = document.getElementById('number-display');
    if (checkSpecialCase(calcDisplay)) return;
    const oppSignNum = String(+calcDisplay.dataset.num2 * -1);
    if (!isInitialState(calcDisplay)) {
        calcDisplay.dataset.num2 = calcDisplay.textContent = oppSignNum;
    }
}

function isDisplayingTinyNumMessage() {
    const reminderMessage = document.getElementById('reminder-message');
    const refMessage = 'Calculator only works to 8 eight decimals. Please input something else.'
    return reminderMessage.textContent == refMessage && reminderMessage.style.visibility == 'visible' ? true: false;
}

function removePartialResetFromAll() {
    const nums = document.querySelectorAll('.num');
    nums.forEach(num => num.removeEventListener('click', partialReset))
    const dotBtn = document.getElementById('dot');
    dotBtn.removeEventListener('click', partialReset);
    document.removeEventListener('keydown', keyPartialReset);
}

function partialReset() {
    const calcDisplay = document.getElementById('number-display');
    if (checkSpecialCase(calcDisplay)) return;
    calcDisplay.textContent = '';
    calcDisplay.dataset.num1 = calcDisplay.dataset.num2 = '0';
    calcDisplay.dataset.operator = '+';
    removePartialResetFromAll();
}

function removeResetDisplayFromAll() {
    const nums = document.querySelectorAll('.num');
    nums.forEach(num => num.removeEventListener('click', resetDisplay));
    const dotBtn = document.getElementById('dot');
    dotBtn.removeEventListener('click', resetDisplay);
    document.removeEventListener('keydown', keyResetDisplay);
}

function resetDisplay() {
    const calcDisplay = document.getElementById('number-display');
    if (checkSpecialCase(calcDisplay)) return;
    calcDisplay.textContent = '';
    removeResetDisplayFromAll();
}

function resetCalculator() {
    hideReminderMessage();
    addTransition(document.getElementById('clear'));
    const calcDisplay = document.getElementById('number-display');
    calcDisplay.textContent = ' 0'
    calcDisplay.dataset.num1 = calcDisplay.dataset.num2 = '0';
    calcDisplay.dataset.operator = '+';
    removePartialResetFromAll();
    
}

function isInitialState(display) {
    return display.textContent == ' 0' ? true : false
}

function isConsecutiveOperator(num, operator) {
    // num has to be string or else entering a '0' still returns true even though data-num2 = '00' (logs as 0 as int)
    return num == '0' && operator != '/' ? true : false
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