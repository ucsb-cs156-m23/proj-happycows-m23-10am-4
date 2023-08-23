import React from "react";
import OurTable from "main/components/OurTable"
import { Button } from "react-bootstrap";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, cellToAxiosParamsUnhide, onDeleteSuccess } from "main/utils/usersUtils"

export default function UsersTable({ users }) {

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/admin/users"]
    );

    const unhideMutation = useBackendMutation(
        cellToAxiosParamsUnhide,
        { onSuccess: onDeleteSuccess },
        ["/api/admin/users"]
    );
    // Stryker restore all

    const deleteCallback = async (cell) => {
        deleteMutation.mutate(cell);
    }

    const unhideCallback = async (cell) => {
        unhideMutation.mutate(cell);
    }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'First Name',
            accessor: 'givenName',
        },
        {
            Header: 'Last Name',
            accessor: 'familyName',
        },
        {
            Header: 'Email',
            accessor: 'email',
        },
        {
            Header: 'Admin',
            id: 'admin',
            accessor: (row, _rowIndex) => String(row.admin) // hack needed for boolean values to show up
        },
        {
            Header: 'Hidden',
            id: 'hidden',
            accessor: (row, _rowIndex) => String(row.hidden) // hack needed for boolean values to show up
        }
    ];

    // if this row is an admin, disable the hide/unhide buttons
    // if this row is hidden, disable the hide button
    // if this row is not hidden, disable the unhide button
    const columnsWithHide = [
        ...columns,
        {
            Header: 'Hide',
            id: 'hide',
            Cell: ({ cell }) => (
                <Button
                    variant={"danger"}
                    onClick={() => deleteCallback(cell)}
                    data-testid={`UsersTable-cell-row-${cell.row.index}-col-${cell.column.id}-button`}
                    disabled={cell.row.values["hidden"] === "true" || cell.row.values["admin"] === "true"
                    }
                >
                    {"Hide"}
                </Button>
            )
        },
        {
            Header: 'Unhide',
            id: 'unhide',
            Cell: ({ cell }) => (
                <Button
                    variant={"success"}
                    onClick={() => unhideCallback(cell)}
                    data-testid={`UsersTable-cell-row-${cell.row.index}-col-${cell.column.id}-button`}
                    disabled={cell.row.values["hidden"] === "false" || cell.row.values["admin"] === "true"
                }
                >
                    {"Unhide"}
                </Button>
            )
        }
    ];


    return <OurTable
        data={users}
        columns={columnsWithHide}
        testid={"UsersTable"} />;
};