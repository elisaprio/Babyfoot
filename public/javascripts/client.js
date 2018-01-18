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

//Create socket and socket functionnalities
console.log("CREATE CLIENT SOCKET");
var socket = io.connect('http://localhost:3000');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

socket.on('load', function (data) {
    console.log("load");
    console.log(data);
    loadJSONTable();
 });

function updateSocket(){
    console.log('UPDATE SOCKET');
    socket.emit('update', { table: 'updated' });
};

//To display the html table right after the page is opened
//document.addEventListener("load", createSocket(),true);
document.addEventListener("load", loadJSONTable(),true);
//Possible to add an element while pressing the "enter" key
document.addEventListener("keyup",function (e){
        var key = e.keyCode ? e.keyCode : e.which;
        if(key == 13){
            newMatch();
        }
});

function loadJSONTable(){
    console.log("JSON LOAD");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            encounters  = Object.values(myArr)[0]; 
            console.log("ENCOUNTERS");
            console.log(encounters);
            table = null;
            col=[];
            countNotOver = 0;
            table = document.createElement("table");
            createTableFromJSON();
            document.getElementById("notOver").innerHTML = txtCount+countNotOver;
            
        }    
    };
    xmlhttp.open("GET", urlAll, true);
    xmlhttp.send(); 
};

//To send request for adding, updating or deleting an element in table
function loadOption(url,requestType,objOpt){
    if (typeof objOpt === 'undefined') { optionalArg = 'default'; }
    console.log("REQ "+requestType);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            updateSocket();
            loadJSONTable();   
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(); 
};

//create an html table
function createTableFromJSON() {
    console.log("CREATE TABLE");
    // EXTRACT VALUE FOR HTML HEADER. 
    //For the update game checkbox
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
        var box = addCheckboxUpdate(encounters[i][col[1]]);
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
    var url = urlNew+text1+"&"+text2;
    loadOption(url,"add");
    x.reset();
    
};

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
       var url = urlRemove+index;
        loadOption(url,"remove",button);
    });
    return button;
}

//Create a checkbox with the right properties to update an element from the database while checked (match finished or not)
function addCheckboxUpdate(index){
    var checkbox = document.createElement("input");
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('value', "Update");
    var id ="c"+index;
    checkbox.setAttribute("id",id);
    checkbox.addEventListener("change",function (){
        var url = urlUpdate+index+"&"+checkbox.checked.toString();
        loadOption(url,"update",checkbox);
    });
    return checkbox;
    
}
