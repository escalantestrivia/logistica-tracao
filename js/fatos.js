//==============================
// FATOS RELEVANTES
//==============================

let fatoEditando = null;

function montarFatos(){

document.getElementById("fatos").innerHTML=`

<div class="card">

<div class="card-header bg-primary text-white d-flex justify-content-between">

<span>FATOS RELEVANTES</span>

<button class="btn btn-light btn-sm" onclick="novoFato()">

Novo Fato

</button>

</div>

<div class="card-body">

<table class="table table-bordered table-hover">

<thead>

<tr>

<th width="80">Hora</th>

<th width="180">Local</th>

<th>Descrição</th>

<th width="120">Ações</th>

</tr>

</thead>

<tbody id="tbFatos">

</tbody>

</table>

</div>

</div>

`;
renderFatos();

}
function renderFatos(){

const chave=obterChave();

const tbody=document.getElementById("tbFatos");

if(!tbody)return;

tbody.innerHTML="";

if(!banco[chave])return;

banco[chave].fatos.forEach((f,i)=>{

tbody.innerHTML+=`

<tr>

<td>${f.hora}</td>

<td>${f.local}</td>

<td>${f.descricao}</td>

<td>

<button class="btn btn-warning btn-sm"

onclick="editarFato(${i})">

✏

</button>

<button class="btn btn-danger btn-sm"

onclick="excluirFato(${i})">

🗑

</button>

</td>

</tr>

`;

});

}

function novoFato(){

fatoEditando=null;

document.getElementById("horaFato").value="";

document.getElementById("localFato").value="";

document.getElementById("descricaoFato").value="";

modalFato.show();

}

function salvarFato(){

const chave=obterChave();

if(!banco[chave])return;

const fato={

hora:document.getElementById("horaFato").value,

local:document.getElementById("localFato").value,

descricao:document.getElementById("descricaoFato").value

};

if(fatoEditando==null){

banco[chave].fatos.push(fato);

}else{

banco[chave].fatos[fatoEditando]=fato;

}

salvarBanco();

modalFato.hide();

renderFatos();

}

function editarFato(i){

const chave=obterChave();

fatoEditando=i;

const f=banco[chave].fatos[i];

document.getElementById("horaFato").value=f.hora;

document.getElementById("localFato").value=f.local;

document.getElementById("descricaoFato").value=f.descricao;

modalFato.show();

}

function excluirFato(i){

if(!confirm("Excluir fato?"))return;

const chave=obterChave();

banco[chave].fatos.splice(i,1);

salvarBanco();

renderFatos();

}
