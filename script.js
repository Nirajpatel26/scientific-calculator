class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.parenCount = 0;
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.parenCount = 0;
        this.shouldResetDisplay = false;
    }

    delete() {
        if (this.currentOperand === '0' || this.shouldResetDisplay) return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentOperand = number === '.' ? '0.' : number;
            this.shouldResetDisplay = false;
            return;
        }

        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.shouldResetDisplay = true;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = null;
        this.previousOperand = '';
        this.shouldResetDisplay = true;
    }

    // Scientific functions
    sin() {
        const num = parseFloat(this.currentOperand);
        this.currentOperand = Math.sin(num * Math.PI / 180).toString();
        this.shouldResetDisplay = true;
    }

    cos() {
        const num = parseFloat(this.currentOperand);
        this.currentOperand = Math.cos(num * Math.PI / 180).toString();
        this.shouldResetDisplay = true;
    }

    tan() {
        const num = parseFloat(this.currentOperand);
        this.currentOperand = Math.tan(num * Math.PI / 180).toString();
        this.shouldResetDisplay = true;
    }

    log() {
        const num = parseFloat(this.currentOperand);
        this.currentOperand = Math.log10(num).toString();
        this.shouldResetDisplay = true;
    }

    ln() {
        const num = parseFloat(this.currentOperand);
        this.currentOperand = Math.log(num).toString();
        this.shouldResetDisplay = true;
    }

    sqrt() {
        const num = parseFloat(this.currentOperand);
        this.currentOperand = Math.sqrt(num).toString();
        this.shouldResetDisplay = true;
    }

    pow() {
        const num = parseFloat(this.currentOperand);
        this.currentOperand = Math.pow(num, 2).toString();
        this.shouldResetDisplay = true;
    }

    exp() {
        const num = parseFloat(this.currentOperand);
        this.currentOperand = Math.exp(num).toString();
        this.shouldResetDisplay = true;
    }

    pi() {
        this.currentOperand = Math.PI.toString();
        this.shouldResetDisplay = true;
    }

    e() {
        this.currentOperand = Math.E.toString();
        this.shouldResetDisplay = true;
    }

    factorial() {
        const num = parseInt(this.currentOperand);
        if (num < 0) {
            this.currentOperand = 'Error';
            return;
        }
        let result = 1;
        for (let i = 2; i <= num; i++) {
            result *= i;
        }
        this.currentOperand = result.toString();
        this.shouldResetDisplay = true;
    }

    inverse() {
        const num = parseFloat(this.currentOperand);
        this.currentOperand = (1 / num).toString();
        this.shouldResetDisplay = true;
    }

    abs() {
        const num = parseFloat(this.currentOperand);
        this.currentOperand = Math.abs(num).toString();
        this.shouldResetDisplay = true;
    }

    negate() {
        const num = parseFloat(this.currentOperand);
        this.currentOperand = (-num).toString();
    }

    paren() {
        // Simple parentheses toggle for display
        if (this.parenCount === 0) {
            this.currentOperand += '(';
            this.parenCount = 1;
        } else {
            this.currentOperand += ')';
            this.parenCount = 0;
        }
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        if (stringNumber.includes('Infinity') || stringNumber.includes('NaN')) {
            return 'Error';
        }
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        const currentDisplay = document.getElementById('current-display');
        const previousDisplay = document.getElementById('previous-display');
        
        currentDisplay.textContent = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            previousDisplay.textContent = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            previousDisplay.textContent = '';
        }
    }
}

// Initialize calculator
const calculator = new Calculator();

// Number buttons
document.querySelectorAll('.btn.number').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.getAttribute('data-number'));
        calculator.updateDisplay();
    });
});

// Operator buttons
document.querySelectorAll('.btn.operator').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.getAttribute('data-operator'));
        calculator.updateDisplay();
    });
});

// Function buttons
document.querySelectorAll('.btn.function').forEach(button => {
    button.addEventListener('click', () => {
        const func = button.getAttribute('data-function');
        if (calculator[func]) {
            calculator[func]();
            calculator.updateDisplay();
        }
    });
});

// Special action buttons
document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        if (action === 'clear') {
            calculator.clear();
        } else if (action === 'delete') {
            calculator.delete();
        } else if (action === 'equals') {
            calculator.compute();
        }
        calculator.updateDisplay();
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        calculator.appendNumber(e.key);
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        calculator.chooseOperation(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
    } else if (e.key === 'Escape') {
        calculator.clear();
    } else if (e.key === 'Backspace') {
        calculator.delete();
    }
    calculator.updateDisplay();
});

// Initial display update
calculator.updateDisplay();
