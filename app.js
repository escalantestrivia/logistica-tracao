// ================================
// LOGÍSTICA DA TRAÇÃO
// app.js
// ================================

if (!localStorage.getItem("usuario")) {
    window.location.href = "login.html";
}
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
 [
    "menuChecklist",
    "menuFatos",
    "menuLocomotivas",
    "menuHistorico",
    "menuQuilometragem"
].forEach(id => {

    const menu = document.getElementById(id);

    if (menu) {
        menu.classList.add("bloqueado");
    }

});

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
    //alert("calcularTotalGestao executou");
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

    if (!relatorioIniciado && tela !== "identificacao") {
        mostrarModalRelatorio();
        return;
    }

    if (tela === "quilometragem") {
        carregarQuilometragem();
    }

    const telas = [
        "identificacao",
        "checklist",
        "fatos",
        "locomotivas",
        "quilometragem",
        "historico"
    ];

    telas.forEach(id => {

        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.style.display = (id === tela)
                ? "block"
                : "none";
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
        quilometragem: "menuQuilometragem",
        historico: "menuHistorico"
    };

    const botao = document.getElementById(botoes[tela]);

    if (botao) {
        botao.classList.add("active");
    }

    localStorage.setItem("ultimaTela", tela);

}


// ===================================
// Deslogar
// ===================================

