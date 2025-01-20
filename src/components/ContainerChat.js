import { Outlet, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Card, InputGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faRightFromBracket, faTrash } from '@fortawesome/free-solid-svg-icons'
import ApiFetch from '../utils/ApiFetch';
import { AgentesContext } from './AgentesContext';
import Dropdown from 'react-bootstrap/Dropdown';
import SplitButton from 'react-bootstrap/SplitButton';

function ContainerChat(){
    const [mostrarSidebar, setMostrarSidebar] = useState(true);
    const [conversas, setConversas] = useState([]);
    const [agentesDisponiveis, setAgentesDisponiveis] = useState([]);
    const [agenteSelecionado, setAgenteSelecionado] = useState(null);
    const apiFetch = new ApiFetch();
    const navigate = useNavigate();

    const handleClickCard = (idThread) => {
        navigate(`thread/${idThread}`);
    }

    const handleClickButton = () => {
        if(agenteSelecionado !== null){
            navigate(`/chat/agente/${agenteSelecionado.slug}`);
        }else{
            alert("Selecione um assistente para começar um chat");
        }
    }

    const handleSelect = (e) => {
        const agente = agentesDisponiveis.find(agente => agente.slug === e);
        setAgenteSelecionado(agente);
    }

    const obterNomeAssistente = (id) => {
        const agente = agentesDisponiveis.find((agente) => agente.id === id);
        return agente ? agente.nome : "Assistente";
    }

    const logout = async () => {
        var resposta = await apiFetch.logout();
        if(resposta === true){
            navigate('/login');
        }
    }

    useEffect(() => {
        const obterConversas = async () => {
            var dados = await apiFetch.listarConversas();
            setConversas(dados);
        }

        const obterAgentes = async () => {
            var dados = await apiFetch.listarAssistentes();
            setAgentesDisponiveis(dados || []);
        }

        obterConversas();
        obterAgentes();
    }, [])

    return(
        <Row className="w-100">
            <div className={mostrarSidebar === true ? "col-auto d-flex justify-content-center pe-0" : "col-auto d-flex justify-content-center pe-0 border-end border-secondary-subtle"}>
                <p className="d-flex flex-column gap-2 p-2 h-4">
                    <FontAwesomeIcon icon={faBars} onClick={() => setMostrarSidebar(!mostrarSidebar)} style={{cursor: "pointer"}} />
                    <FontAwesomeIcon icon={faRightFromBracket} onClick={() => logout()} style={{cursor: "pointer"}} />
                </p>
            </div>
            {mostrarSidebar === true ? 
                <Col className="col-2 border-end border-secondary-subtle d-flex flex-column">
                    <h4 className="pt-1">Conversas</h4>
                    <Row className="flex-grow-1 overflow-auto" style={{height: '500px'}}>
                        <div className="d-flex flex-column gap-2">
                            {conversas != null ? [...conversas].reverse().map((conversa, index) => (
                                <Card onClick={() => handleClickCard(conversa.id_thread)} style={{cursor: "pointer"}}>
                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                        <p className="mb-0">
                                            #{index + 1}. {obterNomeAssistente(conversa.id_assistente)}
                                        </p>
                                        <FontAwesomeIcon icon={faTrash} onClick={() => alert("Excluir conversa")} />
                                    </Card.Body>
                                </Card>
                            )) : ""}
                        </div>
                    </Row>
                    <Row className="my-3">
                        <InputGroup className="w-100 d-flex justify-content-center">
                            <SplitButton
                                title={
                                    <>
                                        Iniciar chat com {agenteSelecionado !== null ? agenteSelecionado.nome : "..."}
                                    </>
                                }
                                onSelect={(e) => handleSelect(e)}
                                onClick={() => handleClickButton()}
                                size="md"
                                className="w-100"
                            >
                                {agentesDisponiveis.map((agente) => (
                                    <Dropdown.Item eventKey={agente.slug} key={agente.slug}>
                                        {agente.nome}
                                    </Dropdown.Item>
                                ))}
                            </SplitButton>
                        </InputGroup>
                    </Row>
                </Col>
            : ""}
            <Col className="col p-0">
                <AgentesContext.Provider value={agentesDisponiveis}>
                    <Outlet />
                </AgentesContext.Provider>
            </Col>
        </Row>
    );
}

export default ContainerChat;