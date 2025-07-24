import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
//import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({

    theme: {
        themes: {
            light: {
                primary: '#42A5F5',
                danger: '#EF5350',
                qrCode: '#90A4AE',
                //secondary: colors.red.lighten4, 
            },
        },
    },
});
