<template>
    <div>
        <v-dialog v-model="dialog" max-width="600">
            <v-card>
                <v-system-bar class="pt-6 pb-6" color="baseColor" dark>
                    <v-card-title>
                        <span class="text-h6">Detalles de la transacción</span>
                    </v-card-title>
                </v-system-bar>
                <v-card-text>
                    <v-row class="mt-4">
                        <v-col cols="12" md="5" class="text-center">
                            <img class="border" :src="qrCodeUrl" alt="Código QR" height="200" />
                        </v-col>
                        <v-col cols="12" md="7">
                            <h2 class="mb-4">{{ transaction.dsc }}</h2>
                            <p class="mb-2">
                                <strong>One Time Password (OTP):</strong>
                                {{ transaction.otp }}
                            </p>
                            <p class="mb-2">
                                <strong>Fecha expiración:</strong>
                                {{ formatDate(transaction.exp) }}
                            </p>
                            <p class="mb-2">
                                <strong>Monto:</strong>
                                {{ parseAmount(transaction.mnt, transaction.cur) }}
                            </p>
                            <p class="">
                                <strong>Estado: </strong>
                                <v-chip :color="statusColor" small dark>{{ getStatusText(transaction.sts)
                                }}</v-chip>
                            </p>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn color="success" small dark @click="shareQRCode(qrCodeUrl, transaction.dsc)">
                        Enviar código QR
                    </v-btn>
                    <v-btn color="danger" @click="closeDialog" small dark>Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import QRCode from 'qrcode';

export default {
    name: 'TransactionDetail',
    props: {
        transaction: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            dialog: false,
            qrCodeUrl: '',
            statusColor: '',
        }
    },
    mounted() {
        this.showDetails(this.transaction);
    },
    methods: {
        //Show transaction detail
        showDetails(trx) {
            this.qrCodeUrl = trx.key;
            this.dialog = true;
            this.generateQR(trx.key);
            //Change chip color 
            if (trx.sts === '0') {
                this.statusColor = 'success';
            } else if (trx.sts === '4') {
                this.statusColor = 'danger';
            } else if (trx.sts === '6') {
                this.statusColor = 'primary';
            }
        },
        //Api to generate QR code (transaction key)
        async generateQR(transactionKey) {
            try {
                this.qrCodeUrl = await QRCode.toDataURL(transactionKey, { width: 200 })
            } catch (err) {
                console.error('Error to generate the QRCode:', err)
            }
        },
        //Share the QR code 
        async shareQRCode(qrCode, trxName) {
            try {
                // Convert the URL(base64 or URL) on Binary large object
                const response = await this.$axios.get(qrCode, { responseType: 'blob' });
                const blob = response.data;

                const file = new File([blob], `${trxName}.png`, { type: blob.type });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: `${trxName}`,
                        text: `Hola, aquí tienes el código QR para realizar la transacción de ${trxName}`,
                        files: [file]
                    });
                } else {
                    alert('Your browser does not support file sharing..');
                }
            } catch (error) {
                console.error('Error sharing QR Code:', error);
            }
        },
        closeDialog() {
            this.dialog = false;
            this.$emit('closed');
        },
        parseAmount(amount, currency) {
            let amountParse;
            if (currency === '188') {
                amountParse = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(amount / 100);
            } else {
                amountParse = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);
            }
            return amountParse;
        },
        //Transaction status
        getStatusText(status) {
            switch (status) {
                case '0':
                    return 'Pendiente';
                case '1':
                    return 'En uso';
                case '2':
                    return 'Cancelada';
                case '3':
                    return 'Enviada';
                case '4':
                    return 'Expirada';
                case '5':
                    return 'Pendiente o en uso';
                case '6':
                    return 'Usada';
                default:
                    return 'Desconocida';
            }
        },
        formatDate(dateToFormat) {
            const [fechaStr] = dateToFormat.split(' ');        // "25/07/31"
            const [yy, mm, dd] = fechaStr.split('/');          // separa en partes
            const year = `20${yy}`;                            // convierte "25" → "2025"
            return `${dd}/${mm}/${year}`;                      // arma "31/07/2025"
        },
    }
}
</script>

<style scoped>
img {
    border: 5px solid #E0F2F1;
    border-radius: 10px;
    filter: drop-shadow(2px 4px 6px #E0F2F1);
    background-color: #E0F2F1;
    padding: 5px;
}
</style>
