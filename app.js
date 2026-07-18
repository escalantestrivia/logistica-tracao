// ================================
// LOGÍSTICA DA TRAÇÃO
// app.js
// ================================

// Login
const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
    window.location.href = "login.html";
}

// ================================
// Inicialização
// ================================

window.onload = function () {

    // Barra superior
    document.getElementById("lblNome").textContent = usuario.nome;
    document.getElementById("lblMatricula").textContent = usuario.matricula;

    // Identificação
    document.getElementById("txtNome").value = usuario.nome;
    document.getElementById("txtMatricula").value = usuario.matricula;
    document.getElementById("txtData").value =
        new Date().toISOString().split("T")[0];

    // Última tela
    const ultimaTela =
        localStorage.getItem("ultimaTela") || "identificacao";

    mostrarTela(ultimaTela);

    // Eventos Gestão de Operadores
    [
        "controleApresentacao",
        "ausencias",
        "viras",
        "postoEscala",
        "outros"
    ].forEach(id => {

        const campo = document.getElementById(id);

        if (campo) {
            campo.addEventListener("input", calcularTotalGestao);
        }

    });

    calcularTotalGestao();

    // Modal Frota
   const modal = document.getElementById("modalFrota");

if (modal) {

    modal.addEventListener("shown.bs.modal", () => {

        const tbody = document.getElementById("tbodyTrens");

        if (tbody && tbody.rows.length === 0) {

            carregarTabelaTrens();

        }

    });

}

// ================================
// Gestão de Operadores
// ================================

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
        controle - ausencias - viras - posto - outros;

    const campoTotal = document.getElementById("totalGestao");

    if (campoTotal) {
        campoTotal.textContent = total;
    }

}

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

    habilitarColarExcel();

}
function habilitarColarExcel() {

    const tbody = document.getElementById("tbodyTrens");

    if (!tbody) return;

    tbody.querySelectorAll("input").forEach(input => {

        input.onpaste = function (e) {

            const texto =
                (e.clipboardData || window.clipboardData).getData("text");

            // Apenas uma célula → cola normalmente
            if (!texto.includes("\t") && !texto.includes("\n")) {
                return;
            }

            e.preventDefault();

            const linhas = texto.trim().split(/\r?\n/);

            const tdInicial = this.parentElement;
            const trInicial = tdInicial.parentElement;

            const linhaInicial =
                Array.from(tbody.rows).indexOf(trInicial);

            const colunaInicial =
                tdInicial.cellIndex;

            linhas.forEach((linha, i) => {

                const valores = linha.split("\t");

                valores.forEach((valor, j) => {

                    const tr = tbody.rows[linhaInicial + i];

                    if (!tr) return;

                    const td = tr.cells[colunaInicial + j];

                    if (!td) return;

                    const inputDestino = td.querySelector("input");

                    if (inputDestino) {
                        inputDestino.value = valor.trim();
                    }

                });

            });

        };

    });

}
function atualizarQuantidadeFrota() {

    const tbody = document.getElementById("tbodyTrens");

    if (!tbody) return;

    let total = 0;

    Array.from(tbody.rows).forEach(linha => {

        const input = linha.cells[1].querySelector("input");

        if (input && input.value.trim() !== "") {
            total++;
        }

    });

    const campo = document.getElementById("frotaEquipada");

    if (campo) {
        campo.value = total;
    }

}
function limparFrota() {

    if (!confirm("Deseja realmente limpar toda a tabela?")) {
        return;
    }

    document
        .querySelectorAll("#tbodyTrens input")
        .forEach(input => input.value = "");

}
function finalizarRelatorio() {

    alert("Função em desenvolvimento.");

}


