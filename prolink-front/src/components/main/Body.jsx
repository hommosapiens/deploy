import React, {useContext} from 'react';
import StatesList from "./state/StatesList.jsx";
import ProcessList from "./process/ProcessList.jsx";
import ProductList from "./product/ProductList.jsx";
import SalesList from "./sale/SalesList.jsx";
import {UserContext} from "./user/UserProvider.jsx";

export const Body = () => {

    const {activeSection} = useContext(UserContext);

    return (
        <div id="main" className="px-4 pt-4 text-white">
            {activeSection === "orders" && <SalesList/>}
            {activeSection === "products" && <ProductList/>}
            {activeSection === "processes" && <ProcessList/>}
            {activeSection === "states" && <StatesList/>}
        </div>
    );

};

Body.propTypes = {}

export default Body;

