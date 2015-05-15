 <script>
        var quarters = Math.round(Math.random() * 7),
            dimes = Math.round(Math.random() * 4),
            pennies = Math.round(Math.random() * 9),
            guessesMade = 0,
            successMessage = "Good Job!",
            failGuessesMessage = "Try Again.",
            failMessage = "You lose!",
            coinAmountElem = document.getElementById('coinAmount'),
            coinValueElem = document.getElementById('coinValue'),
            quartersGuessesElem = document.getElementById('quarterGuess'),
            dimesGuessesElem = document.getElementById('dimeGuess'),
            penniesGuessesElem = document.getElementById('pennyGuess'),
            resultsElem = document.getElementById('results');


        function start() {
            guessesMade = 0;
            quarters = Math.round(Math.random() * 7);
            dimes = Math.round(Math.random() * 4);
            pennies = Math.round(Math.random() * 9);

            coinAmountElem.textContent = quarters + dimes + pennies;
            coinValueElem.textContent = quarters * 25 + dimes * 10 + pennies;

            quartersGuessesElem.value = 0;
            dimesGuessesElem.value = 0;
            penniesGuessesElem.value = 0;

        }

        function outputResults(win, done) {
            if (done) {
                resultsElem.textContent =
                    `quarters: ${quarters},
dimes: ${dimes},
pennies: ${pennies},
${win ? successMessage : failMessage}`;
            } else {
                resultsElem.textContent =
                    `quarters: ${quarters},
dimes: ${dimes},
pennies: ${pennies},
${failGuessesMessage}`
            }

        }

        function makeGuess() {
            ++guessesMade;
            if (guessesMade > 5)
                return;
            if (quartersGuessesElem.value == quarters && dimesGuessesElem.value == dimes && penniesGuessesElem.value == pennies) {
                outputResults(true, true);
            } else if (guessesMade === 5) {
                outputResults(false, true);
            } else {
                outputResults(false, false);
            }
        }
    </script>