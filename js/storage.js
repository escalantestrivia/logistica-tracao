// ==============================
// STORAGE
// ==============================

const STORAGE_KEY = "LOGISTICA_TRACAO";

function carregarBanco() {

    const dados = localStorage.getItem(STORAGE_KEY);

    if (dados) {

        banco = JSON.parse(dados);

    } else {

        banco = {};

    }

}

function salvarBanco() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(banco)

    );

}

function limparBanco() {

    if (!confirm("Apagar todos os relatórios?")) return;

    banco = {};

    salvarBanco();

    location.reload();

}

function exportarBackup() {

    const blob = new Blob(

        [

            JSON.stringify(

                banco,

                null,

                4

            )

        ],

        {

            type: "application/json"

        }

    );

    const link = document.createElement("a");

    const hoje = new Date();

    const nome =

        "BACKUP_LOGISTICA_" +

        hoje.getFullYear() +

        String(hoje.getMonth() + 1).padStart(2, "0") +

        String(hoje.getDate()).padStart(2, "0") +

        ".json";

    link.href = URL.createObjectURL(blob);

    link.download = nome;

    link.click();

    URL.revokeObjectURL(link.href);

}

function importarBackup(arquivo) {

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function (e) {

        try {

            banco = JSON.parse(e.target.result);

            salvarBanco();

            alert("Backup importado com sucesso.");

            carregarDia();

        }

        catch {

            alert("Arquivo inválido.");

        }

    };

    leitor.readAsText(arquivo);

}

function existeRelatorio(chave) {

    return banco.hasOwnProperty(chave);

}

function excluirRelatorio(chave) {

    if (!confirm("Excluir este relatório?")) return;

    delete banco[chave];

    salvarBanco();

    carregarDia();

}

function listarRelatorios() {

    return Object.keys(banco).sort().reverse();

}

function atualizarAlteracao() {

    const chave = obterChave();

    if (!banco[chave]) return;

    banco[chave].ultimaAlteracao = new Date().toISOString();

    salvarBanco();

}
