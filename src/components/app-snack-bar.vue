<template>
    <v-snackbar class="custom-alert" v-model="visible" :color="color" :timeout="timeout" top right>
        {{ message }}
    </v-snackbar>
</template>

<script>
export default {
    name: 'AppSnackbar',
    props: {
        value: Boolean,
        message: {
            type: String,
            default: '',
        },
        color: {
            type: String,
            default: 'success',
        },
        timeout: {
            type: Number,
            default: 3000,
        }
    },
    computed: {
        visible: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val); 
            }
        }
    }
}
</script>
<style scoped>

.custom-alert{
    margin-top: 60px;
    margin-right: 15px;
}

</style>
