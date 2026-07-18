// ==============================
// LOGÍSTICA DA TRAÇÃO
// app.js
// ==============================

let banco = {};

const abas = [
    "checklist",
    "fatos",
    "locomotivas",
    "radios",
    "historico"
];

document.addEventListener("DOMContentLoaded", () => {

    verificarLogin();

    iniciarSistema();

});

function iniciarSistema(){

    carregarBanco();

    definirDataAtual();

    carregarCabecalho();

    abrir("checklist");

    carregarDia();

}

function abrir(nome){

    abas.forEach(aba=>{

        const tela = document.getElementById(aba);

        if(tela)
            tela.classList.add("d-none");

    });

    document.querySelectorAll(".nav-link").forEach(item=>{

        item.classList.remove("active");

    });

    document.getElementById(nome).classList.remove("d-none");

    event.target.classList.add("active");

}

function definirDataAtual(){

    const hoje = new Date();

    const data =
        hoje.getFullYear() + "-" +
        String(hoje.getMonth()+1).padStart(2,"0") + "-" +
        String(hoje.getDate()).padStart(2,"0");

    document.getElementById("data").value = data;

}

function carregarCabecalho(){

    const usuario =
        JSON.parse(localStorage.getItem("usuarioLogado"));

    if(usuario){

        document.getElementById("escalante").value =
            usuario.nome;

        document.getElementById("usuarioLogado").innerHTML =
            usuario.nome;

    }

    document.getElementById("local").value =
        localStorage.getItem("local");

    document.getElementById("turno").value =
        localStorage.getItem("turno");

}

function carregarDia(){

    const chave = obterChave();

    if (!banco[chave]) {

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    banco[chave] = {

        data: document.getElementById("data").value,

        local: document.getElementById("local").value,

        turno: document.getElementById("turno").value,

        usuario: usuario ? usuario.nome : "",

        matricula: usuario ? usuario.matricula : "",

        dataCriacao: new Date().toISOString(),

        ultimaAlteracao: new Date().toISOString(),

        checklist: {},

        fatos: [],

        locomotivas: [],

        radios: []

    };

    salvarBanco();

}

    montarChecklist();

    montarfatos();

    montarLocomotivas();

    montarHistorico();

    if(typeof renderRadios==="function")
        renderRadios();

}

function obterChave(){

    const data=document.getElementById("data").value;

    const local=document.getElementById("local").value;

    const turno=document.getElementById("turno").value;

    return data+"_"+local+"_"+turno;

}

document.getElementById("data")
.addEventListener("change",carregarDia);

document.getElementById("local")
.addEventListener("change",carregarDia);

document.getElementById("turno")
.addEventListener("change",carregarDia);

function novoRelatorio(){

    if(confirm("Criar novo relatório?")){

        document.location.reload();

    }

}

function logout(){

    localStorage.removeItem("usuarioLogado");

    localStorage.removeItem("local");

    localStorage.removeItem("turno");

    location.href="login.html";

}
