var button = document.getElementById('counter');

button.onclick = function(){
    
    //create a request
    var request = new XMLHttpRequest();
    
    //capture the reponse and store it in a variable
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                var counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter.toString();            
            }
        }
    };
    
    //Make a request
    request.open('GET','http://vinitkadam1997.imad.hasura-app.io/counter',true);
    request.send(null);
};

var nameInput = document.getElementById('name');
var name = nameInput.value;
var submit = document.getElementById('submit_btn');
submit.onclick() = function() {
    //make arequest to server
    
    //capture a list of names and render it as a list
    var names = ['name1','name2','name3'];
    var list = '';
    for(var i=0;i<names.length;i++){
        list+='<li>'+names[i]+'</li>';
    }
    var namelist = document.getElementById('namelist');
    namelist.innerHTML = list;
}