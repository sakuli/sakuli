export interface FsLayoutEntry {

    /**
     * File mode (permission and sticky bits). Defaults to 0666
     */
    mode: number;

    /**
     * The user id. Defaults to process.getuid().
     */
    uid: number

    /**
     *  The group id. Defaults to process.getgid().
     */
    gid: number

    /**
     *  The last file access time. Defaults to new Date(). Updated when file contents are accessed.
     */
    atime: Date

    /**
     *  The last file change time. Defaults to new Date(). Updated when file owner or permissions change.
     */
    ctime: Date

    /**
     * The last file modification time. Defaults to new Date(). Updated when file contents change.
     */
    mtime: Date

    /**
     * The time of file creation. Defaults to new Date().
     */
    birthtime: Date,

    _type: Symbol,
}