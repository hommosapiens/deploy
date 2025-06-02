import React, {useEffect, useState} from 'react';
import {FiPlus} from "react-icons/fi";
import ProductCard from "./ProductCard.jsx";
import {deleteProductById, getAllProducts, saveProduct, updateProduct} from "../../../api/ProductApi.js";
import webSocket from "../../../websocket/WebSocket.js";
import ProductsProcessor from "../../utils/ProductsProcessor.js";
import ProductsModal from "./ProductsModal.jsx";

export const ProductList = () => {
    const [products, setProducts] = useState([]);
    const processor = React.useMemo(() => new ProductsProcessor(), []);
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        getAllProducts()
            .then(setProducts)
            .catch((err) => console.error("On find all Products:", err))
    }, [])

    const handleWebSocketUpdate = (entry) => {
        const entries = Array.isArray(entry) ? entry : [entry];

        setProducts(prev => {
            const productMap = new Map(prev.map(product => [product.id, product]));

            entries.forEach(newProduct => {
                if (!newProduct?.id) return;
                productMap.set(newProduct.id, newProduct)
            });

            return Array.from(productMap.values());
        });
    };

    const handleWebSocketDelete = (deletedId) => {
        setProducts(prev => prev.filter(s => s.id.toString() !== deletedId.toString()));
    };

    webSocket(handleWebSocketUpdate, handleWebSocketDelete, "product");

    const handleAdd = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            processor.processFile(file, (result) => {
                setData(result);
                setShowModal(true);
            });
        } catch (error) {
            console.error("Error processing file:", error);
        }
        e.target.value = null;
    }

    const onSave = async (productData) => {
        const entity = {
            description: productData.description.toString(),
            process: productData.process,
        }
        try {
            const res = saveProduct(entity);
            console.log("Successfully saved: ", res);
        } catch (err) {
            console.error("On save ProductCard:", err);
        }
    }

    const onUpdate = async (productData) => {
        const entity = {
            id: productData.id,
            description: productData.description.toString(),
            process: productData.process,
        };
        try {
            const res = await updateProduct(entity);
            console.log("Successfully updated: ", res);
        } catch (err) {
            console.error("On update StateCard:", err);
        }
    };

    const onDelete = async (id) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (confirmed) {
            try {
                const res = await deleteProductById(id);
                setProducts(prev => prev.filter(product => product.id !== id));
                console.log("Successfully deleted process " + id + ", res: " + res);
            } catch (err) {
                console.error("On delete Process:", err);
            }
        }
    };

    return (
        <div
            id={"product-list"}
            className="flex flex-col items-center border border-neutral-500 rounded-t-lg min-h-screen bg-neutral-800 "
        >
            {/*Label*/}
            <div className="px-8 pt-8">
                <h2 className="text-3xl text-white font-semibold border-b-2 w-80 mb-6 text-center">
                    Plantilla productos{''}
                    <label
                        htmlFor="fileUpload"
                        className="absolute top-24 right-6 m-4 border border-neutral-500 text-white rounded-full p-2 hover:bg-neutral-600 transition-all duration-300 ease-in-out cursor-pointer"
                        title="Seleccionar archivo"
                    >
                        <FiPlus/>
                    </label>
                    <input
                        id="fileUpload"
                        type="file"
                        accept=".xls,.xlsx"
                        className="hidden"
                        onChange={handleAdd}
                    />
                </h2>
            </div>

            {/*Content*/}
            <div className="w-full overflow-auto max-h-[calc(100vh-190px)] custom-scrollbar ">
                <div className="w-full p-8">
                    {products.map((outProduct) => (
                        <ProductCard
                            key={outProduct.id}
                            outProduct={outProduct}
                            onSave={onSave}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </div>

            {showModal && (
                <ProductsModal data={data} onClose={() => setShowModal(false)}/>
            )}
        </div>
    );

};

export default ProductList;