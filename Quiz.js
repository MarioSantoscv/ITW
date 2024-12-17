document.addEventListener("DOMContentLoaded", () => {
    const quizData = [
        {
            question: "Em que ano ocorrerão os Jogos Olímpicos de Paris?",
            options: ["2022", "2023", "2024", "2025"],
            answer: "2024",
        },
        {
            question: "Qual é o símbolo das Olimpíadas?",
            options: ["Uma tocha", "Cinco anéis", "Uma bandeira", "Um pódio"],
            answer: "Cinco anéis",
        },
        {
            question: "Qual cidade sediou os Jogos Olímpicos anteriores a Paris?",
            options: ["Tóquio", "Rio de Janeiro", "Londres", "Pequim"],
            answer: "Tóquio",
        },
        {
            question: "Quantos esportes participam nas Olimpíadas de Paris 2024?",
            options: ["28", "33", "41", "50"],
            answer: "33",
        },
        {
            question: "Qual atleta ganhou mais medalhas olímpicas na história?",
            options: ["Usain Bolt", "Michael Phelps", "Larisa Latynina", "Simone Biles"],
            answer: "Michael Phelps",
        },
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    const totalTime = 60; // 1 minuto em segundos
    let timeLeft = totalTime;

    const questionEl = document.getElementById("question");
    const optionsEl = document.getElementById("options");
    const nextBtn = document.getElementById("next-btn");
    const resultContainer = document.getElementById("result-container");
    const scoreEl = document.getElementById("score");
    const reviewContainer = document.getElementById("review-container");

    const timerEl = document.createElement("div");
    timerEl.id = "timer";
    timerEl.className = "text-center h5 my-3";
    document.getElementById("quiz-section").prepend(timerEl);

    function startTimer() {
        timer = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timer);
                showResult();
            } else {
                timeLeft--;
                updateTimerDisplay();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerEl.textContent = `⏰ Tempo Restante: ${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    function loadQuestion() {
        const currentQuestion = quizData[currentQuestionIndex];
        questionEl.textContent = currentQuestion.question;
        optionsEl.innerHTML = "";

        currentQuestion.options.forEach((option) => {
            const optionEl = document.createElement("li");
            optionEl.className = "list-group-item";
            optionEl.textContent = option;

            optionEl.addEventListener("click", () => {
                selectAnswer(optionEl, currentQuestion.answer);
            });

            optionsEl.appendChild(optionEl);
        });

        nextBtn.classList.add("d-none");
    }

    function selectAnswer(optionEl, correctAnswer) {
        Array.from(optionsEl.children).forEach((child) =>
            child.classList.remove("selected")
        );
        optionEl.classList.add("selected");
        nextBtn.classList.remove("d-none");

        nextBtn.onclick = () => {
            checkAnswer(optionEl, correctAnswer);
        };
    }

    function checkAnswer(optionEl, correctAnswer) {
        const question = quizData[currentQuestionIndex];
        const isCorrect = optionEl.textContent === correctAnswer;
        if (isCorrect) score++;

        showAnswerFeedback(question, isCorrect, correctAnswer);
        currentQuestionIndex++;

        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            clearInterval(timer); // Para o temporizador ao final
            showResult();
        }
    }

    function showAnswerFeedback(question, isCorrect, correctAnswer) {
        const feedbackItem = document.createElement("div");
        feedbackItem.className = "list-group-item";
        feedbackItem.innerHTML = `
            <strong>${question.question}</strong><br>
            ${isCorrect ? "<i class='text-success'>✅ Acertou!</i>" : `<i class='text-danger'>❌ Errou! Resposta correta: <em>${correctAnswer}</em>`}
        `;
        reviewContainer.appendChild(feedbackItem);
    }

    function showResult() {
        document.getElementById("quiz-container").classList.add("d-none");
        resultContainer.classList.remove("d-none");
        scoreEl.textContent = `Você acertou ${score} de ${quizData.length} perguntas! 🎉`;
    }

    // Inicializa o quiz e o temporizador
    loadQuestion();
    startTimer();
    updateTimerDisplay();
});
