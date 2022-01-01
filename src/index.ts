export * from "./class/admin";
export * from "./class/user";

/**
 * blobからbase64形式に変換します(この関数はブラウザ上で実行することを想定しています)
 * @param blob 
 */
export function readAsDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => { resolve(reader.result as string); };
        reader.onerror = () => { reject(reader.error); };
        reader.readAsDataURL(blob);
    });
}