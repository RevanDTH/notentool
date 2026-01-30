//Elements
let newGradeButton = document.getElementById("insertGradeButton") as HTMLButtonElement;


//Functions
function addGrade(name:string,weighting:number,value:number) {
    let gradesTable = document.getElementById("gradesTable") as HTMLTableElement;
    let newRow = gradesTable.insertRow(gradesTable.rows.length);

    newRow.insertCell(0).innerHTML = name;
    newRow.insertCell(1).innerHTML = weighting.toString();
    newRow.insertCell(2).innerHTML = value.toString();
}



//Listeners
newGradeButton.addEventListener("click", () => addGrade("test",1.0,2.2));