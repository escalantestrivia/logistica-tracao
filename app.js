// ================================
// LOGÍSTICA DA TRAÇÃO
// app.js
// ================================

// Verifica login
const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
    window.location.href = "login.html";
}

// Preenche informações do usuário
window.onload = function () {

    // Barra superior
    document.getElementById("lblNome").textContent = usuario.nome;
    document.getElementById("lblMatricula").textContent = usuario.matricula;

    // Tela Identificação
    document.getElementById("txtNome").value = usuario.nome;
    document.getElementById("txtMatricula").value = usuario.matricula;

    // Data atual
    document.getElementById("txtData").value =
        new Date().toISOString().split("T")[0];

    // Abre primeira tela
    mostrarTela("identificacao");
};

// ===================================
// Troca de telas
// ===================================

function mostrarTela(tela) {

    const telas = [
        "identificacao",
        "checklist",
        "fatos",
        "locomotivas",
        "historico"
    ];

    telas.forEach(id => {

        document.getElementById(id).style.display =
            (id === tela) ? "block" : "none";

    });

    // Atualiza menu lateral
    document.querySelectorAll(".list-group-item").forEach(item => {
        item.classList.remove("active");
    });

    const botoes = {
        identificacao: "menuIdentificacao",
        checklist: "menuChecklist",
        fatos: "menuFatos",
        locomotivas: "menuLocomotivas",
        historico: "menuHistorico"
    };

    document.getElementById(botoes[tela]).classList.add("active");
}

// ===================================
// Iniciar Relatório
// ===================================

function iniciarRelatorio() {

    const posto = document.getElementById("cmbPosto").value;
    const turno = document.getElementById("cmbTurno").value;
    const data = document.getElementById("txtData").value;

    if (!posto) {
        alert("Selecione o Posto.");
        return;
    }

    if (!turno) {
        alert("Selecione o Turno.");
        return;
    }

    if (!data) {
        alert("Informe a Data.");
        return;
    }

    const relatorio = {

        nome: usuario.nome,
        matricula: usuario.matricula,

        posto,
        turno,
        data,

        checklist: [],
        fatos: [],
        locomotivas: [],
        historico: []

    };

    localStorage.setItem(
        "relatorio",
        JSON.stringify(relatorio)
    );

    mostrarTela("checklist");
}

function carregarTabelaTrens(){

    const tbody = document.getElementById("tbodyTrens");

    tbody.innerHTML = "";

    for(let i = 1; i <= 35; i++){

        tbody.innerHTML += `

        <tr>

            <td class="text-center">${i}</td>

            <td>

                <input
                    type="text"
                    class="form-control tue">

            </td>

            <td>

                <input
                    type="text"
                    class="form-control local">

            </td>

            <td>

                <input
                    type="text"
                    class="form-control operador">

            </td>

        </tr>

        `;

    }

}

function calcularTotalGestao(){

    const controle = Number(document.getElementById("controleApresentacao").value) || 0;
    const ausencias = Number(document.getElementById("ausencias").value) || 0;
    const viras = Number(document.getElementById("viras").value) || 0;
    const posto = Number(document.getElementById("postoEscala").value) || 0;
    const outros = Number(document.getElementById("outros").value) || 0;

    const total =
        controle -
        ausencias -
        viras -
        posto -
        outros;

    document.getElementById("totalGestao").innerText = total;

}

[
"controleApresentacao",
"ausencias",
"viras",
"postoEscala",
"outros"
].forEach(id=>{

    document
        .getElementById(id)
        .addEventListener("input",calcularTotalGestao);

});

carregarTabelaTrens();

calcularTotalGestao();
// ===================================
// Finalizar
// ===================================

function finalizarRelatorio() {

    alert("Função em desenvolvimento.");

}
