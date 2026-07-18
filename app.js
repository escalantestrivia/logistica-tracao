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
    // Salva a última tela aberta
localStorage.setItem("ultimaTela", tela);
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

function carregarTabelaTrens() {

    const tbody = document.getElementById("tbodyTrens");

    tbody.innerHTML = "";

    for (let i = 1; i <= 35; i++) {

        tbody.innerHTML += `
        <tr>

            <td class="text-center fw-bold">${i}</td>

            <td contenteditable="true" tabindex="0"></td>

            <td contenteditable="true" tabindex="0"></td>

            <td contenteditable="true" tabindex="0"></td>

        </tr>
        `;

    }

}

function habilitarColarExcel() {

    const modal = document.getElementById("modalFrota");

modal.addEventListener("shown.bs.modal", function () {

    const primeiraCelula =
        document.querySelector("#tbodyTrens tr:first-child td:nth-child(2)");

    if (primeiraCelula) {

        primeiraCelula.focus();

        const range = document.createRange();
        range.selectNodeContents(primeiraCelula);

        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

    }

});

    const tbody = document.getElementById("tbodyTrens");

    tbody.addEventListener("paste", function (e) {

        e.preventDefault();

        const texto = (e.clipboardData || window.clipboardData).getData("text");

        const linhas = texto.split(/\r?\n/);

        const linhaInicial = e.target.parentElement.rowIndex - 1;
        const colunaInicial = e.target.cellIndex;

        linhas.forEach((linha, i) => {

            if (linha.trim() === "") return;

            const colunas = linha.split("\t");

            colunas.forEach((valor, j) => {

                const linhaTabela = tbody.rows[linhaInicial + i];

                if (!linhaTabela) return;

                const celula = linhaTabela.cells[colunaInicial + j];

                if (!celula) return;

                celula.innerText = valor;

            });

        });

        atualizarQuantidadeFrota();

    });

}

function atualizarQuantidadeFrota() {

    const linhas = document.querySelectorAll("#tbodyTrens tr");

    let total = 0;

    linhas.forEach(linha => {

        const tue = linha.cells[1].innerText.trim();

        if (tue !== "") {
            total++;
        }

    });

    document.getElementById("frotaEquipada").value = total;

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

habilitarColarExcel();

calcularTotalGestao();
// ===================================
// Finalizar
// ===================================

function finalizarRelatorio() {

    alert("Função em desenvolvimento.");

}
