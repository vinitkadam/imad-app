console.log('Loaded!');
var button = document.getElementById('counter');
var counter=0;
button.onclick = function(){
    counter = counter+1;
    document.getElementById('count').innerHtml = counter;
}