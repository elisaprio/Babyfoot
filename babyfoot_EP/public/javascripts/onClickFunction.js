let urlAll = "http://localhost:3000/all/";
let urlNew = "http://localhost:3000/new/";
let urlRemove = "http://localhost:3000/remove/";
let urlUpdate = "http://localhost:3000/update/";
var encounters = [];


// CREATE DYNAMIC TABLE.
//var table = document.createElement("table");
var table = null;
var col = [];

//ON LOAD TABLE
document.addEventListener("load", loadJSONTable(urlAll),true);
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
                table = document.createElement("table");
                createTableFromJSON();
            }else{
                console.log("NOT NULL");
                addOneRowToTable();
            }
            
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(); 
};

function loadJSONremove(url,index,button){
    console.log("JSON LOAD REMOVE");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            console.log(myArr);
            encounters  = Object.values(myArr)[0]; 
            //loadJSONTable(urlAll);
            var idrow = button.parentNode.parentNode.rowIndex;
            console.log("DELETE ROW "+idrow); 
            //var empTab = document.getElementById('empTable');
           // table.deleteRow(button.parentNode.parentNode.rowIndex);
            table.deleteRow(idrow);  
        }
    };
    //xmlhttp.open("GET", url+"/"+index, true);
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

function newMatch(){
    var x = document.getElementById("frm1");
    var text = "";
    var i;
    for (i = 0; i < x.length ;i++) {
        text += x.elements[i].value;
    }
    var text1 = x.elements[0].value;
    console.log("TEXTE 1");
    console.log(text1);
    var text2 = x.elements[1].value;
    console.log("TEXTE 2");
    console.log(text2);
    document.getElementById("matches").innerHTML = text1+text2;
    //newMatch(text1,text2);
    loadJSONnewMatch(urlNew+text1+"&"+text2);
    document.getElementById("matches").innerHTML = "Done";
    x.reset();
    
};
function showTable(){
    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
};

function endGame(index,){

}

//To add button to one row
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

function loadJSONend(url,index,box){
    console.log("JSON LOAD REMOVE");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            console.log(myArr);
            encounters  = Object.values(myArr)[0]; 
            //loadJSONTable(urlAll);
            var idrow = box.parentNode.parentNode.rowIndex;
            console.log("DELETE ROW "+idrow); 
            //var empTab = document.getElementById('empTable');
           // table.deleteRow(button.parentNode.parentNode.rowIndex);
            //table.deleteRow(idrow);  
        }
    };
    //xmlhttp.open("GET", url+"/"+index, true);
    xmlhttp.open("GET", url+index, true);
    xmlhttp.send();
}

function addCheckboxEnd(index){
    var checkbox = document.createElement("input");
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('value', "End");
    var id ="c"+index;
    checkbox.setAttribute("id",id);
    checkbox.addEventListener("click",function (){
        endGame(urlRemove,index,checkbox);

    });
    console.log(checkbox);
    return checkbox;
    
}


// ADD JSON DATA TO THE TABLE AS ROWS.
function addRowsToTable(){
    var index = 0; 
    for (var i = 0; i < encounters.length; i++) {
        tr = table.insertRow(-1);

        var tabCell = tr.insertCell(-1);
        var box = addCheckboxEnd(index);
        tabCell.appendChild(box); 

        for (var j = 1; j < col.length-1; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = encounters[i][col[j]]; 
            console.log(tabCell.textContent);
            if(j===1){
                index = tabCell.textContent;
            }
            if(j===4 && tabCell.textContent==="true"){
                console.log(tabCell.textContent);
                box.checked=true;
            }
        }
        //Button to remove row
        var tabCell = tr.insertCell(-1);
        var btn = addButton(index);
        tabCell.appendChild(btn);  
        
    }
    
};

function addOneRowToTable(){
    console.log("NEW LINE");
    tr = table.insertRow(-1);
    var tabCell = tr.insertCell(-1);
    var box = addCheckboxEnd(0);
    tabCell.appendChild(box); 
    

    for (var j = 1; j < col.length-1; j++) {
        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = encounters[encounters.length-1][col[j]];
        if(j===1){
            var index = tabCell.textContent;
        }
        if(j===4 && tabCell.textContent==="true"){
            console.log(tabCell.textContent);
            box.checked=true;
        }
    }
    //Button to remove row
    var tabCell = tr.insertCell(-1);
    var btn = addButton(index);
    tabCell.appendChild(btn);
}

function createTableFromJSON() {
    console.log("CREATE TABLE");
    console.log(encounters);

   // table.setAttribute('id', 'empTable');

    // EXTRACT VALUE FOR HTML HEADER. 
    //For the end game buttons
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
    var tr = table.insertRow(-1);                   // TABLE ROW.
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    addRowsToTable();
    showTable();

};
 
