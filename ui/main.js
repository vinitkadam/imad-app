var button = document.getElementById('counter');
var counter = 0;
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
    request.open('GET','http://vinitkadam1997.imad.hasura-app.io/counter',false);
    request.send(null);
};