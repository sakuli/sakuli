declare module "get-cursor-position" {
    export interface Position {
        x: number,
        y: number
    }
    interface GetCursorPositionStatic {
        async(handle: (pos:Position) => void): void
        sync(): Position
    }

    const getCursorPosition: GetCursorPositionStatic;
    export default getCursorPosition;
}