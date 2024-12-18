class Leaderboard {
    constructor() {
        this.leaderboardData = [];
        this.maxEntries = 10;
        this.loadLeaderboard();
    }

    loadLeaderboard() {
        const savedData = localStorage.getItem('foodGameLeaderboard');
        this.leaderboardData = savedData ? JSON.parse(savedData) : [];
        this.updateLeaderboardDisplay();
    }

    saveLeaderboard() {
        localStorage.setItem('foodGameLeaderboard', JSON.stringify(this.leaderboardData));
        this.updateLeaderboardDisplay();
    }

    addScore(name, score) {
        const newEntry = {
            name,
            score,
            date: new Date().toLocaleDateString()
        };

        this.leaderboardData.push(newEntry);
        this.leaderboardData.sort((a, b) => b.score - a.score);
        
        if (this.leaderboardData.length > this.maxEntries) {
            this.leaderboardData = this.leaderboardData.slice(0, this.maxEntries);
        }

        this.saveLeaderboard();
    }

    updateLeaderboardDisplay() {
        const tbody = document.getElementById('leaderboard-body');
        tbody.innerHTML = '';

        this.leaderboardData.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.name}</td>
                <td>${entry.score}</td>
                <td>${entry.date}</td>
            `;
            tbody.appendChild(row);
        });
    }

    showScoreForm(score) {
        const playerForm = document.getElementById('player-form');
        const playerNameInput = document.getElementById('player-name');
        const saveScoreButton = document.getElementById('save-score');

        playerForm.classList.remove('hidden');
        
        saveScoreButton.onclick = () => {
            const playerName = playerNameInput.value.trim();
            if (playerName) {
                this.addScore(playerName, score);
                playerForm.classList.add('hidden');
                playerNameInput.value = '';
            }
        };
    }
}

const leaderboard = new Leaderboard();