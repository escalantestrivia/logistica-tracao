function login() {

    const matricula = document.getElementById("matricula").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const local = document.getElementById("local").value;
    const turno = document.getElementById("turno").value;

    const usuario = usuarios.find(u =>
        u.matricula === matricula &&
        u.senha === senha
    );

    if (!usuario) {

        alert("Matrícula ou senha inválida.");

        return;

    }

    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

    localStorage.setItem("local", local);

    localStorage.setItem("turno", turno);

    window.location.href = "index.html";

}

function verificarLogin() {

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario) {

        window.location.href = "login.html";

        return;

    }

    const campoUsuario = document.getElementById("usuarioLogado");

    if (campoUsuario) {

        campoUsuario.innerHTML =
            usuario.nome + " | " + usuario.matricula;

    }

    const campoEscalante = document.getElementById("escalante");

    if (campoEscalante) {

        campoEscalante.value = usuario.nome;

    }

    const campoLocal = document.getElementById("local");

    if (campoLocal) {

        campoLocal.value = localStorage.getItem("local");

    }

    const campoTurno = document.getElementById("turno");

    if (campoTurno) {

        campoTurno.value = localStorage.getItem("turno");

    }

}

function sair() {

    localStorage.removeItem("usuarioLogado");

    localStorage.removeItem("local");

    localStorage.removeItem("turno");

    window.location.href = "login.html";

}
