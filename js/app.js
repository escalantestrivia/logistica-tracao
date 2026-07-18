//==================================================
// LOGÍSTICA DA TRAÇÃO
// app.js
//==================================================

// Usuário logado
let usuario = null;

//==================================================
// Inicialização
//==================================================

document.addEventListener("DOMContentLoaded", iniciarSistema);

function iniciarSistema() {

    verificarLogin();

    carregarUsuario();

    mostrarTela("identificacao");

}

//==================================================
// Login
//==================================================

function verificarLogin() {

    usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {

        window.location.href = "login.html";

    }

}

function carregarUsuario() {

    // Navbar
    document.getElementById("lblNome").textContent = usuario.nome;
    document.getElementById("lblMatricula").textContent = usuario.matricula;

    // Identificação
    document.getElementById("txtNome").value = usuario.nome;
    document.getElementById("txtMatricula").value = usuario.matricula;

}

function logout() {

    localStorage.removeItem("usuario");

    window.location.href = "login.html";

}

//==================================================
// Navegação
//==================================================

function mostrarTela(tela) {

    const telas = [

        "identificacao",
        "checklist",
        "fatos",
        "locomotivas",
        "historico"

    ];

    telas.forEach(nome => {

        const div = document.getElementById(nome);

        if (div) {

            div.style.display = "none";

        }

    });

    const atual = document.getElementById(tela);

    if (atual) {

        atual.style.display = "block";

    }

    atualizarMenu(tela);

}

function atualizarMenu(tela) {

    const botoes = [

        "menuIdentificacao",
        "menuChecklist",
        "menuFatos",
        "menuLocomotivas",
        "menuHistorico"

    ];

    botoes.forEach(botao => {

        const item = document.getElementById(botao);

        if (item) {

            item.classList.remove("active");

        }

    });

    switch (tela) {

        case "identificacao":
            document.getElementById("menuIdentificacao").classList.add("active");
            break;

        case "checklist":
            document.getElementById("menuChecklist").classList.add("active");
            break;

        case "fatos":
            document.getElementById("menuFatos").classList.add("active");
            break;

        case "locomotivas":
            document.getElementById("menuLocomotivas").classList.add("active");
            break;

        case "historico":
            document.getElementById("menuHistorico").classList.add("active");
            break;

    }

}

//==================================================
// Identificação
//==================================================

function iniciarRelatorio() {

    const posto = document.getElementById("cmbPosto").value;
    const turno = document.getElementById("cmbTurno").value;
    const data = document.getElementById("txtData").value;

    if (posto === "") {

        alert("Selecione o posto.");

        return;

    }

    if (turno === "") {

        alert("Selecione o turno.");

        return;

    }

    if (data === "") {

        alert("Informe a data.");

        return;

    }

    const relatorio = {

        nome: usuario.nome,
        matricula: usuario.matricula,
        posto,
        turno,
        data

    };

    localStorage.setItem("relatorio", JSON.stringify(relatorio));

    mostrarTela("checklist");

}

//==================================================
// PDF
//==================================================

function finalizarRelatorio() {

    alert("Módulo PDF será implementado posteriormente.");

}
