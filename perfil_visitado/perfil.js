'use strict'

console.log(localStorage.getItem('NomeUsuarioTarefa'));
console.log(localStorage.getItem('IdUsuarioTarefa'));

const container_tarefas = document.getElementById('container_tarefas')
const nome = document.getElementById('nome')
const foto_perfil = document.getElementById('foto_perfil')

const casa = document.getElementById('casa')

casa.addEventListener('click', function(){

    window.location.href = '../menu/menu.html'
})

async function colocarNomeFoto() {

    const listUsers = await pegarUsuarios()

    nome.innerHTML = ''
    nome.innerHTML = `${localStorage.getItem('NomeUsuarioTarefa')}`

    listUsers.forEach(usuario => {

        if(usuario.id == localStorage.getItem('IdUsuarioTarefa')){
            
            
            foto_perfil.src = ''
            foto_perfil.src = usuario.foto
            localStorage.setItem('foto', usuario.foto)
 
        }  
    });
}

async function criarTarefas() {
    
    const listTasks = await pegarTarefas()

    listTasks.forEach(tarefa => {

        if(tarefa.idUsuario == localStorage.getItem('IdUsuarioTarefa')){

            console.log('aaaaaaaa');

            const espacamento_tarefa = document.createElement('div')
            espacamento_tarefa.classList.add('espacamento_tarefa')

        const container_tarefa = document.createElement('div')
        container_tarefa.classList.add('tarefa')

        const p_desc = document.createElement('p')
        p_desc.textContent = tarefa.descrição

        const mais = document.createElement('div')
        mais.classList.add('mais')

        const comentarios = document.createElement('img')
        comentarios.src = '../img/image 1.png'

        comentarios.addEventListener('click', function() {
            mostrarComentarios(tarefa.descrição, tarefa.id);
        });
        

        const p_data = document.createElement('p')
        p_data.textContent = tarefa.dataConclusão

        const linha_roxa = document.createElement('div')
        linha_roxa.classList.add('linha_roxa')

        mais.replaceChildren(comentarios, p_data)
        container_tarefa.replaceChildren(p_desc, mais)
        espacamento_tarefa.appendChild(container_tarefa)
        container_tarefas.appendChild(espacamento_tarefa)
        container_tarefas.appendChild(linha_roxa)

        }
    });
}

async function mostrarComentarios(descricao, idTarefa) {

    console.log('oiiiiiiiiiiii');

    const tarefaId = idTarefa
    const tarefa_descricao = descricao
    const fundo_transparente = document.getElementById('fundo_transparente')

    const qtd_comentarios = await contagemComentarios(tarefaId)

    fundo_transparente.classList.add('fundoPreto_transparente')

    fundo_transparente.innerHTML=''
    fundo_transparente.innerHTML=
    `
    <div class="comentarios">
            <div class="comentando">
                <div class="titulo">
                    <span id="sair">sair</span>
                    <img src="${localStorage.getItem('foto')}" alt="">
                    <h3>COMENTANDO</h3>
                </div>
                <div class="tarefa_comentando">
                    <p class="texto_comentando">${tarefa_descricao}</p>
                    <p>Qtd comentarios: ${qtd_comentarios}</p>
                </div>
                <div id = "comentar" class="botao_comentar">
                    COMENTAR
                </div>
            </div>
            <div id="container_comentarios" class="container_comentarios"></div>
        </div>
    `

    const comentar = document.getElementById('comentar')

    comentar.addEventListener('click', function(){

        telaComentar(tarefaId)
    })

    function telaComentar(idTarefa) {

        const tarefaId = idTarefa

        fundo_transparente.classList.add('fundoPreto_transparente')
        fundo_transparente.innerHTML = ''

        fundo_transparente.innerHTML = 
        `
        <div class="container_comentar">
            <img src="../img/logoPru 2.png" alt="">
            <textarea maxlength="120" id="comentario" cols="20" rows="5" placeholder="Digite seu comentário"></textarea>
            <div id="btn_comentar">Comentar</div>
        </div>
        `

        const botao_comentar = document.getElementById('btn_comentar')

        botao_comentar.addEventListener('click', async function(){

            alert('não é possivel enviar um comentario, pois o servidor não aceita o metodo post')
            fundo_transparente.innerHTML = ''
            fundo_transparente.classList.remove('fundoPreto_transparente')

            // const txtComentario = document.getElementById('comentario').value

            // const novoComentario = {}

            // const listTasks = await pegarTarefas()

            // if(txtComentario) {

            //     listTasks.forEach(task => {

            //         if(task.id == tarefaId) {

            //         }
            //     });
            // }
            // postarComentario(tarefaId, txtComentario)
        })
    }

    const sair = document.getElementById('sair')
    sair.addEventListener('click', function(){

        fundo_transparente.classList.remove('fundoPreto_transparente')
        fundo_transparente.innerHTML=''
    })

    validarComentarios(tarefaId, qtd_comentarios)
}

