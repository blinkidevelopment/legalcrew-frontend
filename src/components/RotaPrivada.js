import { useEffect, useState } from "react";
import ApiFetch from "../utils/ApiFetch";
import { Navigate, Outlet } from "react-router-dom";

function RotaPrivada(){
    const apiFetch = new ApiFetch();
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const obterUsuario = async () => {
            try{
                const dados = await apiFetch.buscarUsuarioLogado();

                if(dados != "Não autenticado"){
                    setUsuarioLogado(dados);
                }
            }catch{
                setUsuarioLogado(null);
            }finally{
                setCarregando(false);
            }
        }
        obterUsuario();
    }, []);

    if(carregando){
        return <div>Carregando...</div>;
    }

    if(!usuarioLogado){
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

export default RotaPrivada;