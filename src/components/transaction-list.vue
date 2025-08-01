<template>
    <v-container>
        <div class="pb-4">
            <v-divider />
            <!--Begin create transaction form-->
            <create-transaction @transaction-created="showTransactions()" />
            <!--End create transaction form-->
            <v-divider />
        </div>
        <v-row justify="center">
            <v-col v-for="trx in transactionsList" :key="trx.key" cols="12" sm="6" md="4">
                <v-card :elevation="1" max-width="344" outlined shaped>
                    <v-list-item four-line>
                        <v-list-item-content>
                            <v-list-item-title class="text-h5 mb-2 mt-2">
                                {{ trx.dsc }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <p class="mb-2"><strong>Fecha creación:</strong> {{ formatDate(trx.cre) }}</p>
                                <p class="mb-2"><strong>Monto:</strong> {{ parseAmount(trx.mnt, trx.cur) }}</p>
                                <p class="mb-1"><strong>Estado:</strong> {{ getStatusText(trx.sts) }}</p>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-avatar rounded size="80" color="sideBar">
                            <v-icon color="baseColor" x-large dark>
                                mdi-cash-fast
                            </v-icon>
                        </v-list-item-avatar>
                    </v-list-item>
                    <v-card-actions class="mb-2 pl-4">
                        <v-btn color="primary" small @click="showDetails(trx)">
                            Detalles
                        </v-btn>
                        <v-btn color="success" dark small>
                            Enviar QR
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <!-- Begin details dialog -->
        <v-dialog v-model="dialog" max-width="600">
            <v-card>
                <v-system-bar class="pt-6 pb-6" color="baseColor" dark>
                    <v-card-title>
                        <span class="text-h6">Detalles de la transacción</span>
                    </v-card-title>
                </v-system-bar>
                <v-card-text v-if="selectedTransaction">
                    <v-row class="mt-4">
                        <v-col cols="12" md="5" class="text-center" border-color="red">
                            <img class="border" :src="qrCodeUrl" alt="Código QR" width="200" height="200" />
                        </v-col>
                        <v-col cols="12" md="7">
                            <h2 class="mb-4">{{ selectedTransaction.dsc }}</h2>
                            <p class="mb-2">
                                <strong>One Time Password (OTP):</strong>
                                {{ selectedTransaction.otp }}
                            </p>
                            <p class="mb-2">
                                <strong>Fecha expiración:</strong>
                                {{ formatDate(selectedTransaction.exp) }}
                            </p>
                            <p class="mb-2">
                                <strong>Monto:</strong>
                                {{ parseAmount(selectedTransaction.mnt, selectedTransaction.cur) }}
                            </p>
                            <p class="">
                                <strong>Estado:</strong>
                                <v-badge color="green">{{ getStatusText(selectedTransaction.sts) }}</v-badge>
                            </p>
                        </v-col>
                    </v-row>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="danger" small dark @click="dialog = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!--End details dialog-->
    </v-container>
</template>

<script>
import QRCode from 'qrcode';
import CreateTransaction from './create-transaction.vue';

export default {
    name: "TransactionsList",
    components: {
        CreateTransaction,
    },
    data() {
        return {
            dialog: false,
            transactionsList: [],
            selectedTransaction: null,
            userName: '',
            qrCodeUrl: '',
        };
    },
    created() {
        this.showTransactions();
    },
    methods: {

        async showTransactions() {
            let url = "https://systemnavigator.site.claipayments.com:13018/web/services/ATW2893";
            let datos = { VUSER: '50684043853        17a86be379c4' };

            this.$axios.post(url, datos).then(response => {
                //Get transaction list
                let trxString = response.data.VDATA.substr(0, 1967) // [{ "user": "moralescr", "password": "1234" }] 

                //Se cambian comillas simples por dobles y se agrega corchetes 
                let jsonString = `[${trxString.replace(/'/g, '"')}]`;

                //Se parsea para convertir a formato JSON
                this.transactionsList = JSON.parse(jsonString);
            });
        },
        //Show transaction detail
        showDetails(trx) {
            this.selectedTransaction = trx;
            this.dialog = true;
            this.generateQR(this.selectedTransaction.key);
        },

        //Api to generate QR code (transaction key)
        async generateQR(transactionKey) {
            try {
                this.qrCodeUrl = await QRCode.toDataURL(transactionKey, { width: 200 })
            } catch (err) {
                console.error('Error to generate the QRCode:', err)
            }

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
        parseAmount(amount, currency) {
            let amountParse;
            if (currency === '188') {
                amountParse = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(amount / 100);
            } else {
                amountParse = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);
            }
            return amountParse;
        },
        formatDate(expirationDate) {
            const [fechaStr] = expirationDate.split(' ');      // "25/07/31"
            const [yy, mm, dd] = fechaStr.split('/');          // separa en partes
            const year = `20${yy}`;                            // convierte "25" → "2025"
            return `${dd}/${mm}/${year}`;                      // arma "31/07/2025"
        }
    },
}
</script>
<style scoped>
    .border {
        border: 1px solid #E0F2F1;
    }
</style>