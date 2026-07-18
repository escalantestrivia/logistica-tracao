//=====================================
// HISTÓRICO
//=====================================

function montarHistorico(){

document.getElementById("historico").innerHTML=`

<div class="card">

<div class="card-header bg-primary text-white">

Histórico de Relatórios

</div>

<div class="card-body">

<div class="row mb-3">

<div class="col-md-4">

<input
id="pesquisaHistorico"
class="form-control"
placeholder="Pesquisar..."
onkeyup="renderHistorico()">

</div>

</div>

<table class="table table-striped table-hover">

<thead>

<tr>

<th>Data</th>

<th>Local</th>

<th>Turno</th>

<th>Escalante</th>

<th width="220">Ações</th>

</tr>

</thead>

<tbody id="tbHistorico">

</tbody>

</table>

</div>

</div>

`;

renderHistorico();

}
function renderHistorico(){

const tbody=document.getElementById("tbHistorico");

if(!tbody)return;

tbody.innerHTML="";

const pesquisa=document
.getElementById("pesquisaHistorico")
.value
.toLowerCase();

Object.keys(banco)

.sort()

.reverse()

.forEach(chave=>{

const partes=chave.split("_");

const data=partes[0];

const local=partes[1];

const turno=partes[2];

const usuario=banco[chave].usuario || "";

const texto=(

data+

local+

turno+

usuario

).toLowerCase();

if(!texto.includes(pesquisa))return;

tbody.innerHTML+=`

<tr>

<td>${data}</td>

<td>${local}</td>

<td>${turno}</td>

<td>${usuario}</td>

<td>

<button
class="btn btn-primary btn-sm"
onclick="abrirHistorico('${chave}')">

Abrir

</button>

<button
class="btn btn-danger btn-sm"
onclick="excluirHistorico('${chave}')">

Excluir

</button>

</td>

</tr>

`;

});

}
function abrirHistorico(chave){

const partes=chave.split("_");

document.getElementById("data").value=partes[0];

document.getElementById("local").value=partes[1];

document.getElementById("turno").value=partes[2];

carregarDia();

abrir("checklist");

}
function excluirHistorico(chave){

if(!confirm("Excluir este relatório?"))return;

delete banco[chave];

salvarBanco();

renderHistorico();

}
