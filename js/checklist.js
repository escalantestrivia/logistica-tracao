// ================================
// CHECK LIST
// ================================

function montarChecklist() {

    document.getElementById("checklist").innerHTML = `

<div class="card">

<div class="card-header bg-primary text-white">

CHECK LIST OPERACIONAL

</div>

<div class="card-body">

<div class="row g-3">

<div class="col-md">

<label class="form-label">

Operadores de Trem

</label>

<input
id="operadores"
type="number"
class="form-control calc"
value="0">

</div>

<div class="col-md">

<label class="form-label">

Ausências

</label>

<input
id="ausencias"
type="number"
class="form-control calc"
value="0">

</div>

<div class="col-md">

<label class="form-label">

Frota Equipada

</label>

<input
id="frota"
type="number"
class="form-control calc"
value="0">

</div>

<div class="col-md">

<label class="form-label">

Viras

</label>

<input
id="viras"
type="number"
class="form-control calc"
value="0">

</div>

<div class="col-md">

<label class="form-label">

Escala

</label>

<input
id="escala"
type="number"
class="form-control calc"
value="0">

</div>

<div class="col-md">

<label class="form-label">

Locomotiva

</label>

<input
id="locomotiva"
type="number"
class="form-control calc"
value="0">

</div>

<div class="col-md">

<label class="form-label">

Gestão

</label>

<input
id="gestao"
readonly
class="form-control fw-bold text-center">

</div>

</div>

<hr>

<div class="row mt-3">

<div class="col-md-12">

<label class="form-label">

Observações

</label>

<textarea
id="observacoes"
class="form-control"
rows="4"></textarea>

</div>

</div>

</div>

</div>

`;

    document.querySelectorAll(".calc").forEach(campo => {

        campo.addEventListener("input", () => {

            calcularGestao();

            salvarChecklist();

        });

    });

    document.getElementById("observacoes")
        .addEventListener("input", salvarChecklist);

    carregarChecklist();

}


function calcularGestao(){

    const operadores =
        Number(document.getElementById("operadores").value)||0;

    const ausencias =
        Number(document.getElementById("ausencias").value)||0;

    const frota =
        Number(document.getElementById("frota").value)||0;

    const viras =
        Number(document.getElementById("viras").value)||0;

    const escala =
        Number(document.getElementById("escala").value)||0;

    const locomotiva =
        Number(document.getElementById("locomotiva").value)||0;

    document.getElementById("gestao").value =
        operadores -
        ausencias -
        frota -
        viras -
        escala -
        locomotiva;

}

function salvarChecklist(){

    const chave = obterChave();

    if(!banco[chave]) return;

    banco[chave].checklist = {

        operadores:document.getElementById("operadores").value,

        ausencias:document.getElementById("ausencias").value,

        frota:document.getElementById("frota").value,

        viras:document.getElementById("viras").value,

        escala:document.getElementById("escala").value,

        locomotiva:document.getElementById("locomotiva").value,

        gestao:document.getElementById("gestao").value,

        observacoes:document.getElementById("observacoes").value

    };

    salvarBanco();

}

function carregarChecklist(){

    montarChecklist();

    const chave = obterChave();

    if(!banco[chave]) return;

    const c = banco[chave].checklist;

    document.getElementById("operadores").value = c.operadores || 0;

    document.getElementById("ausencias").value = c.ausencias || 0;

    document.getElementById("frota").value = c.frota || 0;

    document.getElementById("viras").value = c.viras || 0;

    document.getElementById("escala").value = c.escala || 0;

    document.getElementById("locomotiva").value = c.locomotiva || 0;

    document.getElementById("observacoes").value =
        c.observacoes || "";

    calcularGestao();

}
