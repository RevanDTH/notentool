import { ipcRenderer } from 'electron';

//Elements
let gradesTableView = document.getElementById("gradesTableView") as HTMLDivElement;
let newGradeButton = document.getElementById("insertGradeButton") as HTMLButtonElement;
let examNameInput = document.getElementById("examNameInput") as HTMLTextAreaElement;
let examWeightInput = document.getElementById("examWeightInput") as HTMLInputElement;
let examGradeInput = document.getElementById("examGradeInput") as HTMLInputElement;

//Variables
const showNotification = (title: string, body: string) => {
    ipcRenderer.send('show-notification', title, body);
};

//Functions
function addGrade(name:string,weighting:number,value:number) {
    let gradesTable = document.getElementById("gradesTable") as HTMLTableElement;
    let newRow = gradesTable.insertRow(gradesTable.rows.length);

    newRow.insertCell(0).innerHTML = name;
    newRow.insertCell(1).innerHTML = weighting.toString();
    newRow.insertCell(2).innerHTML = value.toString();
}

function createTopic(){
    
}



//Listeners
newGradeButton.addEventListener("click", () => {
    if (examNameInput.value == "" || examWeightInput.value == "" || examGradeInput.value == "") {
        showNotification("Leere Felder!", "Eines oder mehrere Felder sind ohne gültige Eingabe...");    }else{
        addGrade(examNameInput.value,Number(examWeightInput.value),Number(examGradeInput.value));
        examNameInput.value = "";
        examWeightInput.value = "";
        examGradeInput.value = "";
    }
});

//On DOM loaded
addEventListener("DOMContentLoaded", (event) => { 
    event = event; //needed because otherwise app won't compile

    //loading entry point (view)
    gradesTableView.style.display = "none";


});