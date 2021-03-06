export interface FileNode {
    filename: string;
    path: string;
    children: FileNode[];
    attrs: {
        longname: string;
    };
}