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

    calcularTotalGestao();

    // Modal Frota
    const modal = document.getElementById("modalFrota");

    if (modal) {

        modal.addEventListener("shown.bs.modal", () => {

            const tbody = document.getElementById("tbodyTrens");

            if (tbody.rows.length === 0) {

                carregarTabelaTrens();
                habilitarColarExcel();

            }

            const primeira =
                document.querySelector("#tbodyTrens tr:first-child td:nth-child(2)");

            if (primeira) primeira.focus();

        });

    }

};
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

function carregarTabelaTrens() {

    const tbody = document.getElementById("tbodyTrens");

    if (!tbody) return;

    tbody.innerHTML = "";

    for (let i = 1; i <= 35; i++) {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td class="text-center fw-bold">${i}</td>
            <td contenteditable="true" tabindex="0"></td>
            <td contenteditable="true" tabindex="0"></td>
            <td contenteditable="true" tabindex="0"></td>
        `;

        tbody.appendChild(linha);

    }

}
function habilitarColarExcel() {

    const tbody = document.getElementById("tbodyTrens");

    if (!tbody) return;

    tbody.addEventListener("paste", function (e) {

        e.preventDefault();

        const texto =
            (e.clipboardData || window.clipboardData).getData("text");

        const linhas = texto.trim().split(/\r?\n/);

        const linhaInicial = e.target.parentElement.rowIndex - 1;
        const colunaInicial = e.target.cellIndex;

        linhas.forEach((linha, i) => {

            const valores = linha.split("\t");

            valores.forEach((valor, j) => {

                const tr = tbody.rows[linhaInicial + i];

                if (!tr) return;

                const td = tr.cells[colunaInicial + j];

                if (!td) return;

                td.innerText = valor;

            });

        });

        atualizarQuantidadeFrota();

    }, { once: true });

}
function atualizarQuantidadeFrota() {

    const tbody = document.getElementById("tbodyTrens");

    if (!tbody) return;

    let total = 0;

    Array.from(tbody.rows).forEach(linha => {

        const tue = linha.cells[1].innerText.trim();

        if (tue !== "") {
            total++;
        }

    });

    const campo = document.getElementById("frotaEquipada");

    if (campo) {
        campo.value = total;
    }

}
function calcularTotalGestao() {

    const controle =
        Number(document.getElementById("controleApresentacao")?.value) || 0;

    const ausencias =
        Number(document.getElementById("ausencias")?.value) || 0;

    const viras =
        Number(document.getElementById("viras")?.value) || 0;

    const posto =
        Number(document.getElementById("postoEscala")?.value) || 0;

    const outros =
        Number(document.getElementById("outros")?.value) || 0;

    const total =
        controle -
        ausencias -
        viras -
        posto -
        outros;

    const lblTotal = document.getElementById("totalGestao");

    if (lblTotal) {
        lblTotal.innerText = total;
    }

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
