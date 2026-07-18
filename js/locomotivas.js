//==============================
// LOCOMOTIVAS
//==============================

let locomotivaEditando = null;

function montarLocomotivas(){

document.getElementById("locomotivas").innerHTML=`

<div class="card">

<div class="card-header bg-primary text-white d-flex justify-content-between">

<span>LOCOMOTIVAS</span>

<button class="btn btn-light btn-sm" onclick="novaLocomotiva()">

Nova Locomotiva

</button>

</div>

<div class="card-body">

<table class="table table-bordered table-hover">

<thead>

<tr>

<th width="120">Prefixo</th>

<th width="200">Situação</th>

<th>Observação</th>

<th width="120">Ações</th>

</tr>

</thead>

<tbody id="tbLocomotivas">

</tbody>

</table>

</div>

</div>

`;

renderLocomotivas();

}
function renderLocomotivas(){

const chave=obterChave();

const tbody=document.getElementById("tbLocomotivas");

if(!tbody)return;

tbody.innerHTML="";

if(!banco[chave])return;

banco[chave].locomotivas.forEach((l,i)=>{

tbody.innerHTML+=`

<tr>

<td>${l.prefixo}</td>

<td>${l.situacao}</td>

<td>${l.observacao}</td>

<td>

<button class="btn btn-warning btn-sm"

onclick="editarLocomotiva(${i})">

✏

</button>

<button class="btn btn-danger btn-sm"

onclick="excluirLocomotiva(${i})">

🗑

</button>

</td>

</tr>

`;

});

}
function novaLocomotiva(){

locomotivaEditando=null;

document.getElementById("prefixoLoc").value="";

document.getElementById("situacaoLoc").value="Operante";

document.getElementById("obsLoc").value="";

modalLocomotiva.show();

}
function salvarLocomotiva(){

const chave=obterChave();

const loco={

prefixo:document.getElementById("prefixoLoc").value,

situacao:document.getElementById("situacaoLoc").value,

observacao:document.getElementById("obsLoc").value

};

if(locomotivaEditando==null){

banco[chave].locomotivas.push(loco);

}else{

banco[chave].locomotivas[locomotivaEditando]=loco;

}

atualizarAlteracao();

modalLocomotiva.hide();

renderLocomotivas();

}

function editarLocomotiva(i){

const chave=obterChave();

locomotivaEditando=i;

const l=banco[chave].locomotivas[i];

document.getElementById("prefixoLoc").value=l.prefixo;

document.getElementById("situacaoLoc").value=l.situacao;

document.getElementById("obsLoc").value=l.observacao;

modalLocomotiva.show();

}

function excluirLocomotiva(i){

if(!confirm("Excluir locomotiva?"))return;

const chave=obterChave();

banco[chave].locomotivas.splice(i,1);

atualizarAlteracao();

renderLocomotivas();

}
