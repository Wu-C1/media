<template>
    <div class="download-button-content">
        <el-button v-if="roundFlag" type="danger" :size="size" round @click="deleteFile">
            Delete<i class="el-icon-delete el-icon--right"/>
        </el-button>
        <el-button v-if="circleFlag" type="danger" :size="size" circle @click="deleteFile">
            <i class="el-icon-delete"/>
        </el-button>
    </div>
</template>

<script>

    import fileService from '../../../api/file'
    import { mapActions, mapGetters } from 'vuex'

    export default {
        name: 'DeleteButton',
        components: {},
        props: {
            roundFlag: Boolean,
            circleFlag: Boolean,
            size: String,
            item: Object
        },
        data() {
            return {}
        },
        methods: {
            ...mapActions({
                reloadFileList: 'file/loadFileList'
            }),
            deleteFile() {
                let _this = this
                if (_this.item) {
                    _this.doDeleteFile(_this.item.fileId)
                    return
                }
                if (_this.multipleSelection && _this.multipleSelection.length > 0) {
                    let fileIdArr = new Array()
                    _this.multipleSelection.forEach(item => fileIdArr.push(item.fileId))
                    _this.doDeleteFile(fileIdArr.join('__,__'))
                    return
                }
                _this.$message.error('Please select the file to be deleted')
            },
            doDeleteFile(fileIds) {
                let _this = this
                _this.$confirm('After deleting the file, it will be saved in the recycle bin. Are you sure you want to do this?', 'Delete files', {
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    fileService.delete({
                        fileIds: fileIds
                    }, res => {
                        _this.$message.success('删除成功')
                        _this.reloadFileList()
                    }, res => {
                        _this.$message.error(res.message)
                    })
                })
            }
        },
        computed: {
            ...mapGetters(['multipleSelection'])
        },
        mounted() {
        },
        watch: {}
    }
</script>

<style>
    .download-button-content {
        display: inline-block;
        margin-right: 10px;
    }
</style>