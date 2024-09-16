import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
export default function data() {
    const Author = ({ ID, description }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <MDBox ml={0} lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="medium">
              {ID}
            </MDTypography>
            <MDTypography variant="caption">{description}</MDTypography>
          </MDBox>
        </MDBox>
      );
      const colorStatus = {'Created': 'warning', 'UnAssigned': 'success','Assigned':'error','Committed':'primary','Fixed':'secondary','Closed':'secondary','Completed':'success'};

    return {
        columns: [
            { Header: "ID", accessor: d => <Author ID={d.ID} description={d.description} />, width: "30%", align: "left" },
            { Header: "Title", accessor: "title", align: "left", width: "25%" },
            { Header: "Project", accessor: (d) => `${d.project_name}`, align: "left" },
            { Header: "Status", accessor: (d)=>
        <MDBox ml={-1}>
          <MDBadge badgeContent={d.status} color={colorStatus[d.status]} variant="gradient" size="sm" />
        </MDBox>
            },
            { Header: "Efforts", accessor: "efforts", align: "center"},
            { Header: "Importance", accessor: "importance", align: "center"},
            { Header: "Action", accessor: "action", align: "center"},
        ],
        rows: [

        ],
    };
}