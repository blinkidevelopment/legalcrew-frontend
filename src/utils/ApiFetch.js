import { saveAs } from 'file-saver';

class ApiFetch{
    constructor(){
        this.urlBase = "http://localhost:8000";
        //this.urlBase = "https://legal-crew-api-cbeydedaffe8cmge.eastus-01.azurewebsites.net"
    }

    async login(username, password){
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        try{
            const response = await fetch(`${this.urlBase}/usuario/login`, {
                method: "post",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
            });

            if(response.ok){
                const data = await response.json();
                return data;
            }
        }catch{
            return "Erro";
        }
    }

    async logout(){
        var resposta;

        try{
            await fetch(`${this.urlBase}/usuario/logout`, {
                method: "post",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = false;
        }

        return resposta;
    }

    async buscarUsuarioLogado(){
        var resposta;

        try{
            const response = await fetch(`${this.urlBase}/usuario/`, {
                method: "get",
                credentials: "include"
            });

            if(response.ok){
                resposta = await response.json();
            }
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async listarConversas(){
        var resposta;

        try{
            await fetch(`${this.urlBase}/usuario/conversas`, {
                method: "get",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async listarAssistentes(){
        var resposta;

        try{
            await fetch(`${this.urlBase}/assistente/todos/listar`, {
                method: "get",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async obterAssistente(slug){
        var resposta;

        try{
            await fetch(`${this.urlBase}/assistente/${slug}`, {
                method: "get",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async iniciarConversa(assistente, mensagem, arquivos){
        var resposta;

        try{
            var formData = new FormData();
            formData.append("mensagem", mensagem);

            if(arquivos.length > 0){
                for(const arquivo of arquivos){
                    formData.append("arquivos", arquivo);
                }
            }

            await fetch(`${this.urlBase}/assistente/${assistente}/chat`, {
                method: "post",
                credentials: "include",
                body: formData
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async listarMensagens(threadId){
        var resposta;

        try{
            await fetch(`${this.urlBase}/assistente/thread/${threadId}`, {
                method: "get",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async adicionarMensagem(assistente, threadId, mensagem, arquivos){
        var resposta;

        try{
            const formData = new FormData();
            formData.append("assistente", assistente);
            formData.append("mensagem", mensagem);

            if(arquivos.length > 0){
                for(const arquivo of arquivos){
                    formData.append("arquivos", arquivo);
                }
            }

            await fetch(`${this.urlBase}/assistente/thread/${threadId}`, {
                method: "post",
                credentials: "include",
                body: formData
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async obterNomeAssistente(assistantId){
        var resposta;

        try{
            await fetch(`${this.urlBase}/assistente/${assistantId}/nome`, {
                method: "get",
                credentials: "include"
            }).then((response) => response.json()).then((data) => {resposta = data});
        }catch{
            resposta = null;
        }

        return resposta;
    }

    async baixarArquivo(threadId, fileId) {
        try {
            const response = await fetch(`${this.urlBase}/assistente/thread/${threadId}/arquivo/${fileId}`, {
                method: 'get',
                credentials: 'include'
            });
    
            if (!response.ok) {
                const dadosErro = await response.json();
                return alert(`${dadosErro.detail}`);
            }
    
            const blob = await response.blob();
            saveAs(blob, `${fileId}.png`);
        }catch{
            alert(`Ocorreu um erro ao fazer o download`);
        }
    }
}

export default ApiFetch;