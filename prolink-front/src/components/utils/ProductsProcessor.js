import * as XLSX from "xlsx";

class ProductsProcessor {
    constructor() {
        this.result = {
            id: '',
            description: '',
            process: ''
        };
    }

    processFile(file, callback) {
        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (!jsonData || jsonData.length === 0) {
                alert("El archivo está vacío o malformado.");
                return;
            }

            const [headerRow, ...rawDataRows] = jsonData;

            // Buscar índices de las columnas clave
            const codigoIndex = headerRow.findIndex(col => col?.toString().toUpperCase().includes("CÓDIGO"));
            const descripcionIndex = headerRow.findIndex(col => col?.toString().toUpperCase().includes("DESCRIPCION"));
            const procesoIndex = headerRow.findIndex(col => col?.toString().toUpperCase().includes("PROCESO"));

            if (codigoIndex === -1 || descripcionIndex === -1) {
                alert("No se encontraron las columnas 'CÓDIGO' o 'DESCRIPCION'.");
                return;
            }

            // Filtrar filas vacías (hasta la primera completamente vacía)
            const dataRows = [];
            for (const row of rawDataRows) {
                const isEmpty = !row || row.every(cell => cell == null || cell.toString().trim() === "");
                if (isEmpty) break; // detener cuando encuentre la primera vacía
                dataRows.push(row);
            }

            // Mapear a formato deseado
            this.result = dataRows.map(row => {
                const codigo = row[codigoIndex] ?? "";
                const descripcion = row[descripcionIndex] ?? "";
                const proceso = procesoIndex !== -1 ? row[procesoIndex] ?? "Standar" : "Standar";

                return {
                    id: codigo,
                    description: descripcion,
                    processName: proceso
                };
            });

            if (callback) callback(this.result);
        };

        reader.readAsBinaryString(file);
    }

}

export default ProductsProcessor;
