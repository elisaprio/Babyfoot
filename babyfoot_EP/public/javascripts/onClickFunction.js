let urlAll = "http://localhost:3000/all/";
let urlNew = "http://localhost:3000/new/";
var encounters = [];
// CREATE DYNAMIC TABLE.
//var table = document.createElement("table");
var table = null;
var col = [];

//ON LOAD TABLE
window.addEventListener("load", loadJSONTable(urlAll),true);
//document.addEventListener("onload", CreateTableFromJSON(),true);
//document.getElementById("body").addEventListener("load",loadJSONTable(urlAll),true);
//document.getElementById("newMatch").addEventListener("load",createTableFromJSON(),true);

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
    
    
};
function showTable(){
    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
};

// ADD JSON DATA TO THE TABLE AS ROWS.
function addRowsToTable(){
    for (var i = 0; i < encounters.length; i++) {
        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = encounters[i][col[j]];
        }
    }
};

function addOneRowToTable(){
    console.log("NEW LINE");
    tr = table.insertRow(-1);
    for (var j = 0; j < col.length; j++) {
        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = encounters[encounters.length-1][col[j]];
        table.appendChild(tabCell);
    }
}

function createTableFromJSON() {
    console.log("CREATE TABLE");
    console.log(encounters);
    // EXTRACT VALUE FOR HTML HEADER. 
    for (var i = 0; i < encounters.length; i++) {
        for (var key in encounters[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    // CREATE DYNAMIC TABLE.
    
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
 
