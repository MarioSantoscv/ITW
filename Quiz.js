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
        {
            question: "Qual esporte foi adicionado aos Jogos Olímpicos de Tóquio 2020?",
            options: ["Surfe", "Futebol", "Basquete 3x3", "Ambos"],
            answer: "Ambos",
        },
        {
            question: "Qual país sediou as primeiras Olimpíadas da era moderna?",
            options: ["Grécia", "França", "Inglaterra", "EUA"],
            answer: "Grécia",
        },
        {
            question: "Qual cidade sediou as Olimpíadas de 2016?",
            options: ["Rio de Janeiro", "Londres", "Pequim", "Tóquio"],
            answer: "Rio de Janeiro",
        },
        {
            question: "Qual é o objetivo principal das Olimpíadas?",
            options: [
                "Competir e vencer",
                "Promover a paz e a amizade entre as nações",
                "Ganhar medalhas para o país",
                "Demonstrar força nacional",
            ],
            answer: "Promover a paz e a amizade entre as nações",
        },
        {
            question: "Quantos anéis estão presentes no símbolo das Olimpíadas?",
            options: ["4", "5", "6", "7"],
            answer: "5",
        },
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    const correctAnswers = [];
    const incorrectAnswers = [];

    const questionEl = document.getElementById("question");
    const optionsEl = document.getElementById("options");
    const nextBtn = document.getElementById("next-btn");
    const resultContainer = document.getElementById("result-container");
    const scoreEl = document.getElementById("score");
    const reviewContainer = document.getElementById("review-container"); // Contêiner para revisão

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
        // Desmarcar outras opções
        Array.from(optionsEl.children).forEach((child) =>
            child.classList.remove("selected")
        );

        // Marcar a resposta selecionada
        optionEl.classList.add("selected");

        // Mostrar botão "Próxima"
        nextBtn.classList.remove("d-none");

        nextBtn.onclick = () => {
            checkAnswer(optionEl, correctAnswer);
        };
    }

    function checkAnswer(optionEl, correctAnswer) {
        const currentQuestion = quizData[currentQuestionIndex];

        if (optionEl.textContent === correctAnswer) {
            score++;
            correctAnswers.push(currentQuestion); // Armazena a pergunta correta
        } else {
            incorrectAnswers.push(currentQuestion); // Armazena a pergunta errada
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }

    function showResult() {
        const quizContainer = document.getElementById("quiz-container");
        quizContainer.classList.add("d-none");

        resultContainer.classList.remove("d-none");
        scoreEl.textContent = `Você acertou ${score} de ${quizData.length} perguntas! 🎉`;

        // Exibe revisão das respostas
        displayReview();
    }

    function displayReview() {
        const correctList = document.createElement("ul");
        const incorrectList = document.createElement("ul");

        // Adiciona questões corretas
        correctList.innerHTML = "<h4>Questões que você acertou:</h4>";
        correctAnswers.forEach((question) => {
            const li = document.createElement("li");
            li.textContent = `✔️ ${question.question}`;
            correctList.appendChild(li);
        });

        // Adiciona questões incorretas com respostas corretas
        incorrectList.innerHTML = "<h4>Questões que você errou (respostas corretas):</h4>";
        incorrectAnswers.forEach((question) => {
            const li = document.createElement("li");
            li.textContent = `❌ ${question.question} (Resposta correta: ${question.answer})`;
            incorrectList.appendChild(li);
        });

        // Adiciona as listas ao contêiner de revisão
        reviewContainer.appendChild(correctList);
        reviewContainer.appendChild(incorrectList);
    }

    // Inicializar o quiz
    loadQuestion();
});
