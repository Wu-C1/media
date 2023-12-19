import fileService from '../../../api/file'
import { Message } from 'element-ui'

const file = {
    namespaced: true,
    state: {
        parentId: '',
        defaultParentId: '',
        defaultParentFilename: '',
        fileList: [],
        fileListAll: [],
        multipleSelection: [],
        fileTypes: '-1',
        searchFlag: false,
        searchKey: '',
        tableLoading: true
    },
    mutations: {
        setFileParentId(state, parentId) {
            state.parentId = parentId
        },
        refreshFileParentId(state) {
            state.parentId = state.defaultParentId
        },
        setFileDefaultParentId(state, defaultParentId) {
            state.defaultParentId = defaultParentId
        },
        setDefaultParentFilename(state, defaultParentFilename) {
            state.defaultParentFilename = defaultParentFilename
        },
        setFileList(state, fileList) {
            state.fileList = fileList
        },
        setFileListAll(state, fileListAll) {
            state.fileListAll = fileListAll
        },

        setMultipleSelection(state, multipleSelection) {
            state.multipleSelection = multipleSelection
        },
        setFileTypes(state, fileTypes) {
            state.fileTypes = fileTypes
        },
        setSearchFlag(state, searchFlag) {
            if (!searchFlag) {
                state.searchKey = ''
            }
            state.searchFlag = searchFlag
        },
        setSearchKey(state, searchKey) {
            state.searchKey = searchKey
        },
        setTableLoading(state, tableLoading) {
            state.tableLoading = tableLoading
        },
        clear(state) {
            state.parentId = ''
            state.defaultParentId = ''
            state.defaultParentFilename = ''
            state.fileList = new Array()
            state.multipleSelection = new Array()
            state.fileTypes = '-1'
            state.searchFlag = false
            state.searchKey = ''
            state.tableLoading = true
        }
    },
    actions: {
        loadFileList({ commit, state }) {
            commit('setTableLoading', true)
            if (state.searchFlag) {
                fileService.search({
                    keyword: state.searchKey,
                    fileTypes: '-1'
                }, res => {
                    commit('setFileList', res.data)
                    commit('setTableLoading', false)
                }, res => {
                    commit('setTableLoading', false)
                    Message.error(res.message)
                })
            } else {
                fileService.list({
                    parentId: state.parentId,
                    fileTypes: state.fileTypes
                }, res => {
                    commit('setTableLoading', false)
                    commit('setFileList', res.data)
                }, res => {
                    commit('setTableLoading', false)
                    Message.error(res.message)
                })
            }
        },
        loadFileListAll({ commit, state }) {
            commit('setTableLoading', true)
            fileService.listAll({
                parentId: state.parentId,
                fileTypes: state.fileTypes
            }, res => {
                commit('setTableLoading', false)
                commit('setFileListAll', res.data)
            }, res => {
                commit('setTableLoading', false)
                Message.error(res.message)
            })
        },
    }
}

export default file