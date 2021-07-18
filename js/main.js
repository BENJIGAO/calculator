activateToggleSwitch()
addKeyboardSupport();
activateBtns();

function activateToggleSwitch() {
    document.querySelector('.slider').addEventListener('click', toggleOpaque);
}

function toggleOpaque() {
    document.getElementById('key-guide-container').classList.toggle('opaque');
}

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
    if (isDisplayingTinyNumMessage()) return;
    const calcDisplay = document.getElementById('number-display');
    if (isSpecialCase(calcDisplay)) return;
    if (isInitialState(calcDisplay)) calcDisplay.textContent = '';
    let appendedNum = numEle.textContent;
    calcDisplay.textContent += appendedNum;
    calcDisplay.dataset.num2 += appendedNum;
}

function isInfinity() {
    const calcDisplay = document.getElementById('number-display');
    let num1 = calcDisplay.dataset.num1;
    let num2 = calcDisplay.dataset.num2;
    // num1 would be Infinity only when the user presses an operator to make the result Infinity or directly presses square as many times necessary
    return num1.includes('Infinity') || num2.includes('Infinity') ? true : false; 
}

function switchSign() {
    hideReminderMessage();
    addTransition(document.getElementById('switch-sign'));
    const calcDisplay = document.getElementById('number-display');
    let num1 = calcDisplay.dataset.num1;
    let num2 = calcDisplay.dataset.num2;
    if (isInfinity()) {
        if (num2 == '0Infinity') num2 = 'Infinity';
    }
    if (!num1.includes('Infinity') && !num2.includes('Infinity')) {
        if (isSpecialCase(calcDisplay)) return;
    }
    const oppSignNum = +num2 == 0 ? String(+num1 * -1) : String(+num2 * -1);
    if (!isInitialState(calcDisplay)) {
        calcDisplay.textContent = oppSignNum;
        if (num2 == 0) {
            calcDisplay.dataset.num1 = oppSignNum;
            return;
        }
        // When num2 != 0, meaning pressing the num or dot btn should partially reset the calculator
        configureDocumentForEqualsSign();
        configureNumBtnsForEqualsSign();
        configureDotBtnForEqualsSign();
        calcDisplay.dataset.num2 = oppSignNum;

    }
}

function convertPercent() {
    hideReminderMessage();
    addTransition(document.getElementById('percent'));
    const calcDisplay = document.getElementById('number-display');
    let num1 = calcDisplay.dataset.num1;
    let num2 = calcDisplay.dataset.num2;
    let desiredNum = num2 == 0 ? num1 : num2;
    if (isInfinity()) {
        calcDisplay.textContent = 'ERROR';
        outputClearMessage();
        return;
    }
    if (isSpecialCase(calcDisplay)) return;
    const percentNum = (+desiredNum / 100);
    if (isTinyNum(percentNum)) {
        outputTinyNumMessage();
        return;
    }
    if (!isInitialState(calcDisplay)) {
        if (calcDisplay.dataset.num2 == 0) {
            calcDisplay.dataset.num1 = calcDisplay.textContent = String(+percentNum.toFixed(8));
            return;
        }
        calcDisplay.dataset.num2 = calcDisplay.textContent = String(+percentNum.toFixed(8));
        configureDocumentForEqualsSign();
        configureNumBtnsForEqualsSign();
        configureDotBtnForEqualsSign();
    }
}

function square() {
    hideReminderMessage();
    addTransition(document.getElementById('squared'));
    const calcDisplay = document.getElementById('number-display');
    if (isInfinity()) {
        calcDisplay.textContent = 'ERROR';
        outputClearMessage();
        return;
    }
    if (isSpecialCase(calcDisplay)) return;
    let num1 = calcDisplay.dataset.num1;
    let num2 = calcDisplay.dataset.num2;
    const squaredNum = num2 == 0 ? num1 * num1 : num2 * num2;
    if (isTinyNum(squaredNum)) {
        outputTinyNumMessage();
        return;
    }
    newStringNum = +squaredNum.toFixed(8);
    if (!isInitialState(calcDisplay)) {
        calcDisplay.textContent = newStringNum;
        if (num2 == 0) {
            calcDisplay.dataset.num1 = newStringNum;
            return;
        }
        configureDocumentForEqualsSign();
        configureNumBtnsForEqualsSign();
        configureDotBtnForEqualsSign();
        calcDisplay.dataset.num2 = '0' + newStringNum;
    }
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
    if (isInfinity()) {
        calcDisplay.textContent = 'ERROR';
        outputClearMessage();
        return;
    }
    let result = operate(+num1, +num2, oldOperator);
    if (isTinyNum(result)) {
        configureDocumentForEqualsSign();
        configureNumBtnsForEqualsSign();
        configureDotBtnForEqualsSign();
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





function updateDisplayAndData(display, result, operator) {
    if (isSpecialCase(display)) return
    else if (result == 'ERROR') {
        display.textContent = 'ERROR';
        outputClearMessage();
        return;
    } 
    roundedResult = +result.toFixed(8);
    display.textContent = roundedResult;
    
    display.dataset.num1 = roundedResult;
    display.dataset.operator = operator;
    display.dataset.num2 = '0';

    removePartialResetFromAll();
    configureDocumentForOperator();
    configureNumBtnsForOperator();
    configureDotBtnForOperator();
}

function alterDisplayAndData(display, result) {
    if (isSpecialCase(display)) return
    else if (result == 'ERROR') {
        display.textContent = 'ERROR';
        outputClearMessage();
        return;
    } 
    roundedResult = +result.toFixed(8);
    display.textContent = roundedResult;
    display.dataset.num2 = roundedResult;
    display.dataset.operator = '+';
    display.dataset.num1 = '0';

    configureDocumentForEqualsSign();
    configureNumBtnsForEqualsSign();
    configureDotBtnForEqualsSign();
}

function isSpecialCase(display) {
    const text = display.textContent;
    const lastChar = text.length - 1;
    if (text == '-' || text[lastChar] == '-' && text[lastChar - 1] == 'e' || text[lastChar] == 'e' || text.includes('E') || text.includes('e-') && text[lastChar - 1] != '-' || text.includes('I')) {
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

function backspace() {
    hideReminderMessage();
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
    if (isSpecialCase(calcDisplay)) return;
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



function outputTinyNumMessage() {
    const reminderMessage = document.getElementById('reminder-message');
    reminderMessage.style.visibility = 'visible';
    reminderMessage.textContent = 'Calculator only works to 8 eight decimals. Please input something else.';
}

function isTinyNum(num) {
    return num < 0.00000001 && num > 0 ? true : false;
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
    if (isSpecialCase(calcDisplay)) return;
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
    if (isSpecialCase(calcDisplay)) return;
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
    return num == '0' ? true : false
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
