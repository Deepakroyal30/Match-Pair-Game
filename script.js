document.addEventListener('DOMContentLoaded', () => {
    const emojis = ["🍦", "🍩", "🍎", "🍌", "🍇", "🍉", "🍪", "🍫"];
    let shuffledEmojis;
    const gameBoard = document.getElementById('game-board');
    const attemptsDisplay = document.getElementById('attempts');
    const restartButton = document.getElementById('restart-btn');
    const confettiContainer = document.getElementById('confetti-container');
    let firstCard, secondCard;
    let lockBoard = false;
    let attempts = 0;

    shuffledEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

    function createCards() {
        gameBoard.innerHTML = '';
        shuffledEmojis.forEach(emoji => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = emoji;

            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            cardBack.textContent = emoji;

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);

            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard || this === firstCard) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
        } else {
            secondCard = this;
            lockBoard = true;
            checkForMatch();
        }

        attempts++;
        attemptsDisplay.textContent = attempts;
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;

        if (isMatch) {
            disableCards();
            if (document.querySelectorAll('.card:not(.flipped)').length === 0) {
                celebrate();
            }
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function celebrate() {
        confetti();
        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 5000);
    }

    function confetti() {
        for (let i = 0; i < 200; i++) { // Increase the number of confetti pieces
            const confettiPiece = document.createElement('div');
            confettiPiece.classList.add('confetti');
            confettiPiece.style.left = `${Math.random() * 100}%`;
            confettiPiece.style.animationDuration = `${Math.random() * 2 + 1}s`; // Make the confetti fall faster
            confettiPiece.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confettiContainer.appendChild(confettiPiece);
        }
    }

    function restartGame() {
        attempts = 0;
        attemptsDisplay.textContent = attempts;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        shuffledEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
        createCards();
        confettiContainer.innerHTML = '';
    }

    createCards();
    restartButton.addEventListener('click', restartGame);
});
