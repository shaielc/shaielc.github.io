export const notebookSource = {
    "jupyter-utility-widgets": {
        "list": "https://api.github.com/repos/shaielc/jupyter-utility-widgets/contents/examples",
        "source": 'https://raw.githubusercontent.com/shaielc/jupyter-utility-widgets/main/examples/'
    }
}

export interface IFileInfo {
    name: string
}

interface IGithubEntry extends IFileInfo {
    name: string
    type: string
}


function parseGithubFileList(fileList: any[]) {
    return fileList.filter(
        (entry: IGithubEntry) => entry['type'] === "file" ).filter(
        (entry: IGithubEntry) => entry["name"].endsWith(".ipynb")
    )
}

export async function fetchAvailableNotebooks(source: string) {
    const resp = await fetch(source)
    const payload = await resp.json()

    const files: IFileInfo[] = parseGithubFileList(payload)
    return files
}