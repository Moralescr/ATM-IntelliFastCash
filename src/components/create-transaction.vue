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
                <v-form ref="form" v-model="valid">
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-select v-model="trxType" label="Tipo de transacción" :items="trxTypes"
                                        :rules="trxTypeRules" required></v-select>
                                </v-col>
                                <v-col v-if="!showDestinationAccount" cols="12">
                                    <v-text-field v-model="trxAmount" label="Monto de la transacción" type="number"
                                        placeholder="ej. $20" :rules="trxAmountRules" required></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-select v-model="trxCurrency" label="Tipo de moneda" :items="currecyTypes"
                                        :rules="trxCurrencyRules"></v-select>
                                </v-col>
                                <v-col cols="12">
                                    <v-select v-model="trxSourceAccount" label="Tarjeta o cuenta origen"
                                        :items="cardNumbers" :rules="trxSourceAccountRules"></v-select>
                                </v-col>
                                <v-col v-if="showDestinationAccount" cols="12">
                                    <v-select v-model="trxDestinationAccount" label="Cuenta destino"
                                        :items="accountNumbers" :rules="destinationAccountRules"></v-select>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="danger" @click="closeDialog" dark small>
                            Cerrar
                        </v-btn>
                        <v-btn color="success" @click="validateForm" small dark>
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
            valid: false,
            dialog: false,
            trxCreated: false,
            trxTypes: ['Retiro efectivo', 'Depósito', 'Pago de tarjeta'],
            currecyTypes: ['Dólares', 'Colones'],
            cardNumbers: ['4941906925121370', '5303150116100096'],
            accountNumbers: ['28010200009427768160', 'CR232323232323232323'],
            //Form variables
            trxType: '',
            trxAmount: 0,
            trxCurrency: '',
            trxSourceAccount: '',
            trxDestinationAccount: '',
            trxTypeRules: [
                trxType => !!trxType || 'Tipo de transacción es requerido',
            ],
            trxAmountRules: [
                trxAmount => !!trxAmount || 'El monto es requerido',
                //trxAmount => trxAmount.length <= 12 || 'Máximo 12 digitos'
            ],
            trxCurrencyRules: [
                trxCurrency => !!trxCurrency || 'La moneda es requerida',
            ],
            trxSourceAccountRules: [
                trxSourceAccount => !!trxSourceAccount || 'La cuenta/tarjeta origen es requerida',
            ],
        };
    },
    computed: {
        showDestinationAccount() {
            if (this.trxType === 'Pago de tarjeta' || this.trxType === 'Depósito') {
                return true;
            }
            return false;
            //return this.trxType === 'Pago de tarjeta' || this.trxType === 'Depósito'; // Use trxType because is the user selection
        },
        // Validate field value to Account destination when this is visible 
        destinationAccountRules() {
            return [
                value => {
                    if (!this.showDestinationAccount) return true;
                    return !!value || 'La cuenta destino es requerida';
                }
            ]
        }
    },
    watch: {
        trxType(transaction) {
            if (transaction !== 'Pago de tarjeta' || transaction !== 'Depósito') {
                // Reset values
                this.trxDestinationAccount = '';
                this.trxAmount = 0;
            }
        },
    },
    methods: { 
        closeDialog() {
            this.dialog = false;
            this.$nextTick(() => {
                this.$refs.form.reset()
                this.$refs.form.resetValidation();
            })
        },
        validateForm() {
            if (this.$refs.form.validate()) {
                this.createTransaction();              // Call API to create transaction
                this.closeDialog();                    // Close dialog form 
                this.$nextTick(() => {
                    this.$refs.form.reset();           // Clear form field values 
                    this.$refs.form.resetValidation(); // Clear form validations messsages
                })
            }
        },
        async createTransaction() {
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
                vDescription = 'Pago tarjeta ATM';
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
            try {
                const response = await this.$axios.post(url, datos);
                if (response.status == 200){
                    this.trxCreated = true;
                }
                this.$emit('transaction-created', this.trxCreated);
            } catch (error) {
                this.$emit('transaction-created', this.trxCreated);
                console.log('Erroro:', error);
            }

        },

    },
};
</script>