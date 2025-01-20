import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { faXmark } from '@fortawesome/free-solid-svg-icons'

function Arquivo({ arquivo, removerArquivo }){
    const [exibirExcluir, setExibirExcluir] = useState(false)

    return(
        <Card onMouseEnter={() => setExibirExcluir(!exibirExcluir)} onMouseLeave={() => setExibirExcluir(!exibirExcluir)}>
            <Card.Body>
                <div className="d-flex gap-2">
                    {exibirExcluir === true ? 
                        <FontAwesomeIcon 
                            icon={faXmark}
                            className="mt-1"
                            onClick={removerArquivo}
                            style={{cursor: "pointer"}} /> 
                    : ""}
                    <span
                        style={{
                            display: "block",
                            maxWidth: "150px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                    >
                        {arquivo.name}
                    </span>
                </div>
            </Card.Body>
        </Card>
    );
}

export default Arquivo;