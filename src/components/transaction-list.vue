<template>
    <v-container>
        <div class="pb-4">
            <v-divider />
            <!--Begin create transaction form-->
            <create-transaction @transaction-created="getCreateTrxResponse" />
            <!--End create transaction form-->
            <v-divider />
            <!--Begin Alerts-->
            <app-snack-bar v-model="snackbarVisible" :message="snackbarMessage" :color="snackbarColor"
                :timeout="3000" />
            <!--End Alerts-->
        </div>
        <v-row justify="center">
            <v-col v-for="trx in transactionsList" :key="trx.key" cols="12" sm="6" md="4">
                <v-card :elevation="6" max-width="344" outlined shaped>
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
                        <v-btn color="primary" small @click="selectedTransaction = trx">
                            Detalles
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <!--Begin transaction detail-->
        <transaction-detail v-if="selectedTransaction" :transaction="selectedTransaction" @closed="closeDialog"/>
        <!--Begin transaction detail-->
    </v-container>
</template>

<script>
//import QRCode from 'qrcode';
import CreateTransaction from './create-transaction.vue';
import appSnackBar from './app-snack-bar.vue';
import TransactionDetail from './transaction-detail.vue';

export default {
    name: "TransactionsList",
    components: {
        CreateTransaction,
        appSnackBar,
        TransactionDetail
    },
    data() {
        return {
            transactionsList: [],
            selectedTransaction: null,
            userName: '',
            snackbarVisible: false,
            snackbarMessage: '',
            snackbarColor: ''
        };
    },
    mounted() {
        //Refresh data 
        this.interval = setInterval(() => {
            this.showTransactions();
        }, 5000)
    },
    beforeDestroy() {
        //Destroy interval
        clearInterval(this.interval);
    },
    created() {
        this.showTransactions();
    },
    methods: {
        async showTransactions() {
            let url = "https://systemnavigator.site.claipayments.com:13018/web/services/ATW2893";
            let datos = { VUSER: '50684043853        17a86be379c4' };
            try {
                const response = await this.$axios.post(url, datos);
                //Get transaction list
                let trxString = response.data.VDATA.substr(0, 1967) // [{ "user": "moralescr", "password": "1234" }] 
                //Se cambian comillas simples por dobles y se agrega corchetes 
                let jsonString = `[${trxString.replace(/'/g, '"')}]`;
                //Se parsea para convertir a formato JSON
                this.transactionsList = JSON.parse(jsonString);
            } catch (error) {
                console.log(error);
            }
        },
        getCreateTrxResponse(trxCreated) {
            this.snackbarVisible = true;
            if (trxCreated) {
                this.snackbarColor = 'success';
                this.snackbarMessage = 'Transacción creada exitosamente';
            } else {
                this.snackbarColor = 'danger';
                this.snackbarMessage = 'Error al crear la transacción';
            }
            // Refresh transactions list
            this.showTransactions();
        },
        closeDialog(){
            // Reset transaction selected when tah dialog was closed
            this.selectedTransaction = null;
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
        formatDate(dateToFormat) {
            const [fechaStr] = dateToFormat.split(' ');      // "25/07/31"
            const [yy, mm, dd] = fechaStr.split('/');          // separa en partes
            const year = `20${yy}`;                            // convierte "25" → "2025"
            return `${dd}/${mm}/${year}`;                      // arma "31/07/2025"
        },
    },
}
</script>
<style scoped>
.border {
    border: 1px solid #E0F2F1;
}
</style>