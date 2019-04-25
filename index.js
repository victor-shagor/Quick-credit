document.querySelector('#liclients').addEventListener('click' , showClients)
document.querySelector('#liloans').addEventListener('click' , showLoans)
document.querySelector('#lirunning').addEventListener('click' , showRunning)
document.querySelector('#lirepaid').addEventListener('click' , showRepaid)
document.querySelector('#lipost').addEventListener('click' , showPost)



function showClients  (){
 const clients = document.querySelector('#clients')
 const repaid =document.querySelector('#repaid')
 const post =document.querySelector('#container')
 const loans =document.querySelector('#loans')
 const running =document.querySelector('#running')
 const board = document.querySelector('#board')
 board.style.display = "none";
 clients.style.display = "block";
 repaid.style.display = "none";
 post.style.display = "none";
 loans.style.display = "none";
 running.style.display = "none";
 
}

function showLoans  (){
 const clients = document.querySelector('#clients')
 const running =document.querySelector('#running')
 const repaid =document.querySelector('#repaid')
 const post =document.querySelector('#container')
 const loans =document.querySelector('#loans')
 const board = document.querySelector('#board')
 board.style.display = "none";
 clients.style.display = "none";
 running.style.display = "none";
 repaid.style.display = "none";
 post.style.display = "none";

  loans.style.display = "block";
}

function showRunning  (){
 const clients = document.querySelector('#clients')
 const repaid =document.querySelector('#repaid')
 const post =document.querySelector('#container')
 const loans =document.querySelector('#loans')
 const running =document.querySelector('#running')
 const board = document.querySelector('#board')
 board.style.display = "none";
 clients.style.display = "none";
 repaid.style.display = "none";
 post.style.display = "none";
 loans.style.display = "none";

  running.style.display = "block";
}

function showRepaid  (){
 const clients = document.querySelector('#clients')
 const repaid =document.querySelector('#repaid')
 const post =document.querySelector('#container')
 const loans =document.querySelector('#loans')
 const running =document.querySelector('#running')
 const board = document.querySelector('#board')
 board.style.display = "none";
 clients.style.display = "none";
 repaid.style.display = "block";
 post.style.display = "none";
 loans.style.display = "none";

  running.style.display = "none";

}

function showPost  (){
 const clients = document.querySelector('#clients')
 const repaid =document.querySelector('#repaid')
 const post =document.querySelector('#container')
 const loans =document.querySelector('#loans')
 const running =document.querySelector('#running')
 const board = document.querySelector('#board')
 board.style.display = "none";
 clients.style.display = "none";
 repaid.style.display = "none";
 post.style.display = "block";
 loans.style.display = "none";
 running.style.display = "none";
 
}
