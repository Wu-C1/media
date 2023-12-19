<template>
    <div class="upload-button-content">
        <el-button v-if="roundFlag" type="primary" id="uploadButton" :size="size" round @click="uploadDialogVisible = true">
            Upload<i class="el-icon-upload el-icon--right"/>
        </el-button>
        <el-button v-if="circleFlag" size="size" id="uploadButton" circle>
            <i class="el-icon-upload"/>
        </el-button>
        <div>
            <el-dialog
                    title="File upload"
                    :visible.sync="uploadDialogVisible"
                    width="30%"
                    :modal="false"
                    :append-to-body="true"
                    @opened="rebindUploader"
                    center>
                <div class="upload-content" id="upload-content">
                    <div class="drag-content">
                        <div class="drag-icon-content">
                            <i class="el-icon-upload drag-icon"></i>
                        </div>
                        <div class="drag-text-content">
                            <el-link :underline="false" type="info">Drag files here, or</el-link>
                            <el-link :underline="false" type="primary">Click to upload</el-link>
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

    import Uploader from 'simple-uploader.js'
    import {getToken} from '../../../utils/cookie'
    import panUtil from '../../../utils/common'
    import {MD5} from '../../md5'
    import fileService from '../../../api/file'
    import {mapActions, mapGetters, mapMutations} from 'vuex'

    export default {
        name: 'uploadButton',
        components: {},
        props: {
            roundFlag: Boolean,
            circleFlag: Boolean,
            size: String
        },
        data() {
            return {
                // 详细文档地址：https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md#%E9%85%8D%E7%BD%AE
                fileOptions: {
                    target: function (file, chunk) {
                        if (panUtil.getChunkSize() && panUtil.getChunkSize() > 0) {
                            return panUtil.getUrlPrefix() + '/file/chunk-upload'
                        }
                        return panUtil.getUrlPrefix() + '/file/upload'
                    },
                    singleFile: !panUtil.getChunkSize() || panUtil.getChunkSize() <= 0,
                    chunkSize: panUtil.getChunkSize(),
                    forceChunkSize: false,
                    simultaneousUploads: 3,
                    fileParameterName: 'file',
                    query: function (file, chunk) {
                        return {}
                    },
                    headers: {
                        Authorization: getToken()
                    },
                    checkChunkUploadedByResponse: function (chunk, message) {
                        let objMessage = {}
                        try {
                            objMessage = JSON.parse(message)
                        } catch (e) {
                        }
                        // fake response
                        // objMessage.uploaded_chunks = [2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 17, 20, 21]
                        // check the chunk is uploaded
                        return (objMessage.data.uploadedChunks || []).indexOf(chunk.offset + 1) >= 0
                    },
                    maxChunkRetries: 0,
                    chunkRetryInterval: null,
                    progressCallbacksInterval: 500,
                    successStatuses: [200, 201, 202],
                    permanentErrors: [404, 415, 500, 501],
                    initialPaused: false
                },
                uploader: undefined,
                uploadDialogVisible: false,
                assignFlag: false
            }
        },
        methods: {
            ...mapMutations({
                clearTaskList: 'task/clear',
                addTaskItem: 'task/add',
                removeTaskItem: 'task/remove',
                updateTaskStatus: 'task/updateStatus',
                updateTaskProcess: 'task/updateProcess',
                getUploadTask: 'task/getTask',
                updateTaskListViewFlag: 'task/updateViewFlag'
            }),
            ...mapActions({
                reloadFileList: 'file/loadFileList'
            }),
            rebindUploader() {
                if (!this.uploader.support) this.$message.error('本浏览器不支持simple-uploader，请更换浏览器重试')
                if (!this.assignFlag) {
                    this.uploader.assignBrowse(document.getElementById('upload-content'))
                    this.uploader.assignDrop(document.getElementById('upload-content'))
                    this.assignFlag = true
                }
            },
            initUploader() {
                this.clearTaskList()
                // 实例化一个上传对象
                this.uploader = new Uploader(this.fileOptions)
                // 如果不支持 需要降级的地方
                if (!this.uploader.support) this.$message.error('本浏览器不支持simple-uploader，请更换浏览器重试')
                // this.uploader.assignBrowse(document.getElementById('drag-text'))
                // this.uploader.assignDrop(document.getElementById('upload-content'))
                // 绑定进队列
                this.uploader.on("filesAdded", this.filesAdded)
                // 绑定进度
                this.uploader.on("fileProgress", this.uploadProgress)
                // 上传成功监听
                this.uploader.on("fileSuccess", this.fileUploaded)
                // 上传全部完成调用
                this.uploader.on("complete", this.uploadComplete)
                // 上传出错调用
                this.uploader.on("fileError", this.uploadError)
            },
            filesAdded(files, fileList, event) {
                // 插件在调用该方法之前会自动过滤选择的文件 去除正在上传的文件 新添加的文件就是第一个参数files
                let _this = this
                _this.uploadDialogVisible = false
                try {
                    files.forEach((f) => {
                        f.pause()
                        if (f.size > panUtil.getMaxFileSize()) {
                            throw new Error('文件：' + f.name + '大小超过了最大上传文件的限制（' + panUtil.translateFileSize(panUtil.getMaxFileSize()) + '）')
                        }
                        let taskItem = {
                            target: f,
                            filename: f.name,
                            fileSize: panUtil.translateFileSize(f.size),
                            uploadedSize: panUtil.translateFileSize(0),
                            status: panUtil.fileStatus.PARSING.code,
                            statusText: panUtil.fileStatus.PARSING.text,
                            timeRemaining: panUtil.translateTime(Number.POSITIVE_INFINITY),
                            speed: panUtil.translateSpeed(f.averageSpeed),
                            percentage: 0,
                            parentId: new String(_this.parentId)
                        }
                        // 添加
                        _this.addTaskItem(taskItem)
                        MD5(f.file, (e, md5) => {
                            f['uniqueIdentifier'] = md5
                            fileService.secUpload({
                                filename: f.name,
                                identifier: md5,
                                parentId: _this.parentId
                            }, res => {
                                if (res.status === 0) {
                                    _this.$message.success('文件：' + f.name + ' 上传完成')
                                    f.cancel()
                                    _this.removeTaskItem(f.name)
                                    _this.reloadFileList()
                                    if (_this.uploader.files.length === 0) {
                                        this.updateTaskListViewFlag(false)
                                    }
                                } else {
                                    f.resume()
                                    _this.updateTaskStatus({
                                        filename: f.name,
                                        status: panUtil.fileStatus.WAITING.code,
                                        statusText: panUtil.fileStatus.WAITING.text
                                    })
                                }
                            }, res => {
                                f.resume()
                                _this.updateTaskStatus({
                                    filename: f.name,
                                    status: panUtil.fileStatus.WAITING.code,
                                    statusText: panUtil.fileStatus.WAITING.text
                                })
                            })
                        })
                    })
                } catch (e) {
                    _this.$message.error(e.message)
                    _this.uploader.cancel()
                    _this.clearTaskList()
                    return false
                }
                _this.updateTaskListViewFlag(true)
                return true
            },
            uploadProgress(rootFile, file, chunk) {
                let uploadTaskItem = this.$store.getters.getUploadTask(file.name)
                if (file.isUploading()) {
                    if (uploadTaskItem.status !== panUtil.fileStatus.UPLOADING.code) {
                        this.updateTaskStatus({
                            filename: file.name,
                            status: panUtil.fileStatus.UPLOADING.code,
                            statusText: panUtil.fileStatus.UPLOADING.text
                        })
                    }
                    this.updateTaskProcess({
                        filename: file.name,
                        speed: panUtil.translateSpeed(file.averageSpeed),
                        percentage: Math.floor(file.progress() * 100),
                        uploadedSize: panUtil.translateFileSize(file.sizeUploaded()),
                        timeRemaining: panUtil.translateTime(file.timeRemaining())
                    })
                }

            },
            fileUploaded(rootFile, file, message, chunk) {
                let res = {},
                    _this = this
                try {
                    res = JSON.parse(message)
                } catch (e) {
                }
                if (res.status === 0) {
                    if (res.data.mergeFlag) {
                        _this.doMerge(file)
                    } else if (res.data.uploadedChunks && res.data.uploadedChunks.length === file.chunks.length) {
                        _this.doMerge(file)
                    }
                } else {
                    file.pause()
                    _this.updateTaskStatus({
                        filename: file.name,
                        status: panUtil.fileStatus.FAIL.code,
                        statusText: panUtil.fileStatus.FAIL.text
                    })
                }
            },
            uploadComplete() {

            },
            uploadError(rootFile, file, message, chunk) {
                this.updateTaskStatus({
                    filename: file.name,
                    status: panUtil.fileStatus.FAIL.code,
                    statusText: panUtil.fileStatus.FAIL.text
                })
                this.updateTaskProcess({
                    filename: file.name,
                    speed: panUtil.translateSpeed(0),
                    percentage: 0,
                    uploadedSize: panUtil.translateFileSize(0),
                    timeRemaining: panUtil.translateTime(Number.POSITIVE_INFINITY)
                })
            },
            doMerge(file) {
                let _this = this,
                    uploadTaskItem = _this.$store.getters.getUploadTask(file.name)
                _this.updateTaskStatus({
                    filename: file.name,
                    status: panUtil.fileStatus.MERGE.code,
                    statusText: panUtil.fileStatus.MERGE.text
                })
                _this.updateTaskProcess({
                    filename: file.name,
                    speed: panUtil.translateSpeed(file.averageSpeed),
                    percentage: 99,
                    uploadedSize: panUtil.translateFileSize(file.sizeUploaded()),
                    timeRemaining: panUtil.translateTime(file.timeRemaining())
                })
                fileService.merge({
                    filename: uploadTaskItem.filename,
                    identifier: uploadTaskItem.target.uniqueIdentifier,
                    parentId: uploadTaskItem.parentId,
                    totalSize: uploadTaskItem.target.size
                }, res => {
                    _this.$message.success('文件：' + file.name + ' 上传完成')
                    _this.uploader.removeFile(file)
                    _this.removeTaskItem(file.name)
                    _this.reloadFileList()
                    if (_this.uploader.files.length === 0) {
                        this.updateTaskListViewFlag(false)
                    }
                }, res => {
                    file.pause()
                    _this.updateTaskStatus({
                        filename: file.name,
                        status: panUtil.fileStatus.FAIL.code,
                        statusText: panUtil.fileStatus.FAIL.text
                    })
                })
            }
        },
        computed: {
            ...mapGetters(['parentId'])
        },
        mounted() {
            this.initUploader()
        },
        watch: {}
    }
</script>

<style>
    .upload-button-content {
        display: inline-block;
        margin-right: 10px;
    }
    .upload-content {
        width: 100%;
        height: 300px;
        line-height: 300px;
        display: flex;
        justify-content: center;
    }
    .upload-content .drag-content {
        border: 0.2em dashed #DCDFE6;
        border-radius: 1em;
        width: 80%;
        height: 250px;
        line-height: 250px;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .upload-content .drag-content:hover {
        border: 0.2em dashed #409EFF;
    }

    .upload-content .drag-content .drag-icon-content {
        height: 100px;
        line-height: 100px;
        width: 100px;
        margin-top: 25px;
    }

    .upload-content .drag-content .drag-icon-content .drag-icon {
        font-size: 7em;
        color: #DCDFE6;
    }

    .upload-content .drag-content .drag-text-content {
        display: block;
        height: 30px;
        line-height: 30px;
    }
</style>