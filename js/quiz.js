const questions = [

{
    question:"Arbeitest du gerne mit Menschen?",

    answers:[

        "Ja",
        "Nein"

    ]
}

];

function loadQuestion(){

    const question = document.getElementById("question");
    const answers = document.getElementById("answers");

    question.textContent = questions[0].question;

    answers.innerHTML="";

    questions[0].answers.forEach(answer=>{

        const button=document.createElement("button");

        button.textContent=answer;

        answers.appendChild(button);

        answers.appendChild(document.createElement("br"));
        answers.appendChild(document.createElement("br"));

    });

}
