<template>
    <div>
        <pan-simple-header/>
        <div class="office-iframe-content">
            <iframe class="office-iframe" :src="showPath" frameborder="0"/>
        </div>
    </div>
</template>

<script>

    import PanSimpleHeader from '../../../components/simple-header'
    import panUtil from '../../../utils/common'

    export default {
        name: "Office",
        components: { PanSimpleHeader },
        data() {
            return {
                showPath: ''
            }
        },
        methods: {
            init() {
                let fileId = this.$route.params.fileId
                this.showPath = "https://view.officeapps.live.com/op/view.aspx?src=" + escape(panUtil.getPreviewUrl(fileId))
            }
        },
        computed: {},
        mounted() {
            this.init()
        }
    }
</script>

<style scoped>

    .office-iframe-content {
        width: 100%;
        margin-top: 62px;
        display: block;
        text-align: center;
    }

    .office-iframe {
        width: 100%;
        height: 1200px;
    }

</style>
