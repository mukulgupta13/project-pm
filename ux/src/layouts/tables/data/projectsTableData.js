/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
export default function data() {
  const monthNames = 'Jan,Feb,Mar,Apr,May,Jun,July,Aug,Sep,Oct,Nov,Dec'.split(',');
  const Author = ({ name, code }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={0} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{code}</MDTypography>
      </MDBox>
    </MDBox>
  );
  const colorStatus = {'Not Started': 'warning', 'Completed': 'success','On Hold':'error','Started':'primary','Closed':'secondary'};
  return {
    columns: [
      { Header: "Name", accessor: d => <Author name={d.name} code={d.code} />, width: "30%", align: "left" },
      { Header: "Owner", accessor: d=>  d.owner_name, align: "left" },
      { Header: "Type", accessor: "type", align: "center" },
      { Header: "Description", accessor: "description", align: "left" },
      { Header: "Start date", accessor:d=> `${new Date(d.startDate).getDate()}-${monthNames[new Date(d.startDate).getMonth()]}-${new Date(d.startDate).getFullYear()}`,  align: "center" },
      { Header: "Budget", accessor: d=> `₹ ${d.budget}`, align: "right" },
      { Header: "End Date", accessor: d=>`${new Date(d.endDate).getDate()}-${monthNames[new Date(d.endDate).getMonth()]}-${new Date(d.endDate).getFullYear()}`, align: "center" },
      { Header: "Status", accessor: (d)=>
        <MDBox ml={-1}>
          <MDBadge badgeContent={d.status} color={colorStatus[d.status]} variant="gradient" size="sm" />
        </MDBox>
        
      , align: "center" },
      { Header: "Skills", accessor: (d) => <MDBox ml={-1}>
            {(d.skills||'').split(',').map(m => <MDBadge badgeContent={m} color="info" variant="gradient" size="sm" />)}
          </MDBox>, align: "left"
      },
      { Header: "Action", accessor: "action", align: "center" },
      
    ],

    rows: [

    ],
  };
}
