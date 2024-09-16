import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function data() {
    const monthNames = 'Jan,Feb,Mar,Apr,May,Jun,July,Aug,Sep,Oct,Nov,Dec'.split(',');
    const Author = ({firstname,lastname, email }) => (
      <MDBox  >
        <MDBox >
          <MDTypography display="block" variant="button" fontWeight="medium">
        {firstname} {lastname}
          </MDTypography>
          <MDTypography variant="caption">{email}</MDTypography>
        </MDBox>
      </MDBox>
    );
    return {
      columns: [
        { Header: "Name", accessor: d => <Author firstname={d.firstname}  lastname={d.lastname} email={d.email}/>,  align: "left" },
        { Header: "Phone No.", accessor: "phonenumber", align: "center" },
        { Header: "DOB", accessor:d=> `${new Date(d.dob).getDate()}-${monthNames[new Date(d.dob).getMonth()]}-${new Date(d.dob).getFullYear()}`, align: "right" },
        { Header: "DOM", accessor: d=> d.dom ?`${new Date(d.dom).getDate()}-${monthNames[new Date(d.dom).getMonth()]}-${new Date(d.dom).getFullYear()}`:'', align: "right" },
        { Header: "Address ", accessor:d => [d.addressline1,d.addressline2,d.city,d.state, d.pincode].filter(x=>!!x).join(', '), align: "left" },
        { Header: "Action", accessor: "edit", align: "center" },
      ],
  
      rows: [ 
  
      ],
    };
  }