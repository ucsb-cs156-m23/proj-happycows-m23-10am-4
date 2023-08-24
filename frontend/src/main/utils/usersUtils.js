import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
    console.log(message);
    toast(message);
}

export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/admin/user/hide",
        method: "PUT",
        params: {
            userId: cell.row.values["id"]
        }
    }
}

export function cellToAxiosParamsUnhide(cell) {
    return {
        url: "/api/admin/user/unhide",
        method: "PUT",
        params: {
            userId: cell.row.values["id"]
        }
    }
}