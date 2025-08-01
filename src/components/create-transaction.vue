<template>
    <v-container class="d-inline-flex">
        <!--Begin form-->
        <v-dialog v-model="dialog" persistent max-width="400px">
            <template v-slot:activator="{ on, attrs }">
                <v-btn color="success" small v-bind="attrs" v-on="on" dark>
                    <v-icon small>mdi-plus</v-icon>
                    Crear
                </v-btn>
            </template>

            <v-card>
                <v-system-bar class="pt-6 pb-6" color="baseColor" dark>
                    <v-card-title>
                        <span class="text-h6">Crear transacción</span>
                    </v-card-title>
                </v-system-bar>
                <v-form @submit.prevent="createTransaction()">
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-select v-model="trxType" label="Tipo de transacción" :items="trxTypes"
                                        required></v-select>
                                </v-col>
                                <v-col v-if="!showDestinyAccount" cols="12">
                                    <v-text-field v-model="trxAmount" label="Monto de la transacción" type="number"
                                        placeholder="ej. $20" required></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-select v-model="trxCurrency" label="Tipo de moneda" :items="currecyTypes"
                                        required></v-select>
                                </v-col>
                                <v-col cols="12">
                                    <v-select v-model="trxSourceAccount" label="Tarjeta o cuenta origen"
                                        :items="cardNumbers" required></v-select>
                                </v-col>
                                <v-col v-if="showDestinyAccount" cols="12">
                                    <v-select v-model="trxDestinationAccount" label="Cuenta destino"
                                        :items="accountNumbers" required></v-select>
                                </v-col>
                            </v-row>
                        </v-container>
                        <!--<small>*indicates required field</small>-->
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="danger" dark small @click="dialog = false">
                            Cerrar
                        </v-btn>
                        <v-btn type="submit" color="success" small dark @click="dialog = false">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <!--End form-->
    </v-container>
</template>

<script>
export default {
    name: 'CreateTransaction',

    data() {
        return {
            dialog: false,
            trxTypes: ['Retiro efectivo', 'Depósito', 'Pago de tarjeta'],
            currecyTypes: ['Dólares', 'Colones'],
            cardNumbers: ['4941906925121370', '5303150116100096'],
            accountNumbers: ['28010200009427768160', 'CR232323232323232323'],
            //Form variables
            trxType: '',
            trxAmount: 0,
            trxCurrency: '',
            trxSourceAccount: '',
            trxDestinationAccount: '000000000000000000000',
        };
    },

    mounted() {

    },

    computed: {
        showDestinyAccount() {
            return this.trxType === 'Pago de tarjeta' || this.trxType === 'Depósito'; // Use trxType because is the user selection
        },
    },

    watch: {
        trxType(transaction) {
            if (transaction !== 'Pago de tarjeta' || transaction !== 'Depósito') {
                this.trxDestinationAccount = '000000000000000000000'; // Initialize value
            }
        },
    },

    methods: {
        createTransaction() {
            // Set default data
            let vTrxCode = '';
            let vOperationCode = '';
            let vDescription = '';
            let now = new Date();
            const vCurrentDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
            const vCurrentHour = now.toTimeString().slice(0, 8).replace(/:/g, '');

            //Set transaction code values, operation codes and description
            if (this.trxType === 'Retiro efectivo') {
                vTrxCode = '011000'; //withdraw
                vOperationCode = '    GAAA';
                vDescription = 'Retiro ATM';
            } else if (this.trxType === 'Depósito') {
                vTrxCode = '21001Q'; //Deposit
                vOperationCode = '    GBAB';
                vDescription = 'Depósito ATM';
            } else {
                vTrxCode = '20001Q'; //Card Payment
                vOperationCode = '    GCAA';
                vDescription = 'Pago de tarjeta ATM';
            }

            // Set currency code 
            if (this.trxCurrency === 'Dólares') {
                this.trxCurrency = '840'
            } else {
                this.trxCurrency = '188'
            }

            // Web service date
            let url = "https://systemnavigator.site.claipayments.com:13018/web/services/ATW2892";
            let datos = {
                "VTRXCOD_": vTrxCode,
                "VOPRCOD_": vOperationCode,
                "VAMOUNT_": this.trxAmount,
                "VUSER_": "50684043853        17a86be379c4",
                "VINIDAT_": vCurrentDate,
                "VINIHOR_": vCurrentHour,
                "VCURR_": this.trxCurrency,
                "VPANSRC_": this.trxSourceAccount,
                "VPANDES_": this.trxDestinationAccount,
                "VDESC_": vDescription,
                "VREC_": "S",
                "VPAGTAR_": " "
            };
            console.log("DATOS:", datos);

            this.$axios.post(url, datos).then(response => {
                //Get response
                console.log('RESPONSE: ', response);
                this.resetForm();
                this.$emit('transaction-created'); //Send event to show the trx list: Transaction was created
            });
        },

        resetForm() {
            this.trxType = '';
            this.trxAmount = 0;
            this.trxCurrency = '';
            this.trxSourceAccount = '';
            this.trxDestinationAccount = '000000000000000000000';
        },

    },
};
</script>