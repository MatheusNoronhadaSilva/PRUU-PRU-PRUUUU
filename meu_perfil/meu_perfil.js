'use strict'

const container_tarefas = document.getElementById('container_tarefas')

const casa = document.getElementById('casa')

casa.addEventListener('click', function(){

    window.location.href = '../menu/menu.html'
})


async function colocarNomeFoto() {

    const listUsers = await pegarUsuarios()

    nome.innerHTML = ''
    nome.innerHTML = `${localStorage.getItem('nomeUsuario')}`

    listUsers.forEach(usuario => {

        if(usuario.id == localStorage.getItem('IdUsuario')){
            
            
            foto_perfil.src = ''
            foto_perfil.src = usuario.foto
            localStorage.setItem('foto', usuario.foto)
 
        }  
    });
}

async function criarTarefas() {
    
    const listTasks = await pegarTarefas()

    listTasks.forEach(tarefa => {

        if(tarefa.idUsuario == localStorage.getItem('IdUsuario')){

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

        const lixeira = document.createElement('img')
        lixeira.src = '../img/Lixeira.png'
        lixeira.classList.add('lixeira')

        lixeira.addEventListener('click', function(){
            console.log('apagando');
            apagarTarefa(tarefa.id)
        })

        comentarios.addEventListener('click', function() {
            mostrarComentarios(tarefa.descrição, tarefa.id);
        });
        

        const p_data = document.createElement('p')
        p_data.textContent = tarefa.dataConclusão

        const linha_roxa = document.createElement('div')
        linha_roxa.classList.add('linha_roxa')

        mais.replaceChildren(comentarios, lixeira, p_data)
        container_tarefa.replaceChildren(p_desc, mais)
        espacamento_tarefa.appendChild(container_tarefa)
        container_tarefas.appendChild(espacamento_tarefa)
        container_tarefas.appendChild(linha_roxa)

        }
    });
}

async function apagarTarefa(id) {
    const endPoint = `http://localhost:5080/tarefas/${id}`;
    await fetch(endPoint, {
        method: 'DELETE'
    });
    refazerIdTarefa()
}

// async function refazerIdTarefa(){

//     try {

//         console.log('reformulando');

//         const listTasks = await pegarTarefas()
//         // Buscar todas as tarefas

//         // Reatribuir IDs sequencialmente
//         for (let i = 0; i < listTasks.length; i++) {
//             listTasks[i].id = i + 1; // IDs começando de 1 e incrementando
//         }

//         // Enviar tarefas atualizadas de volta para o servidor
//         await fetch(listTasks, {
//             method: "PUT", // Ou PATCH, dependendo do que a API suporta
//             headers: {
//                 "Content-Type": "application/json; charset=UTF-8"
//             },
//             body: JSON.stringify(listTasks)
//         });

//         console.log('IDs de tarefa refeitos com sucesso.');
//     } catch (error) {
//         console.error('Erro ao reatribuir IDs de tarefa:', error);
//     }
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

// refazerIdTarefa()
colocarNomeFoto()
criarTarefas()