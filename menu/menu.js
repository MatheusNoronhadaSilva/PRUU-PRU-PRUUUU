'use strict'

const container_tarefa = document.getElementById('container_tarefa')
const espaco_extra = document.getElementById('espaco_extra')

const Botao_criartarefa = document.getElementById('criar')

const seuPerfil = document.getElementById('seuPerfil')

seuPerfil.addEventListener('click', function(){
    window.location.href = '../meu_perfil/meu_perfil.html'
})

if(localStorage.getItem('premium') === 'true') {
    layoutPremium()
} else {
    layoutNaopremium()
    console.log('ueueueueueueuue');
}

function layoutNaopremium() {

    espaco_extra.innerHTML = ''
    espaco_extra.innerHTML = 
    `
    <div class="naoPremium">
                <div class="desc_premium">
                    <div class="titulo">
                        <h2>Seja Premium</h2>
                        <img src="../img/premium.png" alt="">
                    </div>
                    <div class="desc">
                        <span>Seja premium para participar da comunidade PRU e escrever o suas tarefas</span>
                    </div>
                </div>
                <div id="sejaPremium" class="btn_sejaPremium">
                    SEJA PREMIUM PARA POSTAR
                </div>
            </div>
    `

    const botao_sejaPremium = document.getElementById('sejaPremium')

    botao_sejaPremium.addEventListener('click', function(){

        alert('não é possivel pois o servidor não aceita metodos PUT')
    })
}

// async function sejaPremium() {

//     try {

//         console.log('reformulando');

//         const listTasks = await pegarTarefas()

//         listTasks.forEach(task => {

//             if(task.id == localStorage.getItem('IdUsuario')){
//                 task.premium = true
//             }
//         });

//         await fetch(listTasks, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json; charset=UTF-8"
//             },
//             body: JSON.stringify(listTasks)
//         });

//         console.log(`${localStorage.getItem('nomeUsuario')} ficou premium`);
//         window.location.href = '../index.html'
//     } catch (error) {
//         console.error('Este usuario não ficou premium', error);
//     }

// }
function layoutPremium() {

    espaco_extra.innerHTML = ''
    espaco_extra.innerHTML= 
    `<div class="premium">
        <div id="criar" class="botao_criar">
            CRIAR TAREFA
        </div>
    </div>
    `

    const Botao_criartarefa = document.getElementById('criar')

    Botao_criartarefa.addEventListener('click', function(){

        const fundo_preto = document.getElementById('fundo_preto')
        fundo_preto.classList.add('fundo_preto')
    
        fundo_preto.innerHTML = ''
        fundo_preto.innerHTML = 
        `
        <div class="criar">
        <div class="comeco">
                    <span id= "sair">sair</span>
                    <img src="../img/logoPru 2.png" alt="">
                </div>
                <div class="alinhamento">
                    <div class="alinhamento2">
                        <textarea id="descricao" rows="5" cols="20" maxlength="180" placeholder="Digite a descrição"></textarea>
                    <textarea id="dataConclusao" cols="10" rows="2" maxlength="10" placeholder="Digite o prazo "></textarea>
                    </div>
                    <div id="criarNova" class="criarNovaTarefa">
                        CRIAR NOVA TAREFA
                    </div>
                </div>
            </div>
        `
    
        const sair = document.getElementById('sair')
    
        sair.addEventListener('click', function(){
    
            fundo_preto.innerHTML = ``
            fundo_preto.classList.remove('fundo_preto')
        })
    
        const criarNova = document.getElementById('criarNova')
    
        criarNova.addEventListener('click', function(){
    
            const novaDescricao = document.getElementById('descricao').value
            const novaDataConclusao = document.getElementById('dataConclusao').value
    
            console.log(novaDescricao, novaDataConclusao);
            
            subirTarefa(novaDescricao, novaDataConclusao)
        })
    })
}

async function validarTarefas() {
    const listUsers = await pegarUsuarios()

    listUsers.forEach(async user => {

        if(user.id != localStorage.getItem('IdUsuario') && user.premium == true) {

            const tarefaContainer = document.createElement('div');
            tarefaContainer.classList.add('tarefa');
    
            const infoPerfil = document.createElement('div');
            infoPerfil.classList.add('info_perfil');
    
            const imagemPerfil = document.createElement('img');
            imagemPerfil.src = "../img/image 34.png";
            imagemPerfil.alt = "";
    
            const tituloTarefa = document.createElement('h1');
            tituloTarefa.textContent = `Tarefas de ${user.nome}`;
    
            infoPerfil.appendChild(imagemPerfil);
            infoPerfil.appendChild(tituloTarefa);
    
            const quantidadeTarefas = document.createElement('h2');
            quantidadeTarefas.textContent = `Possui: ${await contagemTarefas(user.id)}`;
    
            tarefaContainer.appendChild(infoPerfil);
            tarefaContainer.appendChild(quantidadeTarefas);
    
            container_tarefa.appendChild(tarefaContainer);
    
            const linhaRoxa = document.createElement('div');
            linhaRoxa.classList.add('linha_roxa');
            container_tarefa.appendChild(linhaRoxa);

            tarefaContainer.addEventListener('click', function(){

                localStorage.setItem('NomeUsuarioTarefa', user.nome)
                localStorage.setItem('IdUsuarioTarefa', user.id)

                window.location.href = '../perfil_visitado/perfil.html'
            })
        }
    });
}

async function contagemTarefas(idUsuario) {
    let contagem_tarefas = 0;
    const listTasks = await pegarTarefas()
    listTasks.forEach(task => {
        if(task.idUsuario == idUsuario) {
            contagem_tarefas++;
        }
    });
    return contagem_tarefas;
}

async function subirTarefa(novaDescricao, novaDataConclusao) {

    const listTasks = await pegarTarefas()
    const desc = novaDescricao
    const prazo = novaDataConclusao

    const novatarefa = {}

    if(desc && prazo) {
        novatarefa.id = listTasks.length + 2
        novatarefa.descrição = desc
        novatarefa.dataConclusão = prazo
        novatarefa.idUsuario = localStorage.getItem('IdUsuario')
        novatarefa.comentarios = []

        console.log(novatarefa);
        

        postarTarefa(novatarefa)
    } else {
        console.log('error');
        
    }
}

async function postarTarefa(tarefa) {
    const endPoint = 'http://localhost:5080/tarefas/';
    await fetch(endPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tarefa)
    });
}


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

validarTarefas()
