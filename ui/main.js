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

//Submit name
var submit = document.getElementById('submit_btn');

submit.onclick = function() {
    
    //create a request
    var request = new XMLHttpRequest();
    
    //capture the reponse and store it in a variable
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                var names = request.responseText;
                names = JSON.parse(names);
                var list = '';
                for(var i=0;i<names.length;i++){
                    list+='<li>'+names[i]+'</li>';
                }
                var namelist = document.getElementById('namelist');
                namelist.innerHTML = list;         
            }
        }
    };
    
    //Make a request
    var nameInput = document.getElementById('name');
    var name = nameInput.value;
    request.open('GET','http://vinitkadam1997.imad.hasura-app.io/submit-name?name='+name,true);
    request.send(null);
    
};

//for login
var login = document.getElementById('submit_button');

login.onclick = function() {
    
    //create a request
    var request = new XMLHttpRequest();
    
    //capture the reponse and store it in a variable
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                alert('login successfull');
            }
        }
    };
    
    //Make a request
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    request.open('POST','http://vinitkadam1997.imad.hasura-app.io/login',true);
    request.send({"username":username,"password":password});
    
};