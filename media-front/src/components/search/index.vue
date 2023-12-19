<template>
    <div class="pan-main-search-content">
        <el-autocomplete
                class="pan-main-search"
                v-model="searchKey"
                placeholder="请输入内容"
                size="small"
                @keyup.enter.native="doSearch"
                :fetch-suggestions="querySearchHistory"
                @select="handleSelect"
        >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-autocomplete>
    </div>
</template>

<script>

    import userService from '../../api/user'
    import fileService from '../../api/file'
    import { mapMutations, mapGetters } from 'vuex'

    export default {
        name: 'Search',
        components: {},
        props: {
        },
        data() {
            return {
                searchKey: ''
            }
        },
        methods: {
            ...mapMutations({
                reloadFileList: 'file/setFileList',
                resetFileTypes: 'file/setFileTypes',
                chanPage: 'navbar/changeNavBar',
                addBreadCrumbItem: 'breadcrumb/addItem',
                clearBreadCrumb: 'breadcrumb/clear',
                setSearchFlag: 'file/setSearchFlag',
                refreshParentId: 'file/refreshFileParentId',
                resetSearchKey: 'file/setSearchKey'
            }),
            querySearchHistory(queryString, cb) {
                let _this = this
                userService.searchHistories(res => {
                    cb(res.data)
                }, res => {
                    _this.$message.error(res.message)
                })
            },
            doSearch() {
                let _this = this
                // 设置FileTypes
                _this.resetFileTypes('-1')
                // 设置搜索模式
                _this.setSearchFlag(true)
                // 跳转到Files页面
                _this.chanPage('Files')
                // 缓存搜索关键字
                _this.resetSearchKey(_this.searchKey)
                fileService.search({
                    keyword: _this.searchKey,
                    fileTypes: '-1'
                }, res => {
                    _this.clearBreadCrumb()
                    _this.addBreadCrumbItem({
                        id: _this.defaultParentId,
                        name: _this.defaultParentFilename
                    })
                    _this.addBreadCrumbItem({
                        id: '-1',
                        name: '搜索：' + _this.searchKey
                    })
                    _this.reloadFileList(res.data)
                }, res => {
                    _this.$message.error(res.message)
                })
            },
            handleSelect(item) {
                this.searchKey = item.value
                this.doSearch()
            }
        },
        computed: {
            ...mapGetters(['defaultParentId', 'defaultParentFilename', 'cacheSearchKey'])
        },
        mounted() {
            this.refreshParentId()
            this.searchKey = this.cacheSearchKey
        },
        watch: {}
    }
</script>

<style>

    .pan-main-search-content {
        position: absolute;
        right: 35px;
        height: 60px;
        padding: 20px 0 0 13px;
    }

    .pan-main-search-content .pan-main-search {
        width: 250px;
    }

    .pan-main-search-content .pan-main-search input {
        border-radius: 30px;
    }

</style>