//=====================================
// PDF
//=====================================

async function gerarPDF(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({

        orientation:"portrait",

        unit:"mm",

        format:"a4"

    });

    const chave = obterChave();

    const relatorio = banco[chave];

    if(!relatorio){

        alert("Nenhum relatório encontrado.");

        return;

    }

    let y = 15;

    doc.setFont("helvetica","bold");

    doc.setFontSize(18);

    doc.text("LOGÍSTICA DA TRAÇÃO",105,y,{align:"center"});

    y += 10;

    doc.setFontSize(10);

    doc.setFont("helvetica","normal");

    doc.text(`Data: ${relatorio.data}`,15,y);

    doc.text(`Local: ${relatorio.local}`,70,y);

    doc.text(`Turno: ${relatorio.turno}`,120,y);

    y += 6;

    doc.text(`Escalante: ${relatorio.usuario}`,15,y);

    doc.text(`Matrícula: ${relatorio.matricula}`,120,y);

    y += 12;

    gerarChecklist(doc,relatorio,y);

}
function gerarChecklist(doc,relatorio,y){

doc.setFontSize(13);

doc.setFont("helvetica","bold");

doc.text("CHECK LIST",15,y);

y+=5;

doc.autoTable({

startY:y,

theme:"grid",

head:[["Campo","Valor"]],

body:[

["Operadores",relatorio.checklist.operadores||0],

["Ausências",relatorio.checklist.ausencias||0],

["Frota Equipada",relatorio.checklist.frota||0],

["Viras",relatorio.checklist.viras||0],

["Escala",relatorio.checklist.escala||0],

["Locomotivas",relatorio.checklist.locomotiva||0],

["Gestão",relatorio.checklist.gestao||0]

]

});

gerarFatos(

doc,

relatorio,

doc.lastAutoTable.finalY+10

);

}
function gerarFatos(doc,relatorio,y){

doc.setFontSize(13);

doc.setFont("helvetica","bold");

doc.text("FATOS RELEVANTES",15,y);

y+=5;

const fatos=[];

relatorio.fatos.forEach(f=>{

fatos.push([

f.hora,

f.local,

f.descricao

]);

});

if(fatos.length===0){

fatos.push(["-","-","Nenhum registro"]);

}

doc.autoTable({

startY:y,

theme:"grid",

head:[["Hora","Local","Descrição"]],

body:fatos

});

gerarLocomotivas(

doc,

relatorio,

doc.lastAutoTable.finalY+10

);

}
function gerarLocomotivas(doc,relatorio,y){

doc.setFontSize(13);

doc.setFont("helvetica","bold");

doc.text("LOCOMOTIVAS",15,y);

y+=5;

const linhas=[];

relatorio.locomotivas.forEach(l=>{

linhas.push([

l.prefixo,

l.situacao,

l.observacao

]);

});

if(linhas.length===0){

linhas.push(["-","-","Nenhum registro"]);

}

doc.autoTable({

startY:y,

theme:"grid",

head:[

["Prefixo","Situação","Observação"]

],

body:linhas

});

rodape(

doc,

relatorio

);

}
function rodape(doc,relatorio){

const paginas=doc.getNumberOfPages();

for(let i=1;i<=paginas;i++){

doc.setPage(i);

doc.setFontSize(8);

doc.text(

"Logística da Tração",

15,

290

);

doc.text(

"Emitido em "+

new Date().toLocaleString(),

105,

290,

{align:"center"}

);

doc.text(

"Página "+i+" / "+paginas,

195,

290,

{align:"right"}

);

}

doc.save(

"Relatorio_"+

relatorio.data+

".pdf"

);

}
