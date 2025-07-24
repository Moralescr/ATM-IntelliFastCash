<template>
    <v-container>
        <v-row justify="center">
            <v-col v-for="trx in transactionsList" :key="trx.key">
                <v-card :elevation="1" max-width="344" outlined shaped>
                    <v-list-item three-line>
                        <v-list-item-content>
                            <div class="text-overline mb-4">
                                Info. transacción
                            </div>
                            <v-list-item-title class="text-h5 mb-1">
                                {{ trx.dsc }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                Fecha: {{ trx.cre }}
                                <br>
                                Monto: {{ trx.mnt / 100 }} USD
                                <br>
                                Status: {{ trx.sts }}
                            </v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-avatar tile size="80" color="qrCode">
                            <v-icon large dark>
                                mdi-qrcode
                            </v-icon>
                        </v-list-item-avatar>
                    </v-list-item>

                    <v-card-actions>
                        <v-btn @click="showDetails(trx)" rounded color="primary">
                            Ver detalle
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <!-- Begin dialog -->
        <v-dialog v-model="dialog" max-width="500">
            <v-card>
                <v-card-title>
                    Detalles de la transacción
                </v-card-title>
                <v-card-text v-if="selectedTransaction">
                    <p><strong>Descripción:</strong> {{ selectedTransaction.dsc }}</p>
                    <p><strong>Fecha:</strong> {{ selectedTransaction.exp }} </p>
                    <p><strong>Monto:</strong> {{ selectedTransaction.mnt / 100 }} USD </p>
                    <p><strong>Estado:</strong> {{ selectedTransaction.sts }}</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="danger" text @click="dialog = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!--End dialog-->
        <!--Begin create transaction form-->
            <create-transaction/>
        <!--End create transaction form-->
    </v-container>
</template>

<script>
import CreateTransaction from './create-transaction.vue';

export default {
    name: "TransactionsList",
    components: {
        CreateTransaction
    },
    data() {
        return {
            dialog: false,
            dialog1: false,
            transactionsList: [],
            selectedTransaction: null,
            userName: '',
        };
    },
    created() {
        this.showTransactions();
    },
    methods: {

        showTransactions() {
            let url = "https://systemnavigator.site.claipayments.com:13018/web/services/ATW2893";
            let datos = { VUSER: '50684043853        17a86be379c4' };

            this.$axios.post(url, datos).then(response => {
                //Se obtiene la data.
                let trxString = response.data.VDATA.substr(0, 1967) // [{ "user": "moralescr", "password": "1234" }] 

                //Se cambian comillas simples por dobles y se agrega corchetes 
                let jsonString = `[${trxString.replace(/'/g, '"')}]`;

                console.log(jsonString);
                //Se parsea para convertir a formato JSON
                this.transactionsList = JSON.parse(jsonString);
            });
        },
        showDetails(trx) {
            this.selectedTransaction = trx;
            this.dialog = true;
        },
        createTransaction() {
        
        },
    },
}
</script>
