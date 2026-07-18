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
