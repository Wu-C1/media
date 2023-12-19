<template>
    <div class="pan-main-file-list-content">
        <el-table
                v-loading="tableLoading"
                ref="fileTable"
                :data="fileList"
                :height="tableHeight"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                @cell-mouse-enter="showOperation"
                @cell-mouse-leave="hiddenOperation"
        >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    label="FileName"
                    prop="filename"
                    sortable
                    show-overflow-tooltip
                    min-width="750">
                <template slot-scope="scope">
                    <div @click="clickFilename(scope.row)" class="file-name-content">
                        <i :class="getFileFontElement(scope.row.fileType)"
                           style="margin-right: 15px; font-size: 20px; cursor: pointer;"/>
                        <span style="cursor:pointer;">{{ scope.row.filename }}</span>
                    </div>
                    <div class="file-operation-content">
                        <el-tooltip class="item" effect="light" content="Download" placement="top">
                            <download-button size="small" :circle-flag=true :item="scope.row" />
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="Rename" placement="top">
                            <rename-button size="small" :circle-flag=true :item="scope.row" />
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="Delete" placement="top">
                            <delete-button size="small" :circle-flag=true :item="scope.row" />
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="searchFlag"
                    prop="parentFilename"
                    label="位置"
                    min-width="120"
                    align="center">
                <template slot-scope="scope">
                    <el-link @click="goInFolder(scope.row.parentId)" type="primary">{{ scope.row.parentFilename }}</el-link>
                </template>
            </el-table-column>
            <el-table-column
                    prop="fileSizeDesc"
                    sortable
                    label="Size"
                    min-width="120"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="updateTime"
                    sortable
                    align="center"
                    label="Modification Date"
                    min-width="240">
            </el-table-column>
        </el-table>

        <el-image-viewer
                class="el-image-viewer"
                :initial-index="imgIndex"
                v-if="showViewer"
                :on-close="closeShowViewer"
                :url-list="imgUrl"/>
    </div>
</template>

<script>

    import DownloadButton from '../buttons/download-button'
    import DeleteButton from '../buttons/delete-button'
    import RenameButton from '../buttons/rename-button'
    import CopyButton from '../buttons/copy-button'
    import TransferButton from '../buttons/transfer-button'
    import ShareButton from '../buttons/share-button'
    import fileService from '../../api/file'
    import panUtil from '../../utils/common'
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import { mapMutations, mapActions, mapGetters } from 'vuex'

    export default {
        name: 'FileTable',
        components: {
            DownloadButton,
            DeleteButton,
            RenameButton,
            CopyButton,
            TransferButton,
            ShareButton,
            ElImageViewer
        },
        props: {
        },
        data() {
            return {
                tableHeight: window.innerHeight - 200,
                showViewer: false,
                imgUrl: [],
                imgIndex: 0
            }
        },
        methods: {
            ...mapMutations({
                reloadSelection: 'file/setMultipleSelection',
                resetParentId: 'file/setFileParentId',
                clearBreadCrumbs: 'breadcrumb/clear',
                resetBreadCrumbs: 'breadcrumb/reset',
                setSearchFlag: 'file/setSearchFlag'
            }),
            ...mapActions({
                reloadFileList: 'file/loadFileList'
            }),
            handleSelectionChange(multipleSelection) {
                this.reloadSelection(multipleSelection)
            },
            showOperation(row, column, cell, event) {
                panUtil.showOperation(cell)
            },
            hiddenOperation(row, column, cell, event) {
                panUtil.hiddenOperation(cell)
            },
            clickFilename(row) {
                let _this = this
                switch (row.fileType) {
                    case 0:
                        _this.goInFolder(row.fileId)
                        break
                    case 3:
                    case 4:
                    case 10:
                        _this.showOffice(row)
                        break
                    case 5:
                    case 6:
                        _this.showIframe(row)
                        break
                    case 7:
                        this.$message.info('Cannot preview, click on the right side to download')
                        break
                    case 8:
                        _this.showMusic(row)
                        break
                    case 9:
                        _this.showVideo(row)
                        break
                    case 11:
                        _this.showCode(row)
                    default:
                        break
                }
            },
            goInFolder(fileId) {
                let _this = this
                fileService.getBreadcrumbs({
                    fileId: fileId
                }, res => {
                    _this.setSearchFlag(false)
                    _this.clearBreadCrumbs()
                    _this.resetBreadCrumbs(res.data)
                    _this.resetParentId(fileId)
                    _this.reloadFileList()
                }, res => {
                    _this.$message.error(res.message)
                })
            },
            showOffice(row) {
                this.openNewPage('/preview/office', 'PreviewOffice', {
                    fileId: row.fileId
                })
            },
            showIframe(row) {
                this.openNewPage('/preview/iframe', 'PreviewIframe', {
                    fileId: row.fileId
                })
            },
            showImg(row) {
                this.imgUrl = new Array()
                for (let i = 0, iLength = this.fileList.length; i < iLength; ++i) {
                    if (this.fileList[i].fileType === 7) {
                        this.imgUrl.push(panUtil.getPreviewUrl(this.fileList[i].fileId))
                        if (this.fileList[i].fileId === row.fileId) {
                            this.imgIndex = i-1
                        }
                    }
                }
                this.showViewer = true
            },
            showMusic(row) {
                this.openNewPage('/preview/music', 'PreviewMusic', {
                    fileId: row.fileId,
                    parentId: row.parentId
                })
            },
            showVideo(row) {
                this.openNewPage('/preview/video', 'PreviewVideo', {
                    fileId: row.fileId,
                    parentId: row.parentId
                })
            },
            showCode(row) {
                this.openNewPage('/preview/code', 'PreviewCode', {
                    fileId: row.fileId
                })
            },
            openNewPage(path, name, params) {
                const { href } = this.$router.resolve({
                    path: path,
                    name: name,
                    params: params
                })
                window.open(href, '_blank')
            },
            getFileFontElement(type) {
                return panUtil.getFileFontElement(type)
            },
            closeShowViewer() {
                this.showViewer = false
            }
        },
        computed: {
            ...mapGetters(['parentId', 'fileTypes', 'fileList', 'searchFlag', 'tableLoading'])
        },
        mounted() {
            this.reloadSelection(new Array())
        },
        watch: {}
    }
</script>

<style>

    .pan-main-file-list-content {
        width: 100%;
        height: 100%;
        margin-top: 20px;
    }

    .file-operation-content {
        display: none;
        position: absolute;
        right: 100px;
        top: 8px;
    }

    .el-image-viewer {
        width: 80%;
        height: 80%;
        margin-left: 10%;
        margin-top: 4%
    }

</style>