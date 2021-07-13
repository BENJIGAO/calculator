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
            add(num1, num2);
            break;
        case '-':
            subtract(num1, num2);
            break;
        case '*':
            multiply(num1, num2);
            break;
        case '/':
            divide(num1, num2);
            break;
    }
}

function activateBtns() {
    const nums = document.querySelectorAll('.num');
    nums.forEach((num) => num.addEventListener('click', populateDisplay));
}

function populateDisplay(e) {
    document.getElementById('number-display').textContent += e.target.textContent;
}

activateBtns();