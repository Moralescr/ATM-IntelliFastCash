<template>
  <v-container>
    <div class="pb-4">
      <v-divider />
      <!--Begin create transaction form-->
      <create-transaction @transaction-created="getCreateTrxResponse" />
      <!--End create transaction form-->
      <v-divider />
      <!--Begin Alerts-->
      <app-snack-bar v-model="snackbarVisible" :message="snackbarMessage" :color="snackbarColor" :timeout="3000" />
      <!--End Alerts-->
    </div>
    <!-- Loading State -->
    <v-row v-if="isLoading" class="pa-3">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="20"></v-progress-circular>
      </v-col>
    </v-row>
    <!-- No Transactions State -->
    <v-row v-else-if="transactionsList.length === 0" class="pa-3">
      <v-col cols="12" class="text-center">
        <v-alert type="info"> No hay transacciones disponibles </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="trx in transactionsList" :key="trx.key" cols="12" sm="6" md="4" lg="3">
        <v-card class="elevation-6" shaped>
          <!-- Title -->
          <v-card-title class="title px-4">
            <div class="text-h5 font-weight-bold">
              <v-badge :color="getStatusColor(trx.sts)" dot>
                {{ trx.dsc }}
              </v-badge>

            </div>
          </v-card-title>
          <!-- Content -->
          <v-card-text class="px-4">
            <div class="mt-3 mb-1 text-body-2">
              <strong>Creación:</strong> 
              {{ parseDate(trx.cre) }}
            </div>
            <div class="mb-0 mb-1 text-body-2">
              <strong>Monto:</strong> 
              {{ parseAmount(trx.mnt, trx.cur) }}
            </div>
            <div class="mb-0 text-body-2">
              <strong>Estado: </strong>
              {{ getStatusText(trx.sts) }}
            </div>
          </v-card-text>
          <!-- Actions -->
          <v-card-actions class="px-4 py-4 pt-0">
            <v-btn color="primary" variant="flat" small @click="selectedTransaction = trx">
              Detalles
            </v-btn>
            <v-btn color="error" variant="flat" small>
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <!--Begin transaction detail-->
    <transaction-detail v-if="selectedTransaction" :transaction="selectedTransaction" @closed="closeDialog" />
    <!--Begin transaction detail-->
  </v-container>
</template>

<script>
//import QRCode from 'qrcode';
import CreateTransaction from "./create-transaction.vue";
import appSnackBar from "./app-snack-bar.vue";
import TransactionDetail from "./transaction-detail.vue";
import { getStatusColor, getStatusText, parseAmount, parseDate } from "@/js/parseData";

export default {
  name: "TransactionsList",
  components: {
    CreateTransaction,
    appSnackBar,
    TransactionDetail,
  },
  data() {
    return {
      isLoading: false,
      transactionsList: [],
      selectedTransaction: null,
      userName: "",
      snackbarVisible: false,
      snackbarMessage: "",
      snackbarColor: "",
    };
  },
  computed: {},
  mounted() {
    //Refresh data
    this.interval = setInterval(() => {
      this.showTransactions();
      this.isLoading = false;
    }, 5000);
  },
  beforeDestroy() {
    //Destroy interval
    clearInterval(this.interval);
  },
  created() {
    this.showTransactions();
  },
  methods: {
    getStatusText,
    getStatusColor,
    parseAmount,
    parseDate,
    async showTransactions() {
      this.isLoading = true;
      let url =
        "https://systemnavigator.site.claipayments.com:13018/web/services/ATW2893";
      let datos = { VUSER: "50684043853        17a86be379c4" };
      try {
        const response = await this.$axios.post(url, datos);
        //Get transaction list
        let trxString = response.data.VDATA.substr(0, 1967); // [{ "user": "moralescr", "password": "1234" }]
        //Se cambian comillas simples por dobles y se agrega corchetes
        let jsonString = `[${trxString.replace(/'/g, '"')}]`;
        //Se parsea para convertir a formato JSON
        this.transactionsList = JSON.parse(jsonString);
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    getCreateTrxResponse(trxCreated) {
      this.snackbarVisible = true;
      if (trxCreated) {
        this.snackbarColor = "success";
        this.snackbarMessage = "Transacción creada exitosamente";
      } else {
        this.snackbarColor = "danger";
        this.snackbarMessage = "Error al crear la transacción";
      }
      // Refresh transactions list
      this.showTransactions();
    },
    closeDialog() {
      // Reset transaction selected when tah dialog was closed
      this.selectedTransaction = null;
    },
  },
};
</script>
<style scoped>
.title {
  background-color: #E0F2F1;
  -webkit-text-fill-color: #455A64;
}
</style>
