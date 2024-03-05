'use strict'

const botao_logar = document.getElementById('botao_logar')
const botao_cadastrar = document.getElementById('botao_cadastrar')

botao_logar.addEventListener('click', logarUsuario)
botao_cadastrar.addEventListener('click', cadastrarUsuario)

async function pegarUsuarios() {

    const endpoint = 'http://localhost:5080/usuario';
    const userApi = await fetch(endpoint);
    const listUsers = await userApi.json();

    return listUsers

}

async function logarUsuario() {

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    let usuarioEncontrado = false;
    let premium = false

    if(email === '' || senha === '') {
        alert('Preencha o e-mail e a senha.');
    } else {
        try {
            const listUsers = await pegarUsuarios()
    
            listUsers.forEach((user) => {
                if(email === user.email && senha === user.senha){
                    localStorage.setItem('IdUsuario', user.id);
                    localStorage.setItem('nomeUsuario', user.nome);
                    localStorage.setItem('premium', user.premium)
                    usuarioEncontrado = true;
                    premium = user.premium
                }
            });

            if (usuarioEncontrado && premium == true) {
                alert('Usuario Logado com Sucesso - premium !!');
                window.location.href = './menu_premium/menu.html';
            } else if(usuarioEncontrado && premium == false){
                alert('Usuario Logado com Sucesso - comum !!')
                window.location.href = './menu_premium/menu.html';
            } else {
                alert('Email ou senha incorretos')
            }
    
        } catch (error){
            alert('Ocorreu um erro ao buscar usuários.');
        }
    }
}

async function cadastrarUsuario() {

    const telaPreta = document.getElementById('tela_transparente')
    telaPreta.classList.add('preto_transparente')

    telaPreta.innerHTML = 
    `
    <div class="cadastrar">
            <div id="sair" class="sair">
                <img src="./img/seta-esquerda.jpg" alt="">
                <p>sair</p>
            </div>
            <img src="./img/logoPru 2.png" alt="">
            <div class="inserir_dados_cadastrar">
                <div class="nome dados">
                    <div class="label">
                        <h3>Seu nome aqui</h3>
                    </div>
                    <input id="nome" type="text">
                </div>
                <div class="email dados">
                    <div class="label">
                        <h3>Seu email aqui</h3>
                    </div>
                    <input id="email_cadastrar" type="text">
                </div>
                <div class="senha dados">
                    <div class="label">
                        <h3>Sua senha aqui</h3>
                    </div>
                    <input id="senha_cadastrar" type="text">
                </div>
                <h4>Deseja ser premium?</h4>
            </div>
            <div class="checkboxes">
                <div class="sim">
                    <input id="sim" type="checkbox" value="sim">
                    <h5>Sim</h5>
                </div>
                <div class="nao">
                    <input id="nao" type="checkbox" value="nao">
                    <h5>Não</h5>
                </div>
            </div>
            <div id= "avancar" class="avancar dados">
                AVANÇAR
            </div>
            <span>Ao clicar em Avançar você concorda com nossos termos de privacidade</span>
        </div>
    `

    const cadastrar_novo_usuario = document.getElementById('avancar')
    cadastrar_novo_usuario.addEventListener('click', validarNovoUsuario)

    const sair = document.getElementById('sair')
    sair.addEventListener('click', function(){
        telaPreta.innerHTML = ''
        telaPreta.classList.remove('preto_transparente')
    })
}

function validarNovoUsuario() {

    console.log('oiiuuiii');

        const email = document.getElementById('email_cadastrar').value
        const senha = document.getElementById('senha_cadastrar').value
        const nome = document.getElementById('nome').value

        console.log(nome);
        const simCheckbox = document.getElementById('sim')
        const naoCheckbox = document.getElementById('nao')

        let premium

        if(email == '' || senha == '' || nome == '') {
            alert('preencha')
        } else if(!naoCheckbox.checked && !simCheckbox.checked) {
            alert('você deve selecionar uma opção')
        } else if (simCheckbox.checked && naoCheckbox.checked) {
            alert('Você não deve selecionar as 2 opções')
        } else if (naoCheckbox.checked && !simCheckbox.checked) {
            premium = false
            criarNovoUsuario(premium, email, senha, nome)
        } else{
            premium = true
            criarNovoUsuario(premium, email, senha, nome)
        } 
}

async function criarNovoUsuario(premium, email, senha, nome) {

    const listUsers = await pegarUsuarios()

    const novo_usuario = {}

    novo_usuario.id = listUsers.length + 1               
    novo_usuario.nome = nome
    novo_usuario.email = email
    novo_usuario.senha = senha
    novo_usuario.premium = premium
    novo_usuario.foto = '../img/image 34.png'

    console.log(novo_usuario);
    
    enviarTarefa(novo_usuario)

}

async function enviarTarefa(novousuario) {
    const endPoint = 'http://localhost:5080/usuario';
    await fetch(endPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novousuario)
    });
}

async function excluirUsuarioPorId(id) {
    const endPoint = `http://localhost:5080/usuario/${id}`;
    await fetch(endPoint, {
        method: 'DELETE'
    });
}

async function aaa() {

    const listUsers = await pegarUsuarios()

    console.log(listUsers);
}

aaa()
// excluirUsuarioPorId(4)
