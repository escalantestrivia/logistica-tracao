// ================================
// LOGÍSTICA DA TRAÇÃO
// app.js
// ================================


// Login
const usuario = JSON.parse(localStorage.getItem("usuario"));
let relatorioIniciado = false;
let numeroOcorrencia = 0;

if (!usuario) {
    window.location.href = "login.html";
}

// ================================
// Inicialização
// ================================

window.onload = function () {

    relatorioIniciado = false;

    // Barra superior
    document.getElementById("lblNome").textContent = usuario.nome;
    document.getElementById("lblMatricula").textContent = usuario.matricula;

    // Identificação
    document.getElementById("txtNome").value = usuario.nome;
    document.getElementById("txtMatricula").value = usuario.matricula;
    document.getElementById("txtData").value =
        new Date().toISOString().split("T")[0];

    // Bloqueia os menus
    document.getElementById("menuChecklist").classList.add("bloqueado");
    document.getElementById("menuFatos").classList.add("bloqueado");
    document.getElementById("menuLocomotivas").classList.add("bloqueado");
    document.getElementById("menuHistorico").classList.add("bloqueado");

    // Eventos Gestão de Operadores
    [
        "controleApresentacao",
        "frotaEquipada",
        "ausencias",
        "viras",
        "postoEscala",
        "outros"
    ].forEach(id => {

        const campo = document.getElementById(id);

        if (campo) {
            campo.addEventListener("input", calcularTotalGestao);
            campo.addEventListener("change", calcularTotalGestao);
        }

    });

    calcularTotalGestao();

    // Exibe a tela inicial
    mostrarTela("identificacao");

};
    // Modal Frota
   const modal = document.getElementById("modalFrota");

if (modal) {

    modal.addEventListener("shown.bs.modal", () => {

        const tbody = document.getElementById("tbodyTrens");

        if (tbody && tbody.rows.length === 0) {

            carregarTabelaTrens();

        }

    });

};   // <<< ESTA LINHA ESTÁ FALTANDO

function calcularTotalGestao() {

    const controle = parseInt(document.getElementById("controleApresentacao")?.value, 10) || 0;
    const frota = parseInt(document.getElementById("frotaEquipada")?.value, 10) || 0;
    const ausencias = parseInt(document.getElementById("ausencias")?.value, 10) || 0;
    const viras = parseInt(document.getElementById("viras")?.value, 10) || 0;
    const postoEscala = parseInt(document.getElementById("postoEscala")?.value, 10) || 0;
    const outros = parseInt(document.getElementById("outros")?.value, 10) || 0;

    const total =
        controle
        - frota
        - ausencias
        - viras
        - postoEscala
        - outros;

    const lblTotal = document.getElementById("totalGestao");

    if (lblTotal) {
        lblTotal.textContent = total;
    }

}

