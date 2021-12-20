import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const AddCourses = ({isSearch, setSearch, semesters, semester, setSemester, sem_id}) => {
    if(isSearch)
        return (<div></div>);

    const goSearch = () => {
        var selection = document.getElementById('semester_select');
        if(selection === undefined || selection === null || selection.value === 'default')
            return;
        for(var i = 0; i < sem_id.length; i++){
            if(selection.value === sem_id[i].term){
                setSemester(i);
                setSearch(true);
            }
        }
    }

    const getYear = ['Freshman', 'Freshman', 'Sophomore', 'Sophomore', 'Junior', 'Junior', 'Senior', 'Senior'];

    return (
        <div>
            <br></br>
            <h3 style={{"textAlign":"center"}}>
                Add Courses
            </h3>
            <Row>
                <div style={{"display":"flex", "justifyContent":"center"}}>
                    <Col sm={6}>
                        <Form.Select aria-label="Default select example" id="semester_select">
                            <option value="default">
                                Select A Semester
                            </option>
                            {semesters.map((semester, index) => (
                                <option value={semester} key={semester}>
                                    {getYear[index]+' Year '+semester}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </div>
            </Row>
            <div style={{"padding":"10px", "textAlign":"center"}}>
                <Button onClick={goSearch}>
                    Continue
                </Button>
            </div>
        </div>
    );
}

export default AddCourses;
