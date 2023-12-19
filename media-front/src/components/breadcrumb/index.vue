<template>
    <div class="pan-main-breadcrumb-content">
        <el-breadcrumb style="display: inline-block;">
            <el-breadcrumb-item>
                <a class="breadcrumb-item-a" @click="goBack" href="#">Return</a>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider direction="vertical" style="vertical-align: top !important;"/>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block;">
            <el-breadcrumb-item v-for="(item, index) in breadCrumbs" :key="index">
                <a class="breadcrumb-item-a" @click="goToThis(item.id)" href="#">{{ item.name }}</a>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>

    import { mapGetters, mapMutations, mapActions } from 'vuex'

    export default {
        name: 'BreadCrumb',
        components: {},
        props: {
        },
        data() {
            return {
            }
        },
        methods: {
            ...mapMutations({
                resetParentId: 'file/setFileParentId',
                resetBreadCrumb: 'breadcrumb/reset',
                setSearchFlag: 'file/setSearchFlag'
            }),
            ...mapActions({
                reloadFileList: 'file/loadFileList'
            }),
            goBack() {
                let _this = this
                _this.setSearchFlag(false)
                if (_this.breadCrumbs.length > 1) {
                    let resolveBreadCrumbs = [..._this.breadCrumbs]
                    resolveBreadCrumbs.pop()
                    let newId = resolveBreadCrumbs.pop().id
                    _this.goToThis(newId)
                }
            },
            goToThis(id) {
                if (id !== '-1') {
                    let newBreadCrumbs = new Array()
                    this.breadCrumbs.some(item => {
                        newBreadCrumbs.push(item)
                        if (item.id == id) {
                            return true
                        }
                    })
                    this.resetBreadCrumb(newBreadCrumbs)
                    this.resetParentId(id)
                    this.setSearchFlag(false)
                    this.reloadFileList()
                }
            }
        },
        computed: {
            ...mapGetters(['breadCrumbs'])
        },
        mounted() {
        },
        watch: {}
    }
</script>

<style>

    .pan-main-breadcrumb-content {
        width: 100%;
        padding: 10px 0 0 25px;
    }

    .breadcrumb-item-a {
        cursor: pointer !important;
        color: #409EFF !important;
    }

</style>