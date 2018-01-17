let urlAll = "http://localhost:3000/all/";
let urlNew = "http://localhost:3000/new/";
let urlRemove = "http://localhost:3000/remove/";
let urlUpdate = "http://localhost:3000/update/";
let txtCount = "Number of matches still left to play : ";


// Create global variables
var encounters = []; //all matches, from JSON
var table = null;
var col = []; //col of the table
var countNotOver = 0; //count of unfinished matches

//To display the html table right after the page is opened
document.addEventListener("load", loadJSONTable(urlAll),true);
//Possible to add an element while pressing the "enter" key
document.addEventListener("keyup",function (e){
        var key = e.keyCode ? e.keyCode : e.which;
        if(key == 13){
            newMatch();
        }
});

function loadJSONTable(url){
    console.log("JSON LOAD");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            encounters  = Object.values(myArr)[0]; 
            console.log("ENCOUNTERS");
            console.log(encounters);
            if(table ===null){
                console.log("NULL");
            }else{
                console.log("NOT NULL / ADD ROW");
                //addOneRowToTable();
                table = null;
                col=[];
                countNotOver = 0;
            }
            table = document.createElement("table");
            createTableFromJSON();
            document.getElementById("notOver").innerHTML = txtCount+countNotOver;
        }    
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(); 
};

function loadJSONend(url,index,box){
    console.log("JSON LOAD UPDATE");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("UPDATE ROW "); 
            table = null;
            col=[];
            countNotOver = 0;
            loadJSONTable(urlAll);
        }
    };    
    var url2 =  url+index+"&"+box.checked.toString();
    xmlhttp.open("GET",url2, true);
    xmlhttp.send();
}

function loadJSONremove(url,index,button){
    console.log("JSON LOAD REMOVE");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            console.log(myArr);
            //encounters  = Object.values(myArr)[0]; 
            var idrow = button.parentNode.parentNode.rowIndex;
            console.log("DELETE ROW "+idrow);
            if(encounters[idrow-1][col[4]]===false){
                countNotOver= countNotOver - 1;
            } 
            document.getElementById("notOver").innerHTML = txtCount+countNotOver;
            table.deleteRow(idrow); 
            
        }
    };
    xmlhttp.open("GET", url+index, true);
    xmlhttp.send();
}

function loadJSONnewMatch(url){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            console.log(myArr);
            loadJSONTable(urlAll);   
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(); 
}

//create an html table
function createTableFromJSON() {
    console.log("CREATE TABLE");
    // EXTRACT VALUE FOR HTML HEADER. 
    //For the end game checkbox
    col.push("");
    for (var i = 0; i < encounters.length; i++) {
        for (var key in encounters[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    //For the remove buttons
    col.push("");
    
    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
    /*
    var tr = table.insertRow(-1);                   // TABLE ROW.
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    */
    addRowsToTable();
    showTable();
    console.log("TABLE CREATED");
};

// ADD JSON DATA TO THE TABLE AS ROWS.
function addRowsToTable(){
    console.log("ROWS");
    var index = 0; 
    for (var i = 0; i < encounters.length; i++) {
        tr = table.insertRow(-1);
        //checkbox
        var tabCell = tr.insertCell(-1);
        var box = addCheckboxEnd(encounters[i][col[1]]);
        tabCell.appendChild(box);

        for (var j = 1; j < col.length-1; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = encounters[i][col[j]]; 
            
            if(j===1){
                index = tabCell.textContent;
            }else if(j===4 && tabCell.textContent==="true"){
                box.checked=true;
            }else if(j===4 && tabCell.textContent==="false"){
                countNotOver+=1;
            }
        }
        if(box.checked){
            tr.style.color = "rgb(226, 238, 238)";
        }
        //Button remove
        var tabCell = tr.insertCell(-1);
        var btn = addButton(index);
        tabCell.appendChild(btn); 
    }
};

//add the table to the html code
function showTable(){
    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
};

/*Get the value from the input fields on the html code with the players name, 
call for the function add an element to the table*/
function newMatch(){
    //get values in input areas
    var x = document.getElementById("frm1");
    var text = "";
    var i;
    for (i = 0; i < x.length ;i++) {
        text += x.elements[i].value;
    }
    var text1 = x.elements[0].value;
    var text2 = x.elements[1].value;
    loadJSONnewMatch(urlNew+text1+"&"+text2);
    document.getElementById("matches").innerHTML = "Done";
    x.reset();
    
};

//Add one row to the table when an element is added into the database
function addOneRowToTable(){
    console.log("NEW ROW");
    tr = table.insertRow(-1);
    //checkbox
    var tabCell = tr.insertCell(-1);
    var box = addCheckboxEnd(encounters[encounters.length-1][col[1]]);
    tabCell.appendChild(box); 

    for (var j = 1; j < col.length-1; j++) {
        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = encounters[encounters.length-1][col[j]];
        if(j===1){
            var index = tabCell.textContent;
        }
    }
    countNotOver+=1;
    //Button to remove row
    var tabCell = tr.insertCell(-1);
    var btn = addButton(index);
    tabCell.appendChild(btn);
}

//Create a button with the right properties to remove an element from the database while clicked
function addButton(index){
    var button = document.createElement("button");
    button.setAttribute('type', 'button');
    button.setAttribute('value', "Remove");
    var textnode = document.createTextNode("Remove");         // Create a text node
    button.appendChild(textnode);
    var id ="b"+index;
    button.setAttribute("id",id);
    //button.onclick = function () {loadJSONremove(urlRemove,this.index);};   ,'+this+'
   // button.setAttribute('onclick', 'loadJSONremove(urlRemove,'+index+','+idrow+');');
    button.addEventListener("click",function (){
       // document.getElementById(id).
        loadJSONremove(urlRemove,index,button);
    });
    return button;
}

//Create a checkbox with the right properties to update an element from the database while checked (match finished or not)
function addCheckboxEnd(index){
    var checkbox = document.createElement("input");
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('value', "End");
    var id ="c"+index;
    checkbox.setAttribute("id",id);
    checkbox.addEventListener("change",function (){
        loadJSONend(urlUpdate,index,checkbox);

    });
    return checkbox;
    
}
