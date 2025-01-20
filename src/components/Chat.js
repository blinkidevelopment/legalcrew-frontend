import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Arquivo from "./Arquivo";
import ApiFetch from "../utils/ApiFetch"
import Spinner from 'react-bootstrap/Spinner';
import Markdown from 'react-markdown';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useContext } from 'react';
import { AgentesContext } from "./AgentesContext";

function Chat({ novoChat }){
    const [arquivos, setArquivos] = useState([]);
    const [mensagens, setMensagens] = useState(null);
    const [novaMensagem, setNovaMensagem] = useState('');
    const [ultimaMensagem, setUltimaMensagem] = useState('');
    const [possuiArquivos, setPossuiArquivos] = useState(false);
    const [mensagemEnviada, setMensagemEnviada] = useState(false);
    const [mostrarMenuAgentes, setMostrarMenuAgentes] = useState(false);
    const [agenteSelecionado, setAgenteSelecionado] = useState({});
    const [carregando, setCarregando] = useState(false);
    const limiteArquivos = 5;
    const containerRef = useRef(null);
    const inputFileRef = useRef(null);
    const agentesDisponiveis = useContext(AgentesContext);
    const navigate = useNavigate();
    const apiFetch = new ApiFetch();
    var { parametro } = useParams();

    const handleFileSelect = (event) => {
        const novosArquivos = Array.from(event.target.files);

        setArquivos((prevArquivos) => {
            const totalArquivos = [...prevArquivos, ...novosArquivos];

            if(totalArquivos.length > limiteArquivos){
                alert(`Limite de ${limiteArquivos} arquivos atingido`);
                return prevArquivos;
            }

            return totalArquivos;
        });
    };

    const handleSelect = (e) => {
        const agente = agentesDisponiveis.find(agente => agente.slug === e.target.value);
        setAgenteSelecionado(agente);
        setMostrarMenuAgentes(false);

        if(novaMensagem == "@"){
            setNovaMensagem("");
        }
    }

    const handleChange = async (e) => {
        setNovaMensagem(e.target.value);
        const cursorPos = e.target.selectionStart;
        const caractere = e.target.value[cursorPos - 1];

        if (caractere === "@") {
            setMostrarMenuAgentes(true);
        } else {
            setMostrarMenuAgentes(false);
        }
    };

    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            if(e.shiftKey){
                return;
            }else{
                e.preventDefault();
                adicionarMensagem();
            }
        }
    }

    const handleDownload = async (e, idArquivo) => {
        e.preventDefault();
        await apiFetch.baixarArquivo(parametro, idArquivo);
    }

    const selecionarArquivo = () => {
        document.getElementById("input-file").click();
    }

    const obterNomeAssistente = (id) => {
        const agente = agentesDisponiveis.find((agente) => agente.id === id);
        return agente ? agente.nome : "Assistente";
    }

    const removerArquivo = (arqRemover) => {
        setArquivos((prevArquivos) =>
            prevArquivos.filter((arquivo) => arquivo !== arqRemover)
        );
        
        if(inputFileRef.current){
            inputFileRef.current.value = "";
        }
    };

    const removerArquivos = () => {
        setArquivos([]);
        
        if(inputFileRef.current){
            inputFileRef.current.value = "";
        }
    };

    const removerReferencias = (texto) => {
        return texto.replace(/【.*?】/g, "").trim();
    }

    const adicionarMensagem = async () => {
        if(novaMensagem.trim() != ""){
            setUltimaMensagem(novaMensagem);
            var ultimaMsgBkp = novaMensagem;
            setMensagemEnviada(true);
            setPossuiArquivos(arquivos.length > 0 ? true : false);
            setNovaMensagem('');
            removerArquivos();
            
            if(novoChat === false){
                var msgs = await apiFetch.adicionarMensagem(agenteSelecionado.slug, parametro, ultimaMsgBkp, arquivos);
                setMensagens(msgs);
            }else{
                var threadIdNovo = await apiFetch.iniciarConversa(agenteSelecionado.slug, ultimaMsgBkp, arquivos);
                navigate(`/chat/thread/${threadIdNovo.thread_id}`);
            }

            setMensagemEnviada(false);
            setPossuiArquivos(false);
        }
    }

    const rolarConversa = () => {
        if(containerRef.current && novoChat === false){
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }

    useEffect(() => {
        const buscarMensagens = async () => {
            var dados = await apiFetch.listarMensagens(parametro);
            
            if(dados){
                setMensagens(dados.mensagens);
                setAgenteSelecionado(dados.assistente);
                setCarregando(false);
            }
        }

        const obterDadosAssistente = async () => {
            var dadosAgente = await apiFetch.obterAssistente(parametro);
            setAgenteSelecionado(dadosAgente);
        }

        if(novoChat === false){
            setCarregando(true);
            buscarMensagens();
        }else{
            setMensagens(null);
            obterDadosAssistente();
        }
    }, [parametro])

    useEffect(() => {
        rolarConversa();
    }, [ultimaMensagem, mensagens])

    return(
        <div className="d-flex flex-column vh-100 ps-4 pe-3">
            <Row className="pt-2">
                <h1>Chat com {agenteSelecionado.nome}</h1>
            </Row>
            <Row className="flex-grow-1 overflow-auto mb-3 px-3" style={{height: '500px'}} ref={containerRef}>
                <Container>
                    {carregando === true ? 
                        <div className="d-flex flex-column justify-content-center align-items-center h-100">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Carregando...</span>
                            </Spinner>
                        </div>
                    : mensagens !== null ? 
                        mensagens.data.slice().reverse().map((mensagem) => (
                            <Row className={mensagem.role === "assistant" ? "d-flex" : "d-flex justify-content-end"}>
                                <Card key={mensagem.id} className="w-50 mb-3 p-0">
                                    <Card.Header>
                                        {mensagem.role === "assistant" ? 
                                            obterNomeAssistente(mensagem.assistant_id) 
                                        : "Usuário"}
                                    </Card.Header>
                                    <Card.Body>
                                        {mensagem.content[0].type === "text" ? 
                                            <Markdown children={removerReferencias(mensagem.content[0].text.value)} />
                                        : <a href="#" onClick={(e) => handleDownload(e, mensagem.content[0].image_file.file_id)}>Imagem</a>}
                                        {mensagem.attachments.length > 0 ? 
                                            <a href="#" onClick={(e) => handleDownload(e, mensagem.attachments[0].file_id)}>Arquivo</a>
                                        : ""}
                                    </Card.Body>
                                </Card>
                            </Row>
                        ))
                    : ""}
                    {mensagemEnviada === true ?
                        <>
                            <Row className="d-flex justify-content-end">
                                <Card key="nova-mensagem" className="w-50 mb-3 p-0">
                                    <Card.Header>Usuário</Card.Header>
                                    <Card.Body>
                                        {ultimaMensagem}
                                    </Card.Body>
                                </Card>
                            </Row>
                            {possuiArquivos === true ?
                                <Row className="d-flex justify-content-end">
                                    <Card key="nova-mensagem-arquivos" className="w-50 mb-3 p-0">
                                        <Card.Header>Usuário</Card.Header>
                                        <Card.Body>
                                            <p>
                                                <Spinner animation="border" role="status" size="sm">
                                                    <span className="visually-hidden">Carregando...</span>
                                                </Spinner> Subindo arquivos...
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Row>
                            : ""}
                            <Row className="d-flex">
                                <Card key="nova-mensagem-assistente" className="w-50 mb-3 p-0">
                                    <Card.Header>{agenteSelecionado.nome}</Card.Header>
                                    <Card.Body>
                                        <Spinner animation="grow" role="status" size="sm">
                                            <span className="visually-hidden">Carregando...</span>
                                        </Spinner>
                                    </Card.Body>
                                </Card>
                            </Row>
                        </>
                    : ""}
                </Container>
            </Row>
            <Row>
                <Form className="pb-3">
                    {arquivos.length > 0 ?
                        <div className="d-flex flex-wrap gap-3 mb-2">
                            {arquivos.map((arquivo) => (
                                <Arquivo arquivo={arquivo} removerArquivo={() => removerArquivo(arquivo)} />
                            ))}
                        </div>
                    : ""}
                    {mostrarMenuAgentes === true ?
                        <Form.Select aria-label="Selecione um agente" className="mb-1" onChange={(e) => handleSelect(e)}>
                            <option value="">--Selecione um agente para mencionar--</option>
                            {agentesDisponiveis.map((opcao) => (
                                <option value={opcao.slug}>{opcao.nome}</option>
                            ))}
                        </Form.Select>
                    : ""}
                    <FloatingLabel
                        controlId="floatingTextarea"
                        label={
                            <>
                                Digite sua mensagem para {agenteSelecionado.nome && (
                                    <span style={{ color: "blue", fontWeight: "bold" }}>{agenteSelecionado.nome}</span>
                                )}
                            </>
                        }
                        className="mb-2"
                    >
                        <Form.Control 
                            as="textarea"
                            aria-label="Sua mensagem"
                            placeholder=""
                            className="mb-1"
                            onChange={(e) => handleChange(e)}
                            onKeyDown={(e) => handleKeyDown(e)}
                            value={novaMensagem}
                            style={{maxHeight: "200px"}}
                            disabled={!agenteSelecionado || !agenteSelecionado.nome}
                        />
                    </FloatingLabel>
                    <div className="d-flex justify-content-between">
                        <Button variant="outline-secondary" id="button-addon1" onClick={selecionarArquivo} disabled={arquivos.length >= limiteArquivos}>
                            <FontAwesomeIcon icon={faPaperclip} />
                        </Button>
                        <Button variant="outline-secondary" id="button-addon2" onClick={() => adicionarMensagem()} disabled={novaMensagem.trim() === ""}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </Button>
                    </div>
                    <Form.Control
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                        id="input-file"
                        multiple={true}
                        ref={inputFileRef}
                    />
                </Form>
            </Row>
        </div>
    );
}

export default Chat;