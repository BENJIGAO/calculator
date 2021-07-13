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
            return divide(num1, num2);
    }
}

function doOperation(e) {
    const calcDisplay = document.getElementById('number-display');
    let result = operate(
        +calcDisplay.dataset.num1,
        +calcDisplay.dataset.num2,
        calcDisplay.dataset.operator
    );
    calcDisplay.dataset.num1 = calcDisplay.textContent = result;
    calcDisplay.dataset.operator = e.target.getAttribute('id');
    calcDisplay.dataset.num2 = '0';
    const nums = document.querySelectorAll('.num');
    nums.forEach(num => {
        num.removeEventListener('click', populateDisplay);
        num.addEventListener('click', resetDisplay);
        num.addEventListener('click', populateDisplay);
    })
}

function resetDisplay() {
    const nums = document.querySelectorAll('.num');
    document.getElementById('number-display').textContent = '';
    nums.forEach(num => num.removeEventListener('click', resetDisplay))
}

function activateBtns() {
    const nums = document.querySelectorAll('.num');
    nums.forEach(num => num.addEventListener('click', populateDisplay));
    const operatorBtns = document.querySelectorAll('.operator');
    operatorBtns.forEach(operatorBtn => operatorBtn.addEventListener('click', doOperation))
    
}

function populateDisplay(e) {
    const calcDisplay = document.getElementById('number-display');
    const newNum = e.target.textContent;
    calcDisplay.textContent += newNum;
    calcDisplay.dataset.num2 += newNum;
}

activateBtns();


