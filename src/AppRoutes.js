import { Route, Routes } from 'react-router-dom';
import Chat from './components/Chat';
import ContainerChat from './components/ContainerChat';
import Login from './components/Login';
import RotaPrivada from './components/RotaPrivada';
import NovoChat from './components/NovoChat';

export async function loader({ params }) {
    return params;
}

const AppRoutes = () => {
    return(
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RotaPrivada />}>
                <Route path="chat" element={<ContainerChat />}>
                    <Route path="" element={<NovoChat />} />
                    <Route path="agente/:parametro" loader={loader} element={<Chat novoChat={true} />} />
                    <Route path="thread/:parametro" loader={loader} element={<Chat novoChat={false} />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default AppRoutes;