function deslogar() {

    if (!confirm("Deseja realmente sair do sistema?")) {
        return;
    }

    localStorage.removeItem("usuario");

    window.location.href = "login.html";

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
    identificacao: {
        escalante: usuario.nome,
        matricula: usuario.matricula,
        local: posto,
        turno: turno,
        data: data
    },
    checklist: {},
    frota: [],
    ocorrencias: [],
    locomotivas: []
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

function salvarFrota() {

    const relatorio = JSON.parse(localStorage.getItem("relatorio"));

    if (!relatorio) return;

    relatorio.frota = [];

    document.querySelectorAll("#tbodyTrens tr").forEach(tr => {

        const inputs = tr.querySelectorAll("input");

        const qtde = tr.cells[0].textContent.trim();
        const trem = inputs[0].value.trim();
        const local = inputs[1].value.trim();
        const operador = inputs[2].value.trim();

        if (trem || local || operador) {

            relatorio.frota.push({
                qtde,
                trem,
                local,
                operador
            });

        }

    });

    localStorage.setItem("relatorio", JSON.stringify(relatorio));


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

        totalGestao: parseInt(document.getElementById("totalGestao").textContent, 10) || 0,

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

    const relatorio = JSON.parse(localStorage.getItem("relatorio"));

    if (!relatorio) {
        alert("Nenhum relatório foi iniciado.");
        return;
    }

    relatorio.ocorrencias = [];

    const locais = document.querySelectorAll(".localOcorrencia");
    const descricoes = document.querySelectorAll(".descricaoOcorrencia");

    for (let i = 0; i < locais.length; i++) {

        const local = locais[i].value.trim();
        const descricao = descricoes[i].value.trim();

        // Salva apenas ocorrências preenchidas
        if (local !== "" || descricao !== "") {

            relatorio.ocorrencias.push({
                local: local,
                descricao: descricao
            });

        }

    }

    localStorage.setItem("relatorio", JSON.stringify(relatorio));

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

            observacoesGerais: card.querySelector(".observacoesGerais").value

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

<div class="card shadow-sm mt-3">

    <div class="card-header bg-primary text-white">
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

        <div class="row g-3 align-items-end">

            <div class="col-md-3">
                <label class="form-label">Atendendo APT</label>
                <select class="form-select atendeSA" onchange="toggleSA(this)">
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                </select>
            </div>

            <div class="col-md-4 campoSA" style="display:none;">
                <label class="form-label">Número da APT</label>
                <input
                    type="text"
                    class="form-control numeroSA"
                    placeholder="Informe o número da SA">
            </div>

        </div>

        <hr>

        <div class="row g-3">

            <div class="col-md-3">
                <label class="form-label">Local</label>
                <input type="text" class="form-control local">
            </div>

            <div class="col-md-3">
                <label class="form-label">KM</label>
                <input type="number" class="form-control km">
            </div>

            <div class="col-md-3">
                <label class="form-label">Diesel</label>
                <input type="number" class="form-control diesel">
            </div>

            <div class="col-md-3">
                <label class="form-label">Horímetro</label>
                <input type="number" class="form-control horimetro">
            </div>

        </div>

        <hr>

        <div class="row g-3">

            <div class="col-md-3">
                <label class="form-label">Calços</label>
                <select class="form-select calcos">
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                </select>
            </div>

            <div class="col-md-3">
                <label class="form-label">Talha</label>
                <select class="form-select talha">
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                </select>
            </div>

            <div class="col-md-3">
                <label class="form-label">Kit SOS</label>
                <select class="form-select kitSOS">
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                </select>
            </div>

            <div class="col-md-3">
                <label class="form-label">Mangueiras / Mangotes</label>
                <select class="form-select mangotes">
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                </select>
            </div>

        </div>

        <div class="row g-3 mt-1">

            <div class="col-md-3">
                <label class="form-label">Chaves de Mangueira</label>
                <select class="form-select chaves">
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                </select>
            </div>

            <div class="col-md-3">
                <label class="form-label">Ferramentas</label>
                <select class="form-select ferramentas">
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                </select>
            </div>

            <div class="col-md-3">
                <label class="form-label">Adaptador de Engate</label>
                <select class="form-select adaptador">
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                </select>
            </div>

            <div class="col-md-3">
                <label class="form-label">Níveis</label>
                <select class="form-select niveis">
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                </select>
            </div>

        </div>

        <hr>

        <label class="form-label">
            <strong>Observações Gerais</strong>
        </label>

        <textarea
            class="form-control observacoesGerais"
            rows="4"
            placeholder="Digite as observações..."></textarea>

    </div>

</div>

`);

}

async function gerarPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const relatorio =
        JSON.parse(localStorage.getItem("relatorio")) || {};

    const largura = doc.internal.pageSize.getWidth();

    const data = new Date();

    const dataAtual = data.toLocaleDateString("pt-BR");
    const horaAtual = data.toLocaleTimeString("pt-BR");

    //==========================
    // CABEÇALHO
    //==========================

    doc.setFillColor(13,110,253);
    doc.rect(0,0,210,22,"F");

    doc.setTextColor(255,255,255);
    doc.setFont("helvetica","bold");
    doc.setFontSize(18);

    doc.text(
        "RELATÓRIO ESCALA - TRIVIA",
        largura/2,
        14,
        {align:"center"}
    );

    doc.setTextColor(0,0,0);

    let y = 32;

    doc.setFontSize(10);

    doc.text(
        `Emitido em: ${dataAtual} às ${horaAtual}`,
        14,
        y
    );

//==========================
// IDENTIFICAÇÃO
//==========================

y += 10;

const identificacao = relatorio.identificacao || {};

doc.setFontSize(14);
doc.setFont("helvetica","bold");
doc.text("IDENTIFICAÇÃO",14,y);

y += 5;

doc.autoTable({

    startY: y,

    theme: "grid",

    head: [["Campo","Informação"]],

    body: [

        ["Escalante", identificacao.escalante || ""],

        ["Matrícula", identificacao.matricula || ""],

        ["Local", identificacao.local || ""],

        ["Turno", identificacao.turno || ""],

        ["Data", identificacao.data.split("-").reverse().join("-")]

    ],

    styles:{
        fontSize:10
    },

    headStyles:{
        fillColor:[13,110,253]
    }

});

y = doc.lastAutoTable.finalY + 10;

//==========================
// GESTÃO DE OPERADORES
//==========================
//doc.addPage();
//y = 20;
doc.setFont("helvetica","bold");
doc.setFontSize(14);
doc.text("GESTÃO DE OPERADORES", 14, y);

y += 5;

const checklist = relatorio.checklist || {};

doc.autoTable({

    startY: y,

    theme: "grid",

    head: [["Item", "Quantidade"]],

    body: [

        ["Controle de Apresentação", checklist.controleApresentacao || 0],

        ["Frota Equipada", checklist.frotaEquipada || 0],

        ["Ausências", checklist.ausencias || 0],

        ["Viras", checklist.viras || 0],

        ["Posto Escala", checklist.postoEscala || 0],

        ["Outros", checklist.outros || 0],

        ["Total Gestão", checklist.totalGestao || 0]

    ],

    styles:{
        fontSize:10
    },

    headStyles:{
        fillColor:[13,110,253]
    }

});

y = doc.lastAutoTable.finalY + 5;

//obsercações após frota equipada
doc.addPage();
y = 20;
doc.setFont("helvetica","bold");
doc.setFontSize(11);
doc.text("Observações:", 14, y);

y += 5;

doc.setFont("helvetica","normal");

const obsFrota = doc.splitTextToSize(
    relatorio.checklist?.observacoes || "Sem observações.",
    180
);

doc.text(obsFrota, 14, y);

y += (obsFrota.length * 5) + 8;

//==========================
// FROTA EQUIPADA
//==========================
doc.addPage();
y = 20;
doc.setFont("helvetica","bold");
doc.setFontSize(14);
doc.text("FROTA EQUIPADA",14,y);

y += 5;

if(relatorio.frota && relatorio.frota.length){

    doc.autoTable({

        startY:y,

        theme:"striped",

        head:[[
            "Qtde",
            "TUE",
            "Local",
            "Operador(a)"
        ]],

        body: relatorio.frota.map(item=>[
            item.qtde,
            item.trem,
            item.local,
            item.operador
        ]),

        headStyles:{
            fillColor:[13,110,253]
        },

        styles:{
            fontSize:10
        }

    });

    y = doc.lastAutoTable.finalY + 5;


}else{

    doc.setFontSize(10);
    doc.text("Nenhuma frota cadastrada.",14,y);

    y += 10;

}

//==========================
// FATOS RELEVANTES
//==========================
doc.addPage();
y = 20;
doc.setFont("helvetica","bold");
doc.setFontSize(14);
doc.text("FATOS RELEVANTES",14,y);

y += 8;

if (relatorio.ocorrencias && relatorio.ocorrencias.length) {

    relatorio.ocorrencias.forEach((ocorrencia, index) => {

        const texto = doc.splitTextToSize(
            ocorrencia.descricao || "Sem descrição.",
            170
        );

        const alturaCaixa = Math.max(
            28,
            (texto.length * 5) + 20
        );

        if (y + alturaCaixa > 270) {
            doc.addPage();
            y = 20;
        }

        doc.setDrawColor(180);

        doc.roundedRect(
            12,
            y - 4,
            186,
            alturaCaixa,
            2,
            2
        );

        doc.setFontSize(11);
        doc.setFont("helvetica","bold");
        doc.text("Ocorrência " + (index + 1), 16, y + 2);

        doc.setFont("helvetica","normal");
        doc.text("Local: " + (ocorrencia.local || "-"), 16, y + 9);

        doc.text(texto, 16, y + 16);

        y += alturaCaixa + 8;

    });

} else {

    doc.setFontSize(10);
    doc.text("Nenhuma ocorrência registrada.",14,y);

    y += 10;

}
//==========================
// LOCOMOTIVAS
//==========================

// Verifica se há espaço para iniciar a seção
if (y > 250) {
    doc.addPage();
    y = 20;
}
doc.addPage();
y = 20;
doc.setFont("helvetica","bold");
doc.setFontSize(14);
doc.text("LOCOMOTIVAS", 14, y);

y += 8;

if (relatorio.locomotivas && relatorio.locomotivas.length) {

    relatorio.locomotivas.forEach((loc, index) => {

// Altura aproximada de uma ficha completa
const alturaFicha = 95;

if (y + alturaFicha > 270) {
    doc.addPage();
    y = 20;
}

        // Moldura
        doc.setDrawColor(120);
        doc.roundedRect(12, y - 4, 186, 78, 2, 2);

        doc.setFillColor(13,110,253);
        doc.rect(12, y - 4, 186, 8, "F");

        doc.setTextColor(255,255,255);
        doc.setFont("helvetica","bold");
        doc.setFontSize(12);

        doc.text(`LOCOMOTIVA ${index + 1}`, 16, y + 1);

        doc.setTextColor(0,0,0);
        doc.setFont("helvetica","normal");
        doc.setFontSize(10);

        let yy = y + 10;

        doc.text(`Trem: ${loc.trem || ""}`,16,yy);
        doc.text(`Local: ${loc.local || ""}`,110,yy);

        yy += 6;

        doc.text(`Operador 1: ${loc.operador1 || ""}`,16,yy);

        yy += 6;

        doc.text(`Operador 2: ${loc.operador2 || ""}`,16,yy);

        yy += 6;

        doc.text(`Atendendo SA: ${loc.atendeSA || ""}`,16,yy);

        if(loc.atendeSA==="Sim"){
            doc.text(`Nº SA: ${loc.numeroSA || ""}`,110,yy);
        }

        yy += 6;

        doc.text(`KM: ${loc.km || ""}`,16,yy);
        doc.text(`Diesel: ${loc.diesel || ""}`,70,yy);
        doc.text(`Horímetro: ${loc.horimetro || ""}`,130,yy);

        yy += 8;

        doc.autoTable({

            startY: yy,

            theme: "grid",

            margin:{left:16,right:16},

            head:[[
                "Calços",
                "Talha",
                "Kit SOS",
                "Mangueiras",
                "Chaves",
                "Ferramentas",
                "Adaptador",
                "Níveis"
            ]],

            body:[[
                loc.calcos || "",
                loc.talha || "",
                loc.kitSOS || "",
                loc.mangotes || "",
                loc.chaves || "",
                loc.ferramentas || "",
                loc.adaptador || "",
                loc.niveis || ""
            ]],

            styles:{
                halign:"center",
                fontSize:8
            },

            headStyles:{
                fillColor:[13,110,253]
            }

        });

        yy = doc.lastAutoTable.finalY + 6;

        doc.setFont("helvetica","bold");
        doc.text("Observações Gerais",16,yy);

        yy += 5;

        doc.setFont("helvetica","normal");

        const obs = doc.splitTextToSize(
            loc.observacoesGerais || "Sem observações.",
            170
        );

        doc.text(obs,16,yy);

        y = yy + (obs.length * 5) + 15;

    });

}else{

    doc.setFontSize(10);
    doc.text("Nenhuma locomotiva cadastrada.",14,y);

    y += 10;

}

//==========================
// QUILOMETRAGEM DA FROTA
//==========================

doc.addPage();

y = 20;

doc.setFont("helvetica","bold");
doc.setFontSize(14);
doc.text("QUILOMETRAGEM DA FROTA",14,y);

y += 6;

const quilometragem = relatorio.quilometragem || [];

const dadosKm = quilometragem.filter(item =>
    item.km1 ||
    item.km2 ||
    item.observacao
);

if(dadosKm.length){

    doc.autoTable({

        startY:y,

        theme:"striped",

        head:[[
            "ID",
            "Trem",
            "Cab.1",
            "KM",
            "Cab.2",
            "KM",
            "Observações"
        ]],

        body:dadosKm.map(item=>[

            item.id,

            item.trem,

            item.cabine1,

            item.km1 || ""
                      ? Number(item.km1).toLocaleString("pt-BR")
                    : "",

            item.cabine2,

            item.km2 || ""
                     ? Number(item.km2).toLocaleString("pt-BR")
                    : "",

            item.observacao || ""

        ]),

        styles:{
            fontSize:8,
            cellPadding:2
        },

        headStyles:{
            fillColor:[13,110,253]
        },

        columnStyles:{

            0:{cellWidth:18},
            1:{cellWidth:30},
            2:{cellWidth:18},
            3:{cellWidth:18},
            4:{cellWidth:18},
            5:{cellWidth:18},
            6:{cellWidth:60}

        }

    });

}else{

    doc.setFontSize(10);

    doc.text(
        "Nenhuma quilometragem registrada.",
        14,
        y
    );

}
//==========================
// RODAPÉ
//==========================

const paginas = doc.getNumberOfPages();

for(let i=1;i<=paginas;i++){

    doc.setPage(i);

    doc.setDrawColor(180);
    doc.line(10,290,200,290);

    doc.setFontSize(9);

    doc.text(
        "Relatório de Escala - Trivia",
        14,
        295
    );

    doc.text(
        `Página ${i} de ${paginas}`,
        105,
        295,
        {align:"center"}
    );

    doc.text(
        dataAtual + " " + horaAtual,
        196,
        295,
        {align:"right"}
    );

}

// Data do relatório
const dataRelatorio =
    identificacao.data ||
    dataAtual;

// Formata a data para AAAA-MM-DD
const dataFormatada = dataRelatorio.split("-").reverse().join("-");

// Turno informado
const turno =
    (identificacao.turno || "Sem_Turno")
    .replace(/\s+/g, "_");

// Nome do arquivo
const nomeArquivo =
    `Relatorio Escala - ${dataFormatada} - ${turno}.pdf`;
        visualizarPDF(doc);
        doc.save(nomeArquivo);

}

function carregarQuilometragem() {

    const relatorio = JSON.parse(localStorage.getItem("relatorio"));

    if (!relatorio) return;

    const posto = relatorio.identificacao.local;

    const div = document.getElementById("conteudoQuilometragem");

    if (!div) return;

    div.innerHTML = "";
    habilitarColarQuilometragem();

    // Seleciona automaticamente a frota
    const frota = (posto === "SUZ") ? linha11 : linha12_13;

    let html = `

    <div class="row mb-3 align-items-center">

    <div class="col-md-6">

        <input
            type="text"
            id="pesquisaTrem"
            class="form-control"
            placeholder="Pesquisar por ID, Trem ou Cabine..."
            onkeyup="filtrarQuilometragem()">

    </div>

    <div class="col-md-6 text-end">

        <button
            class="btn btn-success me-2"
            onclick="salvarQuilometragem()">

            <i class="bi bi-save"></i>
            Salvar

        </button>

        <button
            class="btn btn-danger"
            onclick="limparQuilometragem()">

            <i class="bi bi-trash"></i>
            Limpar

        </button>

    </div>

    <div class="table-responsive">

        <table class="table table-bordered table-hover align-middle">

            <thead class="table-primary">

                <tr class="text-center">

                    <th>ID</th>
                    <th>Trem</th>
                    <th>Cabine 1</th>
                    <th style="width:120px">KM Cab. 1</th>
                    <th>Cabine 2</th>
                    <th style="width:120px">KM Cab. 2</th>
                    <th style="min-width:300px">Observações</th>

                </tr>

            </thead>

            <tbody>

    `;

    frota.forEach((trem, index) => {

        html += `

            <tr
                id="linhaKm_${index}"
                data-id="${trem.id}"
                data-trem="${trem.tue}"
                data-cab1="${trem.cabine1}"
                data-cab2="${trem.cabine2}">

                <td class="text-center fw-bold">

                    ${trem.id}

                </td>

                <td class="text-center">

                    ${trem.tue}

                </td>

                <td class="text-center">

                    ${trem.cabine1}

                </td>

                <td>

                    <input
                         type="text"
                        class="form-control"
                        id="km1_${index}"
                        inputmode="numeric"
                        oninput="formatarKM(this)">
                </td>

                <td class="text-center">

                    ${trem.cabine2}

                </td>

                <td>

                <input
                     type="text"
                    class="form-control"
                    id="km2_${index}"
                    inputmode="numeric"
                    oninput="formatarKM(this)">

                </td>

                <td>

                    <input
                        type="text"
                        class="form-control"
                        id="obs_${index}"
                        placeholder="Observações">

                </td>

            </tr>

        `;

    });

    html += `

            </tbody>

        </table>

    </div>

    `;
 
    div.innerHTML = html;

    habilitarColarQuilometragem();

    const dados = relatorio.quilometragem || [];

    frota.forEach((trem, index) => {

        if (dados[index]) {

            document.getElementById(`km1_${index}`).value =
                dados[index].km1 || "";

            document.getElementById(`km2_${index}`).value =
                dados[index].km2 || "";

            document.getElementById(`obs_${index}`).value =
                dados[index].observacao || "";

        }

    });

}

function filtrarQuilometragem() {

    const pesquisa = document
        .getElementById("pesquisaTrem")
        .value
        .toUpperCase()
        .trim();

    const relatorio = JSON.parse(localStorage.getItem("relatorio"));

    if (!relatorio) return;

    const frota =
        relatorio.identificacao.local === "SUZ"
            ? linha11
            : linha12_13;

    frota.forEach((trem, index) => {

        const linha = document.getElementById(`linhaKm_${index}`);

        if (!linha) return;

        const texto = (
            trem.id + " " +
            trem.tue + " " +
            trem.cabine1 + " " +
            trem.cabine2
        ).toUpperCase();

        linha.style.display = texto.includes(pesquisa) ? "" : "none";

    });

}

function salvarQuilometragem() {

    const relatorio = JSON.parse(localStorage.getItem("relatorio"));

    if (!relatorio) return;

    const frota =
        relatorio.identificacao.local === "SUZ"
            ? linha11
            : linha12_13;

    relatorio.quilometragem = [];

    frota.forEach((trem, index) => {

        relatorio.quilometragem.push({

            id: trem.id,
            trem: trem.tue,

            cabine1: trem.cabine1,
            km1: document.getElementById(`km1_${index}`).value.replace(/\./g, ""),

            cabine2: trem.cabine2,
            km2: document.getElementById(`km2_${index}`).value.replace(/\./g, ""),

            observacao: document.getElementById(`obs_${index}`)?.value || ""

        });

    });

    localStorage.setItem(
        "relatorio",
        JSON.stringify(relatorio)
    );

    alert("Quilometragem salva com sucesso.");

}

function habilitarColarQuilometragem() {

    const tabela = document.querySelector("#conteudoQuilometragem tbody");

    if (!tabela) return;

    const primeiroCampo = document.getElementById("km1_0");

    if (!primeiroCampo) return;

    primeiroCampo.onpaste = function (e) {

        e.preventDefault();

        const texto = (e.clipboardData || window.clipboardData).getData("text");

        const linhas = texto
            .replace(/\r/g, "")
            .split("\n")
            .filter(l => l.trim() !== "");

        linhas.forEach((linha, indice) => {

            const colunas = linha.split("\t");

const km1 = document.getElementById(`km1_${indice}`);
const km2 = document.getElementById(`km2_${indice}`);

if (km1)
    km1.value = colunas[0] ? colunas[0].trim() : "";

if (km2)
    km2.value = colunas[2] ? colunas[2].trim() : "";

        });

    };

}

function limparQuilometragem() {

    if (!confirm("Deseja limpar toda a quilometragem da frota?"))
        return;

    const relatorio = JSON.parse(localStorage.getItem("relatorio"));

    if (!relatorio) return;

    relatorio.quilometragem = [];

    localStorage.setItem("relatorio", JSON.stringify(relatorio));

    document.querySelectorAll("[id^='km1_']").forEach(campo => campo.value = "");
    document.querySelectorAll("[id^='km2_']").forEach(campo => campo.value = "");
    document.querySelectorAll("[id^='obs_']").forEach(campo => campo.value = "");

    alert("Quilometragem limpa com sucesso.");

}

function formatarKM(input) {

    let valor = input.value.replace(/\D/g, "");

    if (valor === "") {
        input.value = "";
        return;
    }

    input.value = Number(valor).toLocaleString("pt-BR");

}

//----------------------
// visualização do PDF
//----------------------
function visualizarPDF(doc) {

    window.open(doc.output("bloburl"), "_blank");

    setTimeout(() => {
        doc.save(nomeArquivo);
    }, 500);

}
