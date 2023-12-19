import router from '../../../router'

const navbar = {
    namespaced: true,
    state: {
        active: 'Files'
    },
    mutations: {
        changeNavBar(state, active) {
            state.active = active
            router.push({name: active})
        },
        clear(state) {
            state.active = 'Files'
        }
    }
}

export default navbar