async function validarComentarios(idTarefa, qtd_comentarios) {

    if(qtd_comentarios == 0) {
        alert('não há comentários')
    } else {

        const tarefaId = idTarefa
        const container_comentarios = document.getElementById('container_comentarios')
    
        const listTasks = await pegarTarefas()
    
        listTasks.forEach(tasks => {
    
            if(tasks.id == tarefaId) {
    
                tasks.comentarios.forEach(async comentario => {
    
                    console.log(10);
    
                    const comentario_idUsuario = comentario.idUsuario
    
                    pegarFotoComentario(comentario_idUsuario)
    
                    const container_tarefa_comentando = document.createElement('div')
                    container_tarefa_comentando.classList.add('container_tarefa_comentando')
    
                    const foto_perfil_comentario = document.createElement('img')
                    foto_perfil_comentario.src = localStorage.getItem('foto_comentario')
    
                    const container_comentario = document.createElement('div')
                    container_comentario.classList.add('comentario')
    
                    const p_comentario = document.createElement('p')
                    p_comentario.textContent = comentario.comentario
    
                    const linha_roxa_comentando = document.createElement('div')
                    linha_roxa_comentando.classList.add('linha_roxa_comentando')
    
                    container_comentario.appendChild(p_comentario)
                    container_tarefa_comentando.replaceChildren(foto_perfil_comentario, container_comentario)
                    container_comentarios.appendChild(container_tarefa_comentando)
                    container_comentarios.appendChild(linha_roxa_comentando)
                });
            }
        });
    }


}

async function pegarFotoComentario(id) {

    const comentarioId = id
    const listUsers = await pegarUsuarios()

    listUsers.forEach(usuario => {

        if(usuario.id == comentarioId){

            localStorage.setItem('foto_comentario', usuario.foto)
        }  
    });
}

async function contagemComentarios(idTarefa) {

    const tarefaId = idTarefa
    console.log('id tarefa:' + tarefaId);
    let qtd_comentarios = 0;
    const listTasks = await pegarTarefas()
    listTasks.forEach(task => {
        if(task.id == tarefaId) {
            qtd_comentarios = task.comentarios.length
            console.log('aaa' + qtd_comentarios);
        }
    });
    return qtd_comentarios;
}

// async function postarComentario(){
//     const listTasks = await pegarTarefas()
//     await fetch(listTasks, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(tarefa)
//     });
// }

async function pegarTarefas() {
    const endpoint = 'http://localhost:5080/tarefas';
    const userApi = await fetch(endpoint);
    const listTasks = await userApi.json();
    return listTasks;
}

async function pegarUsuarios() {
    const endpoint = 'http://localhost:5080/usuario';
    const userApi = await fetch(endpoint);
    const listUsers = await userApi.json();
    return listUsers;
}

colocarNomeFoto()
criarTarefas()

