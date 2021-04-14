import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Calendar from "./pages/Calendar";

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/calendar" component={Calendar}/>
            </Switch>
        </BrowserRouter>
    )
    
}

export default Routes;