<template>
    <div>
        <el-dropdown @command="handleCommand">
                          <span class="pan-user-info">
                            Welcome,{{ username }}
                              <i class="el-icon-arrow-down el-icon--right"/>
                          </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="changePassword">Change password</el-dropdown-item>
                <el-dropdown-item command="exit">Log out and log in</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dialog
                title="Change password"
                :visible.sync="changePasswordDialogVisible"
                @opened="focusPasswordInput"
                @closed="resetChangePasswordForm"
                width="30%"
                :append-to-body=true
                :modal-append-to-body=false
                :center=true>
            <div>
                <el-form label-width="100px" :rules="changePasswordRules" ref="changePasswordForm"
                         :model="changePasswordForm"
                         status-icon
                         @submit.native.prevent>
                    <el-form-item label="Old password" prop="password">
                        <el-input type="password"
                                  show-password
                                  ref="password"
                                  @keyup.enter.native="doChangePassword"
                                  v-model="changePasswordForm.password" autocomplete="off"/>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input type="password"
                                  show-password
                                  @keyup.enter.native="doChangePassword"
                                  v-model="changePasswordForm.newPassword" autocomplete="off"/>
                    </el-form-item>
                    <el-form-item label="Confirm Password" prop="reNewPassword">
                        <el-input type="password"
                                  show-password
                                  @keyup.enter.native="doChangePassword"
                                  v-model="changePasswordForm.reNewPassword" autocomplete="off"/>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changePasswordDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doChangePassword" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    import userService from '../../api/user'
    import {clearToken} from '../../utils/cookie'
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "PanUserInfo",
        data() {
            let checkReNewPassword = (rule, value, callback) => {
                if (value !== this.changePasswordForm.newPassword) {
                    return callback(new Error('两次密码不一致'));
                } else {
                    callback()
                }
            }
            return {
                changePasswordDialogVisible: false,
                changePasswordForm: {
                    password: '',
                    newPassword: '',
                    reNewPassword: ''
                },
                loading: false,
                changePasswordRules: {
                    password: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'},
                        {min: 4, max: 16, message: '请输入4-16位的密码', trigger: 'blur'}
                    ],
                    newPassword: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 4, max: 16, message: '请输入4-16位的密码', trigger: 'blur'}
                    ],
                    reNewPassword: [
                        {required: true, message: '请输入确认密码', trigger: 'blur'},
                        {validator: checkReNewPassword, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            ...mapMutations({
                clearFile: 'file/clear',
                clearBreadCrumb: 'breadcrumb/clear',
                clearNavBar: 'navbar/clear',
                clearUser: 'user/clear',
                setParentId: 'file/setFileParentId',
                setDefaultParentId: 'file/setFileDefaultParentId',
                setDefaultParentFilename: 'file/setDefaultParentFilename',
                setUsername: 'user/setUsername'
            }),
            handleCommand(command) {
                if (command === 'changePassword') {
                    this.changePasswordDialogVisible = true
                } else if (command === 'exit') {
                    this.exit()
                }
            },
            doChangePassword() {
                let _this = this
                _this.$refs.changePasswordForm.validate((valid) => {
                    if (valid) {
                        _this.loading = true
                        userService.changePassword({
                            password: _this.changePasswordForm.password,
                            newPassword: _this.changePasswordForm.newPassword
                        }, () => {
                            _this.loading = false
                            _this.changePasswordDialogVisible = false
                            _this.$notify({
                                title: '成功',
                                message: '密码修改成功,即将跳转至登录页面',
                                type: 'success'
                            })
                            setTimeout(() => _this.goLogin(), 1000)
                        }, res => {
                            _this.$message.error(res.message)
                            _this.loading = false
                        })
                    }
                })
            },
            exit() {
                let _this = this
                _this.$confirm('Are you sure you want to log out?', 'Prompt', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    userService.exit(() => {
                        _this.goLogin()
                    }, res => {
                        _this.$message.error(res.message)
                    })

                })
            },
            goLogin() {
                clearToken()
                this.clearFile()
                this.clearBreadCrumb()
                this.clearNavBar()
                this.clearUser()
                window.location.reload()
            },
            focusPasswordInput() {
                this.$refs.password.focus()
            },
            resetChangePasswordForm() {
                this.$refs.changePasswordForm.resetFields()
            },
            initUserInfoIfNecessary() {
                let _this = this
                if (!_this.username) {
                    userService.info(res => {
                        _this.setParentId(res.data.rootFileId)
                        _this.setDefaultParentId(res.data.rootFileId)
                        _this.setDefaultParentFilename(res.data.rootFilename)
                        _this.setUsername(res.data.username)
                    }, res => {
                        _this.$message.error(res.message)
                    })
                }
            }
        },
        computed: {
            ...mapGetters(['username'])
        },
        mounted() {
            this.initUserInfoIfNecessary()
        },
        watch: {}
    }

</script>

<style scoped>
    .pan-user-info {
        color: #409EFF;
    }
</style>