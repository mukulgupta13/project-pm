import { getMonth, getYear } from 'date-fns';
import range from "lodash/range";
import DatePicker from "react-datepicker";

const years = range(1990, getYear(new Date()) + 1, 1);
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const DatePickerWithHeaderSelection = ({ field, placeholderText }) => <DatePicker className="dob" 
    renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
    }) => (
        <div
            style={{
                margin: 10,
                display: "flex",
                justifyContent: "center"
            }}
        >
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} style={{fontSize:"20px",border:"none",cursor:"pointer"}}>
                {"⏪"}
            </button>
            <select
                value={getYear(date)}
                onChange={({ target: { value } }) => changeYear(value)}
                style={{marginTop:"5px",textAlign:"center"}}
            >
                {years.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <select
                value={months[getMonth(date)]}
                onChange={({ target: { value } }) =>
                    changeMonth(months.indexOf(value))
                }
                style={{marginTop:"5px"}}
            >
                {months.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} style={{fontSize:"20px",border:"none", cursor:"pointer"}}>
                {"⏩"}
            </button>
        </div>
    )}
    dateFormat="dd-MMM-yyyy"
    placeholderText={placeholderText}
    onChange={(date) => field.onChange(date)}
    selected={field.value ? new Date(field.value) : field.value}
/>

export default DatePickerWithHeaderSelection;