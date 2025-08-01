import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
//import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({

    theme: {
        themes: {
            light: {
                success: '#43A047',
                primary: '#039BE5',
                danger: '#EF5350',
                baseColor: '#00897B',
                sideBar: '#E0F2F1',
                qrCode: '#90A4AE',
                userPhoto: '#CFD8DC',
                //secondary: colors.red.lighten4, 
            },
        },
    },
});
