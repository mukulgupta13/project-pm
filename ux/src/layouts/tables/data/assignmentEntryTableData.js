import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";

export default function data() {

    return {

        columns: [
            { Header: "Projects", accessor: (d) => `${d.project_name}`, align: "left" },
            {
                Header: "Teams", accessor: (d) => <MDBox ml={-1}>
                    {d.teams_data.map(m => <MDBadge badgeContent={m.name} color="info" variant="gradient" size="sm" />)}
                </MDBox>, align: "left"
            },
            { Header: "Action", accessor: "action", align: "center" },
        ],
        rows: [

        ],
    };
}