import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

const ClassReq = ({Course, show, setShow}) => {
    const handleClose = () => setShow(false);
    const abbrevToRequirement = {FMS: 'Foundational Courses', CETC: 'Technical Core',
                                 CEtech: 'Computer Engineering Technical Electives',
                                 EEF: 'Electrical Engineering Foundations Courses', ADVC: 'Advanced Computing Electives',
                                 DES: 'Design Elective', ACP: 'Advanced Composition', NW: 'Non-Western Cultures',
                                 WCC: 'Western/Comparative Cultures', US: 'U.S. Minority Cultures',
                                 HP: 'Humanities & the Arts (Historical & Philosophical)',
                                 LA: 'Humanities & the Arts (Literature & the Arts)',
                                 LS: 'Natural Sciences & Technology (Life Sciences)',
                                 PS: 'Natural Sciences & Technology (Physical Sciences)',
                                 QR1: 'Quantitative Reasoning 1', QR2: 'Quantitative Reasoning 2',
                                 BS: 'Social & Behavioral Sciences (Behavior Sciences)',
                                 SS: 'Social & Behavioral Sciences (Social Sciences)'
    };

    if(Course === undefined || Course.fulfilled_reqs === undefined)
        Course = {semesters: [], fulfilled_reqs: []};

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{Course.subject+' '+Course.number+': '+Course.label}</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <Table id="info_data">
                            <thead>
                                <tr>
                                    <th scope="col">
                                        Requirements Fulfilled
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Course.fulfilled_reqs.map((req, index) => (
                                    <tr key={index}>
                                        <td>
                                            {abbrevToRequirement[req]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
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

export default ClassReq;
