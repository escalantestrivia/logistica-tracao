//=====================================
// RÁDIOS
//=====================================

let baseRadios = JSON.parse(localStorage.getItem("BASE_RADIOS")) || [];

let radioEditando = null;

function montarRadios(){

document.getElementById("radios").innerHTML=`

<div class="card">

<div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">

<span>RÁDIOS</span>

<div>

<input
type="file"
id="arquivoExcel"
accept=".xlsx,.xls,.csv"
style="display:none"
onchange="importarBaseRadios(event)">

<button
class="btn btn-light btn-sm"
onclick="document.getElementById('arquivoExcel').click()">

Importar Excel

</button>

<button
class="btn btn-success btn-sm"
onclick="novoRadio()">

Novo Registro

</button>

</div>

</div>

<div class="card-body">

<div class="mb-3">

<input
id="pesquisaRadio"
class="form-control"
placeholder="Pesquisar por Número, OPT, Modelo ou Local"
onkeyup="renderRadios()">

</div>

<table class="table table-bordered table-hover">

<thead>

<tr>

<th>Número</th>

<th>OPT</th>

<th>Modelo</th>

<th>Local</th>

<th>Status</th>

<th>Ações</th>

</tr>

</thead>

<tbody id="tbRadios">

</tbody>

</table>

</div>

</div>

`;

renderRadios();

}
function importarBaseRadios(event){

const arquivo=event.target.files[0];

if(!arquivo)return;

const reader=new FileReader();

reader.onload=function(e){

const dados=new Uint8Array(e.target.result);

const workbook=XLSX.read(dados,{type:"array"});

const planilha=workbook.Sheets[workbook.SheetNames[0]];

baseRadios=XLSX.utils.sheet_to_json(planilha);

localStorage.setItem(

"BASE_RADIOS",

JSON.stringify(baseRadios)

);

alert(

baseRadios.length+

" rádios importados."

);

renderRadios();

};

reader.readAsArrayBuffer(arquivo);

}
function renderRadios(){

const tbody=document.getElementById("tbRadios");

if(!tbody)return;

tbody.innerHTML="";

const pesquisa=document
.getElementById("pesquisaRadio")
.value
.toLowerCase();

baseRadios

.filter(r=>{

return(

String(r["Número"]||"").toLowerCase().includes(pesquisa)

||

String(r["OPT"]||"").toLowerCase().includes(pesquisa)

||

String(r["Modelo"]||"").toLowerCase().includes(pesquisa)

||

String(r["Local"]||"").toLowerCase().includes(pesquisa)

);

})

.forEach((r,i)=>{

tbody.innerHTML+=`

<tr>

<td>${r["Número"]}</td>

<td>${r["OPT"]}</td>

<td>${r["Modelo"]}</td>

<td>${r["Local"]}</td>

<td>-</td>

<td>

<button
class="btn btn-primary btn-sm"
onclick="novoRadio(${i})">

Selecionar

</button>

</td>

</tr>

`;

});

}
function novoRadio(indice=null){

if(baseRadios.length===0){

alert("Importe primeiro a planilha de rádios.");

return;

}

const radio=indice!==null?baseRadios[indice]:null;

abrirModalRadio(radio);

}
