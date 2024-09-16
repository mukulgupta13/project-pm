import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";


export default function data() {
     const monthNames = 'Jan,Feb,Mar,Apr,May,Jun,July,Aug,Sep,Oct,Nov,Dec'.split(',');
     const colorStatus = {'Created': 'success', 'Approved': 'secondary'};
     
    return {
      columns: [
        { Header: "Task", accessor: "task", align: "left" },
        { Header: "Employee ", accessor:"employee_name", align: "center" },
        { Header: "Date", accessor: d=> `${new Date(d.date).getDate()}-${monthNames[new Date(d.date).getMonth()]}-${new Date(d.date).getFullYear()}`, align: "center" },
        { Header: "Start Time", accessor: "starttime", align: "right" },
        { Header: "End Time", accessor:"endtime", align: "right"},
        { Header: "Duration", accessor: "duration", align: "center" },
        { Header: "Status", accessor: (d)=>
        <MDBox ml={-1}>
          <MDBadge badgeContent={d.status} color={colorStatus[d.status]} variant="gradient" size="sm" />
        </MDBox>
        
      , align: "center" },
        { Header: "Action", accessor: "action", align: "center" },
      ],
  
      rows: [ 
  
      ],
    };
  }