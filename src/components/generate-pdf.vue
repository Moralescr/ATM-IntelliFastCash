<template>
    <div>
        <v-btn color="primary" @click="generarPDF" small>PDF</v-btn>
    </div>
</template>

<script>

import html2pdf from "html2pdf.js";

export default {
    name: "generatePDF",
    data() {
        return {

        };
    },
    methods: {
        generarPDF() {
            this.$nextTick(() => {
                const element = this.$refs.pdfContent;
                if (!element) {
                    console.error("No se encontró el contenido para PDF");
                    return;
                }
                const options = {
                    margin: 10,
                    filename: `${this.selectedTransaction.dsc || "codigo-qr"}.pdf`,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                };
                console.log('OPT', options);
                html2pdf()
                    .set(options)
                    .from(element)
                    .output('blob')
                    .then(blob => {
                        const pdfUrl = URL.createObjectURL(blob);
                        window.open(pdfUrl, '_blank');
                        // Opcional liberar memoria luego de un rato:
                        setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
                    })
                    .catch(err => {
                        console.error("Error generando PDF:", err);
                    });
            });
        },


    }
}
</script>