import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useState } from 'react';
import { Button, Container, InputGroup } from 'react-bootstrap';
import ApiFetch from '../utils/ApiFetch';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [exibirSenha, setExibirSenha] = useState(false);
    const [aguardando, setAguardando] = useState(false);
    const navigate = useNavigate();
    const apiFetch = new ApiFetch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAguardando(true);

        var token = await apiFetch.login(username, password);

        if(token.status === true){
            navigate('/chat');
        }else{
            alert("Erro ao fazer login");
            setAguardando(false);
        }
    }

    return(
        <Container className="pt-4">
            <Form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <FloatingLabel label="E-mail">
                    <Form.Control 
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="nome@dominio.com"
                        required={true}
                        className="mb-3" />
                </FloatingLabel>
                <InputGroup className="mb-3">
                    <FloatingLabel label="Senha">
                        <Form.Control 
                            type={exibirSenha === true ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=""
                            required={true} />
                    </FloatingLabel>
                    <Button variant="outline-primary" onClick={() => setExibirSenha(!exibirSenha)}>
                        <FontAwesomeIcon icon={exibirSenha === true ? faEyeSlash : faEye} />
                    </Button>
                </InputGroup>
                <Button type="submit" disabled={aguardando}>Fazer login</Button>
            </Form>
        </Container>
    );
}

export default Login;