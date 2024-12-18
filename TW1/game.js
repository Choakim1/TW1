class FoodGuessingGame {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 10;
        this.timer = null;
        this.questions = [];
        this.apiKey = '9b9eee893874452984bcae4039806923'; // Nahraďte svým API klíčem

        // DOM elements
        this.imageElement = document.getElementById('food-image');
        this.answersContainer = document.getElementById('answers');
        this.timerElement = document.getElementById('timer');
        this.scoreElement = document.getElementById('score-value');
        this.restartButton = document.getElementById('restart-button');
        this.progressBar = document.querySelector('.progress');

        // Event listeners
        this.restartButton.addEventListener('click', () => this.restartGame());
    }

    async initGame() {
        try {
            // Fetch 10 random food images from API
            const response = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${this.apiKey}&number=10`);
            const data = await response.json();
            
            this.questions = data.recipes.map(recipe => ({
                image: recipe.image,
                correctAnswer: recipe.title,
                options: this.generateOptions(recipe.title)
            }));

            this.startGame();
        } catch (error) {
            console.error('Error fetching data:', error);
            this.handleError('Nepodařilo se načíst data ze serveru.');
        }
    }

    generateOptions(correctAnswer) {
        // Seznam možných názvů jídel pro náhodné odpovědi
        const possibleFoods = [
            "Spaghetti Carbonara", "Pizza Margherita", "Hamburger",
            "Caesar Salad", "Sushi Roll", "Chicken Curry",
            "Fish and Chips", "Beef Steak", "Vegetable Soup",
            "Apple Pie", "Ice Cream", "Chocolate Cake"
        ];

        // Vyfiltrujeme správnou odpověď z možných odpovědí
        const wrongAnswers = possibleFoods
            .filter(food => food !== correctAnswer)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        // Spojíme správnou odpověď s náhodnými a zamícháme
        return [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    }

    startGame() {
        this.currentQuestion = 0;
        this.score = 0;
        this.showQuestion();
        this.updateScore();
        this.restartButton.style.display = 'none';
    }

    showQuestion() {
        if (this.currentQuestion >= 10) {
            this.endGame();
            return;
        }

        const question = this.questions[this.currentQuestion];
        this.imageElement.src = question.image;
        this.answersContainer.innerHTML = '';

        question.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'answer-button';
            button.textContent = option;
            button.addEventListener('click', () => this.checkAnswer(option));
            this.answersContainer.appendChild(button);
        });

        this.progressBar.style.width = `${(this.currentQuestion * 10)}%`;
        this.startTimer();
    }

    startTimer() {
        this.timeLeft = 10;
        this.updateTimer();
        
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    updateTimer() {
        this.timerElement.textContent = this.timeLeft;
        if (this.timeLeft <= 3) {
            this.timerElement.style.color = '#ff0000';
        } else {
            this.timerElement.style.color = '#ff4444';
        }
    }

    checkAnswer(selectedAnswer) {
        const correctAnswer = this.questions[this.currentQuestion].correctAnswer;
        
        if (selectedAnswer === correctAnswer) {
            this.score++;
            this.updateScore();
            this.currentQuestion++;
            
            if (this.currentQuestion < 10) {
                this.showQuestion();
            } else {
                this.endGame();
            }
        } else {
            this.endGame();
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    endGame() {
        clearInterval(this.timer);
        this.answersContainer.innerHTML = `
            <h2>Konec hry!</h2>
            <p>Vaše skóre: ${this.score}/10</p>
        `;
        this.restartButton.style.display = 'block';
        this.progressBar.style.width = '100%';

        // Přidáme možnost uložit skóre do leaderboardu
        if (this.score > 0) {
            leaderboard.showScoreForm(this.score);
        }
    }

    restartGame() {
        this.initGame();
    }

    handleError(message) {
        this.answersContainer.innerHTML = `
            <div class="game-over">
                <p>${message}</p>
                <p>Prosím, zkuste to znovu později.</p>
            </div>
        `;
        this.restartButton.style.display = 'block';
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new FoodGuessingGame();
    game.initGame();
});