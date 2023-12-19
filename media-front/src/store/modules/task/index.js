import panUtil from '../../../utils/common'

const task = {
    namespaced: true,
    state: {
        taskList: new Array(),
        viewFlag: false
    },
    mutations: {
        clear(state) {
            state.taskList = new Array()
            state.viewFlag = false
        },
        add(state, taskItem) {
            state.taskList.push(taskItem)
        },
        remove(state, filename) {
            for (let i = 0; i < state.taskList.length; i++) {
                if (filename === state.taskList[i].filename) {
                    state.taskList.splice(i, 1)
                    break
                }
            }
        },
        updateStatus(state, param) {
            let taskItem = state.taskList.find(taskItem => param.filename === taskItem.filename)
            taskItem.status = param.status
            taskItem.statusText = param.statusText
        },
        updateProcess(state, param) {
            let taskItem = state.taskList.find(taskItem => param.filename === taskItem.filename)
            taskItem.speed = param.speed
            taskItem.percentage = param.percentage
            taskItem.uploadedSize = param.uploadedSize
            taskItem.timeRemaining = param.timeRemaining
        },
        pause(state, filename) {
            let taskItem = state.taskList.find(taskItem => filename === taskItem.filename)
            taskItem.target.pause()
            taskItem.status = panUtil.fileStatus.PAUSE.code
            taskItem.statusText = panUtil.fileStatus.PAUSE.text
        },
        resume(state, filename) {
            let taskItem = state.taskList.find(taskItem => filename === taskItem.filename)
            taskItem.target.resume()
        },
        cancel(state, filename) {
            for (let i = 0; i < state.taskList.length; i++) {
                if (filename === state.taskList[i].filename) {
                    state.taskList[i].target.cancel()
                    state.taskList.splice(i, 1)
                    if (state.taskList.length === 0) {
                        state.viewFlag = false
                    }
                    break
                }
            }
        },
        retry(state, filename) {
            let taskItem = state.taskList.find(taskItem => filename === taskItem.filename)
            taskItem.target.bootstrap()
            taskItem.target.resume()
        },
        updateViewFlag(state, viewFlag) {
            state.viewFlag = viewFlag
        },
        changeViewFlag(state) {
            state.viewFlag = !state.viewFlag
        }
    }
}

export default task