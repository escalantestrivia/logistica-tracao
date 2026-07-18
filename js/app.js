const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {

    location.href = "login.html";

}

document.getElementById("lblNome").innerHTML = usuario.nome;

document.getElementById("lblMatricula").innerHTML = usuario.matricula;

function mostrarTela(nome) {

    document.querySelectorAll("#identificacao,#checklist,#fatos,#locomotivas,#historico")

        .forEach(div => div.style.display = "none");

    document.getElementById(nome).style.display = "block";

}const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {

    location.href = "login.html";

}

document.getElementById("lblNome").innerHTML = usuario.nome;

document.getElementById("lblMatricula").innerHTML = usuario.matricula;

function mostrarTela(nome) {

    document.querySelectorAll("#identificacao,#checklist,#fatos,#locomotivas,#historico")

        .forEach(div => div.style.display = "none");

    document.getElementById(nome).style.display = "block";

}

document.getElementById("txtNome").value = usuario.nome;
document.getElementById("txtMatricula").value = usuario.matricula;

document.getElementById("lblNome").textContent = usuario.nome;
document.getElementById("lblMatricula").textContent = usuario.matricula;

function iniciarRelatorio(){

    alert("Relatório iniciado.");

}
