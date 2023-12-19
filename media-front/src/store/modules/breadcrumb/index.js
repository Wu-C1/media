const breadcrumb = {
    namespaced: true,
    state: {
        breadCrumbs: new Array()
    },
    mutations: {
        clear(state) {
            state.breadCrumbs = new Array()
        },
        addItem(state, item) {
            state.breadCrumbs.push(item)
        },
        reset(state, newBreadCrumbs) {
            state.breadCrumbs = newBreadCrumbs
        }
    }
}

export default breadcrumb