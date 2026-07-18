const relatorio = {
    identificacao: {},
    checklist: {
        trensEquipados: [],
        gestao: {}
    },
    fatos: [],
    locomotivas: []
};
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

carregarView("identificacao");
