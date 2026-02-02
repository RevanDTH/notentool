import { ipcRenderer } from 'electron';
import Store from 'electron-store';


//Elements
const gradesTableView = document.getElementById("gradesTableView") as HTMLDivElement;
const newGradeButton = document.getElementById("insertGradeButton") as HTMLButtonElement;
const examNameInput = document.getElementById("examNameInput") as HTMLTextAreaElement;
const examWeightInput = document.getElementById("examWeightInput") as HTMLInputElement;
const examGradeInput = document.getElementById("examGradeInput") as HTMLInputElement;
const createTopicButton = document.getElementById("createNewTopicButton") as HTMLButtonElement;
const newTopicInput = document.getElementById("topicNameInput") as HTMLInputElement;
const topicButtonsDiv = document.getElementById("topicButtons") as HTMLDivElement;
const store = new Store<Record<string, string>>();

//Variables
const showNotification = (title: string, body: string) => {
    ipcRenderer.send('show-notification', title, body);
};

const BUTTON_PREFIX = "_button";

//Functions
function addGrade(name:string,weighting:number,value:number) {
    let gradesTable = document.getElementById("gradesTable") as HTMLTableElement;
    let newRow = gradesTable.insertRow(gradesTable.rows.length);

    newRow.insertCell(0).innerHTML = name;
    newRow.insertCell(1).innerHTML = weighting.toString();
    newRow.insertCell(2).innerHTML = value.toString();
}


function createTopic(name: string) {
  if (store.get(name) !== undefined) {
    return false;
  }else{
    store.set(name, "{}");
    let newTopicButtonHtmlElement = document.createElement("button") as HTMLButtonElement;
    newTopicButtonHtmlElement.id = name + BUTTON_PREFIX;
    topicButtonsDiv.appendChild(newTopicButtonHtmlElement);
    newTopicButtonHtmlElement.innerText = name;
    return true;
  }

}


function deleteTopic(name:string){
    if (store.get(name) == undefined) {
        return false;
    }else{
        store.delete(name);
        let currentTopicButtonName = name + BUTTON_PREFIX;
        let currentTopicButton = document.getElementById(currentTopicButtonName);
        currentTopicButton?.remove();
        return true;
    }

}

function addGradeToTopic(topicName: string,gradeName: string,gradeWeight: number,grade: number) {
    const topicString = store.get(topicName);
    if (topicString === undefined) return false;

    type Grade = {
        gradeWeight: number;
        grade: number;
    };

    type Topic = {
        [gradeName: string]: Grade;
    };

    const topicObject: Topic = JSON.parse(topicString);

    topicObject[gradeName] = {
        gradeWeight,
        grade
    };

    store.set(topicName, JSON.stringify(topicObject));
    return true;
}

function removeGradeFromTopic(topicName: string, gradeName: string) {
    const topicString = store.get(topicName);
    if (topicString === undefined) return false;

    type Grade = {
        gradeWeight: number;
        grade: number;
    };

    type Topic = {
        [gradeName: string]: Grade;
    };
    const topicObject: Topic = JSON.parse(topicString);

    if (!(gradeName in topicObject)) return false;

    delete topicObject[gradeName];

    store.set(topicName, JSON.stringify(topicObject));
    return true;
}

function loadAllTopics(){
    // Need to fix that tomorrow

    //let allItems = store.store;
    //JSON.parse(allItems).forEach(element => {
      //  
    //});
    
    //let newTopicButtonHtmlElement = document.createElement("button") as HTMLButtonElement;
    //newTopicButtonHtmlElement.id = name + BUTTON_PREFIX;
    //topicButtonsDiv.appendChild(newTopicButtonHtmlElement);
    //newTopicButtonHtmlElement.innerText = name;

}


//Listeners
newGradeButton.addEventListener("click", () => {
    if (examNameInput.value == "" || examWeightInput.value == "" || examGradeInput.value == "") {
        showNotification("Leere Felder!", "Eines oder mehrere Felder sind ohne gültige Eingabe...");    
    }else{
        addGrade(examNameInput.value,Number(examWeightInput.value),Number(examGradeInput.value));
        examNameInput.value = "";
        examWeightInput.value = "";
        examGradeInput.value = "";
    }
});

createTopicButton.addEventListener("click", () => {
    if(newTopicInput.value == ""){
        showNotification("Leere Felder!", "Eines oder mehrere Felder sind ohne gültige Eingabe...");    
    }else{
        createTopic(newTopicInput.value); //need to add error handling (function already returns true/false)
    }
})

//On DOM loaded
addEventListener("DOMContentLoaded", () => { 
    //loading entry point (view)
    gradesTableView.style.display = "none";


});