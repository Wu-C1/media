package com.rubin.rpan.services.modules.file.constant;

/**
 * 文件模块常量类
 * Created by RubinChu on 2021/1/22 下午 4:11
 */
public class FileConstant {

    public static final String CONTENT_TYPE_STR = "content-type";
    public static final String APPLICATION_OCTET_STREAM_STR = "application/octet-stream";
    public static final String CONTENT_DISPOSITION_STR = "Content-Disposition";
    public static final String CONTENT_DISPOSITION_VALUE_PREFIX_STR = "attachment;fileName=";
    public static final String GB2312_STR = "GB2312";
    public static final String IOS_8859_1_STR = "ISO-8859-1";
    public static final String CN_LEFT_PARENTHESES_STR = "（";
    public static final String CN_RIGHT_PARENTHESES_STR = "）";
    public static final String ALL_FILE_CN_STR = "All files";
    /**
     * 所有文件类型查询标识
     */
    public static final String ALL_FILE_TYPE = "-1";

    /**
     * 是否是文件夹枚举类
     */
    public enum FolderFlagEnum {
        NO(0),
        YES(1);

        FolderFlagEnum(Integer code) {
            this.code = code;
        }

        private Integer code;

        public Integer getCode() {
            return code;
        }
    }

    /**
     * 是否删除
     */
    public enum DelFlagEnum {
        NO(0),
        YES(1);

        DelFlagEnum(Integer code) {
            this.code = code;
        }

        private Integer code;

        public Integer getCode() {
            return code;
        }
    }

    /**
     * 合并标识
     */
    public enum MergeFlag {
        /**
         * 未准备好合并
         */
        NOT_READY(0),
        /**
         * 可以合并
         */
        READY(1);

        MergeFlag(Integer code) {
            this.code = code;
        }

        private Integer code;

        public Integer getCode() {
            return code;
        }
    }

}
