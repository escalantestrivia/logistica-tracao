// ================================
// LOGÍSTICA DA TRAÇÃO
// app.js
// ================================

// Login
const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
    window.location.href = "login.html";
}

// Inicialização
window.onload = function () {

    // Barra superior
    document.getElementById("lblNome").textContent = usuario.nome;
    document.getElementById("lblMatricula").textContent = usuario.matricula;

    // Identificação
    document.getElementById("txtNome").value = usuario.nome;
    document.getElementById("txtMatricula").value = usuario.matricula;

    document.getElementById("txtData").value =
        new Date().toISOString().split("T")[0];

    // Última tela aberta
    const ultimaTela =
        localStorage.getItem("ultimaTela") || "identificacao";

    mostrarTela(ultimaTela);

    // Eventos Gestão
    [
        "controleApresentacao",
        "ausencias",
        "viras",
        "postoEscala",
        "outros"
    ].forEach(id => {

        document
            .getElementById(id)
            .addEventListener("input", calcularTotalGestao);

    });

    function calcularTotalGestao() {

    const controle = Number(document.getElementById("controleApresentacao").value) || 0;
    const ausencias = Number(document.getElementById("ausencias").value) || 0;
    const viras = Number(document.getElementById("viras").value) || 0;
    const posto = Number(document.getElementById("postoEscala").value) || 0;
    const outros = Number(document.getElementById("outros").value) || 0;

    const total = controle - ausencias - viras - posto - outros;

    document.getElementById("totalGestao").textContent = total;

}
// ===================================
// Troca de telas
// ===================================

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

        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.style.display = (id === tela) ? "block" : "none";
        }

    });

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

    const botao = document.getElementById(botoes[tela]);

    if (botao) {
        botao.classList.add("active");
    }

    localStorage.setItem("ultimaTela", tela);

}

// ===================================
// Iniciar Relatório
// ===================================

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
        posto: posto,
        turno: turno,
        data: data,
        checklist: [],
        fatos: [],
        locomotivas: [],
        historico: []
    };

    localStorage.setItem("relatorio", JSON.stringify(relatorio));

    mostrarTela("checklist");

}
// ===================================
// Frota Equipada
// ===================================

// ===================================
// Frota Equipada
// ===================================

function carregarTabelaTrens() {

    const tbody = document.getElementById("tbodyTrens");

    if (!tbody) return;

    tbody.innerHTML = "";

    for (let i = 1; i <= 35; i++) {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="text-center fw-bold">${i}</td>

            <td>
                <input type="text"
                       class="form-control form-control-sm tue">
            </td>

            <td>
                <input type="text"
                       class="form-control form-control-sm local">
            </td>

            <td>
                <input type="text"
                       class="form-control form-control-sm operador">
            </td>
        `;

        tbody.appendChild(tr);

    }

}
function habilitarColarExcel() {

    const tbody = document.getElementById("tbodyTrens");

    if (!tbody) return;

    // Evita registrar o evento mais de uma vez
    tbody.onpaste = function (e) {

        e.preventDefault();

        const texto = (e.clipboardData || window.clipboardData).getData("text");

        const linhas = texto.trim().split(/\r?\n/);

        const divInicial = e.target.closest(".celula");

        if (!divInicial) return;

        const tdInicial = divInicial.parentElement;

        const linhaInicial = tdInicial.parentElement.rowIndex;
        const colunaInicial = tdInicial.cellIndex;

        linhas.forEach((linha, i) => {

            if (linha.trim() === "") return;

            const colunas = linha.split("\t");

            colunas.forEach((valor, j) => {

                const tr = tbody.rows[linhaInicial + i];

                if (!tr) return;

                const td = tr.cells[colunaInicial + j];

                if (!td) return;

                td.firstElementChild.innerText = valor.trim();

            });

        });

        atualizarQuantidadeFrota();

    };

}
function atualizarQuantidadeFrota() {

    const tbody = document.getElementById("tbodyTrens");

    if (!tbody) return;

    let total = 0;

    Array.from(tbody.rows).forEach(linha => {

        const div = linha.cells[1].querySelector(".celula");

        if (div && div.innerText.trim() !== "") {
            total++;
        }

    });

    const campo = document.getElementById("frotaEquipada");

    if (campo) {
        campo.value = total;
    }

}
// ===================================
// Finalizar
// ===================================

function limparFrota() {

    if (!confirm("Deseja realmente limpar toda a Frota Equipada?")) {
        return;
    }

    const tbody = document.getElementById("tbodyTrens");

    if (!tbody) return;

    Array.from(tbody.rows).forEach(linha => {

        linha.cells[1].innerText = "";
        linha.cells[2].innerText = "";
        linha.cells[3].innerText = "";

    });

    document.getElementById("frotaEquipada").value = 0;

}

function finalizarRelatorio() {

    alert("Função em desenvolvimento.");

}
