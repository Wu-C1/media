<template>
  <div>
    <div class="button-search-content">
      <!--            <file-button-group :button-array="buttonArray"/>-->
      <br/>
<!--      <search/>-->
    </div>
    <bread-crumb/>
    <file-table/>
  </div>
</template>

<script>

import FileButtonGroup from '../../../components/file-button-group/'
import Search from '../../../components/search'
import BreadCrumb from '../../../components/breadcrumb-all'
import FileTable from '../../../components/file-table-all'
import {mapMutations, mapActions, mapGetters} from 'vuex'

export default {
  name: 'Files',
  components: {FileButtonGroup, Search, BreadCrumb, FileTable},
  props: [],
  data() {
    return {
      buttonArray: ['upload', 'createFolder', 'download', 'delete', 'rename', 'share', 'copy', 'transfer']
    }
  },
  methods: {
    ...mapMutations({
      resetFileTypes: 'file/setFileTypes',
      refreshParentId: 'file/refreshFileParentId',
      addBreadCrumbItem: 'breadcrumb/addItem',
      clearBreadCrumb: 'breadcrumb/clear',
    }),
    ...mapActions({
      reloadFileList: 'file/loadFileListAll'
    }),
    init() {
      let _this = this
      if (!_this.searchFlag) {
        let firstItem = {
          id: this.defaultParentId,
          name: this.defaultParentFilename
        }
        this.clearBreadCrumb()
        this.addBreadCrumbItem(firstItem)
        _this.refreshParentId()
        _this.resetFileTypes('-1')
        _this.reloadFileList()
      }
    }
  },
  computed: {
    ...mapGetters(['defaultParentId', 'defaultParentFilename', 'searchFlag'])
  },
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