function mostrarTela(tela) {

    if (
        !relatorioIniciado &&
        tela !== "identificacao"
    ) {
        mostrarModalRelatorio();
        return;
    }
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

relatorioIniciado = true;

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
function limparFrota() {

    if (!confirm("Deseja realmente limpar toda a tabela?")) return;

    document.querySelectorAll("#tbodyTrens input").forEach(input => {

        input.value = "";

    });

    document.querySelector("#tbodyTrens input")?.focus();

}

function mostrarModalRelatorio() {

    const modal = new bootstrap.Modal(
        document.getElementById("modalRelatorio")
    );

    modal.show();

}

function salvarChecklist() {

    const relatorio = JSON.parse(localStorage.getItem("relatorio"));

    relatorio.checklist = {

        controleApresentacao: parseInt(document.getElementById("controleApresentacao").value) || 0,

        frotaEquipada: parseInt(document.getElementById("frotaEquipada").value) || 0,

        ausencias: parseInt(document.getElementById("ausencias").value) || 0,

        viras: parseInt(document.getElementById("viras").value) || 0,

        postoEscala: parseInt(document.getElementById("postoEscala").value) || 0,

        outros: parseInt(document.getElementById("outros").value) || 0,

        totalGestao: document.getElementById("totalGestao").textContent,

        observacoes: document.getElementById("observacoesGestao").value

    };

    localStorage.setItem("relatorio", JSON.stringify(relatorio));

    mostrarTela("fatos");

}

function adicionarOcorrencia() {

    numeroOcorrencia++;

    const posto = document.getElementById("cmbPosto").value;

    const container = document.getElementById("listaOcorrencias");

    container.insertAdjacentHTML("beforeend", `

        <div class="card mt-3">

            <div class="card-header bg-light">

                <strong>${numeroOcorrencia}ª Ocorrência</strong>

            </div>

            <div class="card-body">

                <div class="row">

                    <div class="col-md-3">

                        <label class="form-label">Local</label>

                        <input
                            type="text"
                            class="form-control localOcorrencia"
                            value="${posto}"
                            readonly>

                    </div>

                </div>

                <div class="mt-3">

                    <label class="form-label">Descrição</label>

                    <textarea
                        class="form-control descricaoOcorrencia"
                        rows="6"
                        placeholder="Descreva a ocorrência..."></textarea>

                </div>

            </div>

        </div>

    `);

}

function salvarFatos() {

    mostrarTela("locomotivas");

    if (numeroLocomotiva === 0) {

        adicionarLocomotiva();

    }

}

let numeroLocomotiva = 0;

function salvarLocomotivas() {

    const relatorio = JSON.parse(localStorage.getItem("relatorio"));

    relatorio.locomotivas = [];

    document.querySelectorAll("#listaLocomotivas .card").forEach(card => {

        relatorio.locomotivas.push({

            trem: card.querySelector(".trem").value,
            operador1: card.querySelector(".operador1").value,
            operador2: card.querySelector(".operador2").value,

            atendeSA: card.querySelector(".atendeSA").value,
            numeroSA: card.querySelector(".numeroSA").value,

            local: card.querySelector(".local").value,
            km: card.querySelector(".km").value,
            diesel: card.querySelector(".diesel").value,
            horimetro: card.querySelector(".horimetro").value,
            calcos: card.querySelector(".calcos").value,

            talha: card.querySelector(".talha").value,
            kitSOS: card.querySelector(".kitSOS").value,
            mangotes: card.querySelector(".mangotes").value,
            chaves: card.querySelector(".chaves").value,
            ferramentas: card.querySelector(".ferramentas").value,
            adaptador: card.querySelector(".adaptador").value,
            niveis: card.querySelector(".niveis").value,

            observacoes: card.querySelector(".observacoesGerais").value

        });

    });

    localStorage.setItem(
        "relatorio",
        JSON.stringify(relatorio)
    );

    mostrarTela("historico");

}

function toggleSA(select){

    const card = select.closest(".card");

    const campo = card.querySelector(".campoSA");

    campo.style.display =
        select.value === "Sim"
            ? "block"
            : "none";

}

function adicionarLocomotiva() {

    numeroLocomotiva++;

    const container = document.getElementById("listaLocomotivas");

    container.insertAdjacentHTML("beforeend", `

<div class="card mt-3 shadow-sm">

    <div class="card-header bg-light">

        <strong>Locomotiva ${numeroLocomotiva}</strong>

    </div>

    <div class="card-body">

        <div class="row g-3">

            <div class="col-md-2">
                <label class="form-label">Trem</label>
                <input type="text" class="form-control trem">
            </div>

            <div class="col-md-5">
                <label class="form-label">Operador 1</label>
                <input type="text" class="form-control operador1">
            </div>

            <div class="col-md-5">
                <label class="form-label">Operador 2</label>
                <input type="text" class="form-control operador2">
            </div>

        </div>

        <hr>

        <div class="row align-items-end g-3">

            <div class="col-md-3">

                <label class="form-label">Atendendo SA</label>

                <select class="form-select atendeSA"
                        onchange="toggleSA(this)">

                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>

                </select>

            </div>

            <div class="col-md-4 campoSA" style="display:none;">

                <label class="form-label">
                    Número da SA
                </label>

                <input
                    type="text"
                    class="form-control numeroSA"
                    placeholder="Ex.: SA-12345">

            </div>

        </div>

        <hr>

        <div class="row g-3">

            <div class="col-md-3">

                <label class="form-label">Local</label>

                <input
                    type="text"
                    class="form-control local">

            </div>

            <div class="col-md-3">

                <label class="form-label">KM</label>

                <input
                    type="number"
                    class="form-control km">

            </div>

            <div class="col-md-3">

                <label class="form-label">Diesel</label>

                <input
                    type="number"
                    class="form-control diesel">

            </div>

            <div class="col-md-3">

                <label class="form-label">Horímetro</label>

                <input
                    type="number"
                    class="form-control horimetro">

            </div>

        </div>

        <hr>

        <h6 class="fw-bold">
            Inspeção da Locomotiva
        </h6>

        <div class="row g-3">

            <div class="col-md-3">

                <label class="form-label">
                    Calços
                </label>

                <select class="form-select calcos">

                    <option>Sim</option>
                    <option>Não</option>

                </select>

            </div>

            <div class="col-md-9">

                <label class="form-label">
                    Informação dos Calços
                </label>

                <input
                    type="text"
                    class="form-control infoCalcos"
                    placeholder="Quantidade ou observação">

            </div>

        </div>

        <div class="row g-3 mt-2">

            <div class="col-md-4">

                <label class="form-label">
                    Talha
                </label>

                <select class="form-select talha">

                    <option>Sim</option>
                    <option>Não</option>

                </select>

            </div>

            <div class="col-md-4">

                <label class="form-label">
                    Kit SOS
                </label>

                <select class="form-select kitSOS">

                    <option>Sim</option>
                    <option>Não</option>

                </select>

            </div>

            <div class="col-md-4">

                <label class="form-label">
                    Mangueiras / Mangotes
                </label>

                <select class="form-select mangotes">

                    <option>Sim</option>
                    <option>Não</option>

                </select>

            </div>

        </div>

        <div class="row g-3 mt-2">

            <div class="col-md-4">

                <label class="form-label">
                    Chaves de Mangueira
                </label>

                <select class="form-select chaves">

                    <option>Sim</option>
                    <option>Não</option>

                </select>

            </div>

            <div class="col-md-4">

                <label class="form-label">
                    Ferramentas
                </label>

                <select class="form-select ferramentas">

                    <option>Sim</option>
                    <option>Não</option>

                </select>

            </div>

            <div class="col-md-4">

                <label class="form-label">
                    Adaptador de Engate
                </label>

                <select class="form-select adaptador">

                    <option>Sim</option>
                    <option>Não</option>

                </select>

            </div>

        </div>

        <div class="row mt-2">

            <div class="col-md-4">

                <label class="form-label">
                    Níveis
                </label>

                <select class="form-select niveis">

                    <option>Sim</option>
                    <option>Não</option>

                </select>

            </div>

        </div>

        <hr>

        <label class="form-label">

            <strong>Observações Gerais</strong>

        </label>

        <textarea
            class="form-control observacoesGerais"
            rows="5"
            placeholder="Digite as observações da locomotiva..."></textarea>

    </div>

</div>

`);

}
