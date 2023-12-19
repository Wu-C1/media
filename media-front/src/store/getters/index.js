const getters = {
    active: state => state.navbar.active,
    parentId: state => state.file.parentId === '-1' ? state.file.defaultParentId : state.file.parentId,
    defaultParentId: state => state.file.defaultParentId,
    defaultParentFilename: state => state.file.defaultParentFilename,
    fileList: state => state.file.fileList,
    fileListAll: state => state.file.fileListAll,
    multipleSelection: state => state.file.multipleSelection,
    fileTypes: state => state.file.fileTypes,
    breadCrumbs: state => state.breadcrumb.breadCrumbs,
    searchFlag: state => state.file.searchFlag,
    username: state => state.user.username,
    cacheSearchKey: state => state.file.searchKey,
    tableLoading: state => state.file.tableLoading,
    uploadTaskFlag: state => state.task.taskList.length <= 0,
    uploadTaskNum: state => state.task.taskList.length,
    uploadTaskList: state => state.task.taskList,
    taskListViewFlag: state => state.task.viewFlag,
    getUploadTask: state => (filename) => {
        return state.task.taskList.find(taskItem => filename === taskItem.filename)
    }
}

export default getters