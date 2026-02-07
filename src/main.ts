import { ipcRenderer } from 'electron';
import Store from 'electron-store';


//Elements
const GRADES_TABLE_VIEW = document.getElementById("gradesTableView") as HTMLDivElement;
const NEW_GRADE_BUTTON = document.getElementById("insertGradeButton") as HTMLButtonElement;
const EXAM_NAME_INPUT = document.getElementById("examNameInput") as HTMLTextAreaElement;
const EXAM_WEIGHT_INPUT = document.getElementById("examWeightInput") as HTMLInputElement;
const EXAM_GRADE_INPUT = document.getElementById("examGradeInput") as HTMLInputElement;
const CREATE_TOPIC_BUTTON = document.getElementById("createNewTopicButton") as HTMLButtonElement;
const NEW_TOPIC_INPUT = document.getElementById("topicNameInput") as HTMLInputElement;
const TOPIC_BUTTONS_DIV = document.getElementById("topicButtons") as HTMLDivElement;
const STORE = new Store<Record<string, string>>();

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
  if (STORE.get(name) !== undefined) {
    return false;
  }else{
    STORE.set(name, "{}");
    let newTopicButtonHtmlElement = document.createElement("button") as HTMLButtonElement;
    newTopicButtonHtmlElement.id = name + BUTTON_PREFIX;
    TOPIC_BUTTONS_DIV.appendChild(newTopicButtonHtmlElement);
    newTopicButtonHtmlElement.innerText = name;
    attachTopicButtonListener(newTopicButtonHtmlElement, name);
    return true;
  }

}

// @ts-ignore
function deleteTopic(name:string){
    if (STORE.get(name) == undefined) {
        return false;
    }else{
        STORE.delete(name);
        let currentTopicButtonName = name + BUTTON_PREFIX;
        let currentTopicButton = document.getElementById(currentTopicButtonName);
        currentTopicButton?.remove();
        return true;
    }

}

// @ts-ignore
function addGradeToTopic(topicName: string,gradeName: string,gradeWeight: number,grade: number) {
    const topicString = STORE.get(topicName);
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

    STORE.set(topicName, JSON.stringify(topicObject));
    return true;
}

// @ts-ignore
function removeGradeFromTopic(topicName: string, gradeName: string) {
    const topicString = STORE.get(topicName);
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

    STORE.set(topicName, JSON.stringify(topicObject));
    return true;
}

function loadAllTopics(){
    let allItems:Record<string, string> = STORE.store;
    //let allItemsObj = JSON.parse(allItems);

    for(const topic in allItems){
        let newTopicButtonHtmlElement = document.createElement("button") as HTMLButtonElement;
        newTopicButtonHtmlElement.id = topic + BUTTON_PREFIX;
        TOPIC_BUTTONS_DIV.appendChild(newTopicButtonHtmlElement);
        newTopicButtonHtmlElement.innerText = topic;
        attachTopicButtonListener(newTopicButtonHtmlElement, topic);
    }
}

function attachTopicButtonListener(button: HTMLButtonElement, topicName: string) {
    button.addEventListener("click", () => {
        console.log("Topic clicked: " + topicName);
        // Hier kannst du die Noten für dieses Topic anzeigen
    });
}


//Listeners
NEW_GRADE_BUTTON.addEventListener("click", () => {
    if (EXAM_NAME_INPUT.value == "" || EXAM_WEIGHT_INPUT.value == "" || EXAM_GRADE_INPUT.value == "") {
        showNotification("Leere Felder!", "Eines oder mehrere Felder sind ohne gültige Eingabe...");    
    }else{
        addGrade(EXAM_NAME_INPUT.value,Number(EXAM_WEIGHT_INPUT.value),Number(EXAM_GRADE_INPUT.value));
        EXAM_NAME_INPUT.value = "";
        EXAM_WEIGHT_INPUT.value = "";
        EXAM_GRADE_INPUT.value = "";
    }
});

CREATE_TOPIC_BUTTON.addEventListener("click", () => {
    if(NEW_TOPIC_INPUT.value == ""){
        showNotification("Leere Felder!", "Eines oder mehrere Felder sind ohne gültige Eingabe...");    
    }else{
        createTopic(NEW_TOPIC_INPUT.value); //need to add error handling (function already returns true/false)
    }
})

function init() {
  GRADES_TABLE_VIEW.style.display = "none";
  loadAllTopics();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init(); //DOM already loaded
}