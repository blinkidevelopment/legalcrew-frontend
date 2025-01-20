import { Component } from "react";
import AppRoutes from "./AppRoutes";

export default class App extends Component{
    static displayName = App.name;

    render(){
        return(
            <AppRoutes />
        );
    }
}