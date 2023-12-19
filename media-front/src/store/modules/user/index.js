const user = {
    namespaced: true,
    state: {
        username: ''
    },
    mutations: {
        setUsername(state, username) {
            state.username = username
        },
        clear(state) {
            state.username = ''
        }
    }
}

export default user