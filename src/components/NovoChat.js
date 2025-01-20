import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRocket } from '@fortawesome/free-solid-svg-icons'
import { AgentesContext } from "./AgentesContext";
import Row from 'react-bootstrap/Row';
import { InputGroup } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import SplitButton from 'react-bootstrap/SplitButton';

function NovoChat(){
    const [agenteSelecionado, setAgenteSelecionado] = useState(null);
    const agentesDisponiveis = useContext(AgentesContext);
    const navigate = useNavigate();

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

    return(
        <div className="d-flex flex-column vh-100 ps-4 pe-3 justify-content-center align-items-center">
            <FontAwesomeIcon icon={faRocket} className="h2" />
            <h1>Nada por aqui ainda...</h1>
            <p>Utilize o botão abaixo para iniciar uma nova conversa, ou selecione uma conversa existente no menu lateral</p>
            <Row>
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
        </div>
    );
}

export default NovoChat;