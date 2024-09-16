export default function data() {
    return {
        columns: [
            { Header: "", accessor: "action", align: "center"},
            { Header: "Teams", accessor: "name", align: "left", width: "25%" },
            { Header: "Description", accessor: "description", align: "left",width: "45%" },
            { Header: "Owner", accessor: "owner_name", align: "left",width: "30%" },
        ],
        rows: [

        ],
    };
}