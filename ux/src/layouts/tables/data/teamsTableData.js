import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
export default function data() {
  const Author = ({ name, description }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={0} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{description}</MDTypography>
      </MDBox>
    </MDBox>
  );
  return {
    columns: [
      { Header: "Team", accessor: d => <Author name={d.name} description={d.description} />, width: "30%", align: "left" },
      { Header: "Owner", accessor: (d) => `${d.owner_name}`, align: "left" },
      {
        Header: "Members", accessor: (d) => <MDBox ml={-1}>
          
            {d.members.slice(0, 5).map(m => <MDBadge badgeContent={m.firstname+' '+m.lastname} color="info" variant="gradient" size="sm" />)}
            {d.members.length > 5 ? ` + ${d.members.length - 5} ` : ''}
          </MDBox>, align: "left"
      },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: [
    ],
  };
}