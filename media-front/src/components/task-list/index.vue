<template>
    <div>
        <el-badge :max="99" :value="uploadTaskNum" :hidden="uploadTaskFlag" class="item" type="danger">
            <el-popover
                    title="Upload task list"
                    placement="bottom-end"
                    width="600"
                    trigger="manual"
                    :value="taskListViewFlag"
            >
                <div class="pan-upload-task-items-content">
                    <el-table
                            empty-text="There are currently no transmission tasks"
                            :data="uploadTaskList"
                            height="300px"
                            style="width: 100%">
                        <el-table-column
                                align="center"
                                header-align="center"
                                label="File Name"
                                prop="filename"
                                width="120"
                                :show-overflow-tooltip="true"
                        >
                        </el-table-column>
                        <el-table-column
                                align="center"
                                header-align="center"
                                label="文件状态"
                                width="120">
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="top">
                                    <p>状态: {{ scope.row.statusText }}</p>
                                    <div slot="reference" class="name-wrapper">
                                        <el-button v-show="scope.row.status === fileStatus.WAITING.code" size="mini" icon="el-icon-watch" circle></el-button>
                                        <el-button v-show="scope.row.status === fileStatus.PAUSE.code" size="mini" type="warning" icon="el-icon-video-play" circle></el-button>
                                        <el-button v-show="scope.row.status === fileStatus.UPLOADING.code" size="mini" type="success" icon="el-icon-upload2" circle></el-button>
                                        <el-button v-show="scope.row.status === fileStatus.FAIL.code" size="mini" type="danger" icon="el-icon-error" circle></el-button>
                                        <el-button v-show="scope.row.status === fileStatus.PARSING.code" size="mini" type="info" icon="el-icon-loading" circle></el-button>
                                        <el-button v-show="scope.row.status === fileStatus.MERGE.code" size="mini" type="primary" icon="el-icon-cpu" circle></el-button>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                header-align="center"
                                label="上传进度"
                                width="180">
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="top">
                                    <p>上传速度: {{ scope.row.speed }} </p>
                                    <p>上传大小: {{ scope.row.uploadedSize }}/{{ scope.row.fileSize }} </p>
                                    <p>剩余时间: {{ scope.row.timeRemaining }} </p>
                                    <div slot="reference" class="name-wrapper">
                                        <el-progress :stroke-width="13" :color="colors" :percentage="scope.row.percentage"></el-progress>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                header-align="center"
                                label="操作"
                                width="180">
                            <template slot-scope="scope">
                                <el-tooltip v-show="scope.row.status === fileStatus.UPLOADING.code" class="item"
                                            effect="light" content="Pause upload" placement="top">
                                    <el-button @click="pauseUpload(scope.row.filename)" size="mini" type="info"
                                               icon="el-icon-video-pause" circle></el-button>
                                </el-tooltip>
                                <el-tooltip v-show="scope.row.status === fileStatus.PAUSE.code" class="item"
                                            effect="light" content="Continue uploading" placement="top">
                                    <el-button @click="resumeUpload(scope.row.filename)" size="mini" type="success"
                                               icon="el-icon-video-play" circle></el-button>
                                </el-tooltip>
                                <el-tooltip v-show="scope.row.status === fileStatus.UPLOADING.code || scope.row.status === fileStatus.WAITING.code || scope.row.status === fileStatus.PAUSE.code" class="item"
                                            effect="light" content="Cancel upload" placement="top">
                                    <el-button @click="cancelUpload(scope.row.filename)" size="mini"
                                               icon="el-icon-error" circle></el-button>
                                </el-tooltip>
                                <el-tooltip v-show="scope.row.status === fileStatus.FAIL.code" class="item"
                                            effect="light" content="Re upload" placement="top">
                                    <el-button @click="retryUpload(scope.row.filename)" size="mini" type="warning"
                                               icon="el-icon-refresh-right" circle></el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-button slot="reference" @click="changeTaskListView" size="small" icon="el-icon-sort"></el-button>
            </el-popover>
        </el-badge>
    </div>
</template>

<script>

    import panUtil from '../../utils/common'
    import {mapMutations, mapGetters} from 'vuex'

    export default {
        name: "PanTaskList",
        data() {
            return {
                colors: [
                    {color: '#909399', percentage: 30},
                    {color: '#e6a23c', percentage: 70},
                    {color: '#67c23a', percentage: 100}
                ],
                fileStatus: panUtil.fileStatus
            }
        },
        methods: {
            ...mapMutations({
                pauseTask: 'task/pause',
                resumeTask: 'task/resume',
                cancelTask: 'task/cancel',
                retryTask: 'task/retry',
                changeTaskListView: 'task/changeViewFlag'
            }),
            pauseUpload(filename) {
                this.pauseTask(filename)
            },
            resumeUpload(filename) {
                this.resumeTask(filename)
            },
            cancelUpload(filename) {
                this.cancelTask(filename)
                this.$message.info('文件：' + filename + ' 取消上传')
            },
            retryUpload(filename) {
                this.retryTask(filename)
            }
        },
        computed: {
            ...mapGetters(['uploadTaskFlag', 'uploadTaskNum', 'uploadTaskList', 'taskListViewFlag'])
        },
        mounted() {
        },
        watch: {}
    }
</script>

<style scoped>
    .pan-upload-task-items-content {
        height: 300px;
    }

    .pan-upload-task-items-content .infinite-list {
        height: 100%;
        overflow: auto;
    }

    .el-badge.item {
        line-height: 38px;
    }
</style>