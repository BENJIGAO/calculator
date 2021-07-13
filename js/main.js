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

function main() {
    let a = 5;
    const plusBtn = document.getElementById('plus-btn');
    plusBtn.addEventListener('click', doOperation);

    
    activateBtns();
    

}


function activateBtns() {
    
    const nums = document.querySelectorAll('.num');
    nums.forEach((num) => num.addEventListener('click', populateDisplay));
    const subtractBtn = document.getElementById('subtract-btn');
    subtractBtn.addEventListener('click', doOtherOperation)
    
}

function doOtherOperation() {
    console.log(a);
}

function doOperation() {
    console.log(a);
    return;
}

function populateDisplay(e) {
    document.getElementById('number-display').textContent += e.target.textContent;
    console.log(a);
}

main();


