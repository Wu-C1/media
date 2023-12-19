<template>
    <div>
        <div class="button-search-content">
            <file-button-group :button-array="buttonArray"/>
            <search/>
        </div>
        <file-table/>
    </div>
</template>

<script>

    import FileButtonGroup from '../../../components/file-button-group/'
    import Search from '../../../components/search'
    import FileTable from '../../../components/file-table'
    import { mapMutations, mapActions } from 'vuex'

    export default {
        name: "Docs",
        components: { FileButtonGroup, Search, FileTable },
        props: [],
        data() {
            return {
                buttonArray: ['upload', 'download', 'delete', 'rename', 'share', 'copy', 'transfer']
            }
        },
        methods: {
            ...mapMutations({
                resetFileTypes: 'file/setFileTypes',
                resetFileParentId: 'file/setFileParentId',
                setSearchFlag: 'file/setSearchFlag'
            }),
            ...mapActions({
                reloadFileList: 'file/loadFileList'
            }),
            init() {
                let _this = this
                _this.setSearchFlag(false)
                _this.resetFileParentId('-1')
                _this.resetFileTypes('3__,__4__,__5__,__6__,__10__,__11')
                _this.reloadFileList()
            }
        },
        computed: {},
        mounted() {
            this.init()
        },
        watch: {}
    }
</script>

<style scoped>

    .button-search-content {
        display: flex;
        width: 100%;
    }

</style>