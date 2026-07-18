const relatorio = {
    identificacao: {},
    checklist: {
        trensEquipados: [],
        gestao: {}
    },
    fatos: [],
    locomotivas: []
};

function atualizarChecklist() {

    const linhas = document.querySelectorAll("#tbodyChecklist tr");

    relatorio.checklist.trensEquipados = [];

    linhas.forEach((linha, indice) => {

        const local = linha.querySelector(".local").value;

        const operador = linha.querySelector(".operador").value.trim();

        if (local !== "" || operador !== "") {

            relatorio.checklist.trensEquipados.push({

                numero: indice + 1,

                local,

                operador

            });

        }

    });

    document.getElementById("frota").value =
        relatorio.checklist.trensEquipados.length;

    atualizarGestao();

}

function iniciarRelatorio() {

    relatorio.identificacao = {

        nome: document.getElementById("txtNome").value,

        matricula: document.getElementById("txtMatricula").value,

        posto: document.getElementById("txtPosto").value,

        local: document.getElementById("cmbLocal").value,

        turno: document.getElementById("cmbTurno").value,

        data: document.getElementById("txtData").value

    };

    document.getElementById("nomeOperador").textContent =
        relatorio.identificacao.nome;

    document.getElementById("matriculaOperador").textContent =
        relatorio.identificacao.matricula;

    document.getElementById("posto").textContent =
        relatorio.identificacao.posto;

    document.getElementById("local").textContent =
        relatorio.identificacao.local;

    document.getElementById("turno").textContent =
        relatorio.identificacao.turno;

    document.getElementById("data").textContent =
        relatorio.identificacao.data;

    document.querySelectorAll(".menu-item").forEach(botao => {

        if (botao.dataset.view !== "identificacao")
            botao.disabled = false;

    });

    carregarView("checklist");

}
function initIdentificacao() {

    document
        .getElementById("btnIniciar")
        .addEventListener("click", iniciarRelatorio);

}
async function carregarView(nome) {

    const resposta = await fetch(`views/${nome}.html`);

    const html = await resposta.text();

    document.getElementById("conteudo").innerHTML = html;

}

document.querySelectorAll(".menu-item").forEach(botao => {

    botao.addEventListener("click", () => {

        if (botao.disabled)
            return;

        document
            .querySelectorAll(".menu-item")
            .forEach(item => item.classList.remove("active"));

        botao.classList.add("active");

        carregarView(botao.dataset.view);

    });

});
function atualizarChecklist() {

    const linhas = document.querySelectorAll("#tbodyChecklist tr");

    relatorio.checklist.trensEquipados = [];

    linhas.forEach((linha, indice) => {

        const local = linha.querySelector(".local").value;

        const operador = linha.querySelector(".operador").value.trim();

        if (local !== "" || operador !== "") {

            relatorio.checklist.trensEquipados.push({

                numero: indice + 1,

                local,

                operador

            });

        }

    });

    document.getElementById("frota").value =
        relatorio.checklist.trensEquipados.length;

    atualizarGestao();

}

function atualizarGestao() {

    const controle =
        Number(document.getElementById("controle").value);

    const frota =
        Number(document.getElementById("frota").value);

    const ausencias =
        Number(document.getElementById("ausencias").value);

    const viras =
        Number(document.getElementById("viras").value);

    const postoEscala =
        Number(document.getElementById("postoEscala").value);

    const outros =
        Number(document.getElementById("outros").value);

    const total =
        controle -
        frota -
        ausencias -
        viras -
        postoEscala -
        outros;

    document.getElementById("totalGestao").value = total;

    relatorio.checklist.gestao = {

        controleApresentacao: controle,

        frotaEquipada: frota,

        ausencias,

        viras,

        postoEscala,

        outros,

        totalGestao: total

    };

    localStorage.setItem(
        "relatorioAtual",
        JSON.stringify(relatorio)
    );

}

function initChecklist() {

    const tbody = document.getElementById("tbodyChecklist");

    tbody.innerHTML = "";

    for (let i = 1; i <= 35; i++) {

        tbody.innerHTML += `
            <tr>

                <td>${i}</td>

                <td>

                    <select class="form-select form-select-sm local">

                        <option value=""></option>

                        <option>BAS</option>

                        <option>SUZ</option>

                    </select>

                </td>

                <td>

                    <input
                        class="form-control form-control-sm operador"
                        type="text">

                </td>

            </tr>
        `;

    }

    document
        .querySelectorAll(".local,.operador")
        .forEach(campo => {

            campo.addEventListener("input", atualizarChecklist);

            campo.addEventListener("change", atualizarChecklist);

        });

    document
        .querySelectorAll("#controle,#ausencias,#viras,#postoEscala,#outros")
        .forEach(campo => {

            campo.addEventListener("input", atualizarGestao);

        });

    atualizarChecklist();

}

function initFatos() {

}

function initLocomotivas() {

}

function initHistorico() {

}

carregarView("identificacao");
