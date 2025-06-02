import * as XLSX from "xlsx";

class SaleProcessor {
    constructor() {
        this.result = {
            id: '',
            client: '',
            initDate: '',
            endDate: '',
            products: []
        };
    }

    // Método público para procesar un archivo Excel
    processFile(file, callback) {
        const reader = new FileReader();

        reader.onload = (evt) => {
            const workbook = XLSX.read(evt.target.result, {type: 'binary'});
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet, {header: 1});

            const headerInfo = this.findHeaderRow(data);
            if (!headerInfo) {
                alert("No se encontraron los encabezados esperados.");
                return;
            }

            const observaciones = this.extractObservations(data);
            const products = this.extractProducts(data, headerInfo);

            this.result = {...observaciones, products: products};

            if (callback) callback(this.result);
        };

        reader.readAsBinaryString(file);
    }

    // Encuentra encabezados
    findHeaderRow(data) {
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (row.includes('Código') && row.includes('Descripción') && row.includes('Cantidad')) {
                return {
                    index: i,
                    colMap: {
                        id: row.indexOf('Código'),
                        description: row.indexOf('Descripción'),
                        amount: row.indexOf('Cantidad'),
                    }
                };
            }
        }
        return null;
    }

    // Extrae observaciones del archivo
    extractObservations(data) {
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const cell = row[0]?.toString().toLowerCase();
            if (cell?.includes("observaciones")) {
                const lineaFechas = data[i + 2]?.[0] || '';
                const partes = lineaFechas.split(",");

                const code = partes[0]?.split(" ")[1] || '';
                const initDate = partes[0]?.split(" ")[2] || '';
                const endDate = partes[1]?.split(" ")[2] || '';
                const client = data[i + 1]?.[0]?.replace("Cliente: ", "") || '';

                return {id: null, code, client, initDate, endDate};
            }
        }
        return {id: '', code: '', client: '', initDate: '', endDate: ''};
    }

    // Extrae productos y sus componentes
    extractProducts(data, {index: headerIndex, colMap}) {
        const products = [];
        let currentProduct = null;

        for (let i = headerIndex + 1; i < data.length; i++) {
            const row = data[i];
            if (!row || !row[colMap.id]) continue;

            const id = row[colMap.id];
            const description = row[colMap.description];
            const amount = row[colMap.amount];

            if (id === "Base Imponible") break;

            if (!isNaN(id)) {
                currentProduct = {
                    id,
                    description,
                    amount,
                    components: [],
                };
                products.push(currentProduct);
            } else if (currentProduct) {
                const components = this.parseLineComponents(id);
                currentProduct.components.push(...components);
            }
        }

        console.log(products);
        return products;
    }

    // Detecta si una línea contiene varios componentes
    parseLineComponents(linea) {
        const regex = /\d{5,}/g;
        const posiciones = [...linea.matchAll(regex)];
        const componentes = [];

        if (posiciones.length >= 2) {
            let startIdx = 0;
            for (let i = 0; i < posiciones.length; i++) {
                const end = i + 1 < posiciones.length ? posiciones[i + 1].index : linea.length;
                const slice = linea.slice(startIdx, end).trim();
                componentes.push(this.parseComponent(slice));
                startIdx = end;
            }
        } else {
            componentes.push(this.parseComponent(linea));
        }

        return componentes;
    }

    // Extrae datos de un componente individual
    parseComponent(linea) {
        const partes = linea.split(' ').filter(p => p.trim() !== '');
        return {
            id: partes[0],
            description: partes.slice(1, -1).join(' '),
            amount: partes[partes.length - 1]
        };
    }
}

export default SaleProcessor;
