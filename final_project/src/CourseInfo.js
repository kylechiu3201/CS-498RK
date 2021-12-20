import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';


const CourseInfo = ({Course, show, setShow}) => {
    const handleClose = () => setShow(false);
    const abbrevToSeason = {fa: 'Fall', sp: 'Spring', su: 'Summer', wi: 'Winter'};

    if(Course === undefined || Course.semesters === undefined)
        Course = {semesters: [], fulfilled_reqs: []};

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{Course.subject+' '+Course.number+': '+Course.label}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span id="info_label">
                        Course Description:{' '}
                        <br></br>
                        <span style={{"fontWeight":"normal"}}>
                            {Course.description}
                            {/* <br></br>
                            {Course.schedule_info} */}
                        </span>
                    </span>
                    <br></br><br></br>
                    <span id="info_label">
                        Average GPA:{' '}
                        <span style={{"fontWeight":"normal"}}>
                            {Course.gpa}
                        </span>
                    </span>
                    <br></br><br></br>
                    <span id="info_label">
                        Past Semesters:{' '}
                        <Table id="info_data">
                            <thead id="past_sem">
                                <tr>
                                    <th scope="col">
                                        Term Offered
                                    </th>
                                    <th scope="col">
                                        Primary Instructor
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="past_sem">
                                {Course.semesters.map((semester) => (
                                    <tr key={semester.sem_offered}>
                                        <td>
                                            {abbrevToSeason[semester.sem_offered.substring(semester.sem_offered.length-2)]+' '+semester.sem_offered.substring(0, semester.sem_offered.length-3)}
                                        </td>
                                        <td>
                                            {semester.instructor}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CourseInfo;
