import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Advanced = ({show, setShow, startSearch, filters, setFilters}) => {
    const [courseNum, setCourseNum] = useState([100, 599]);
    const [avgGPA, setAvgGPA] = useState([0.00, 4.00]);
    const [advComp, setAdvComp] = useState(false);
    const [disableGenEd, setGenEd] = useState(true);
    const [disableCulture, setCulture] = useState(true);
    const [geneds, setGenedChecks] = useState([false, false, false]);
    const [culture, setCulChecks] = useState([false, false, false]);
    const genedList = ['Humanities and the Arts', 'Social and Behavioral Science', 'Liberal Education'];
    const cultureList = ['Western/Comparative', 'Non-Western Cultures', 'U.S. Minority Cultures'];

    const handleApply = () => {
        setShow(false);
        setFilters({minNum: courseNum[0], maxNum: courseNum[1], minGPA: avgGPA[0], maxGPA: avgGPA[1],
            filterGenEd: !disableGenEd, humanities: geneds[0], social: geneds[1], libed: geneds[2],
            filterCultural: !disableCulture, western: culture[0], nonwestern: culture[1], usmin: culture[2], filterAdvComp: advComp}
        );
        startSearch();
    }

    const handleReset = () => {
        setCourseNum([100, 599]);
        setAvgGPA([0.00, 4.00]);
        setAdvComp(false);
        setGenEd(true);
        setCulture(true);
        setGenedChecks([false, false, false]);
        setCulChecks([false, false, false]);
    }

    const handleCancel = () => { setShow(false); }

    const toggleGenEd = () => { setGenEd(!disableGenEd); }

    const toggleCulture = () => { setCulture(!disableCulture); }

    const updateGened = (index) => { setGenedChecks(geneds.slice(0, index).concat([!geneds[index]]).concat(geneds.slice(index+1))); }

    const updateCulture = (index) => { setCulChecks(culture.slice(0, index).concat([!culture[index]]).concat(culture.slice(index+1))); }

    const updateAdvComp = () => { setAdvComp(!advComp); }

    const updateCourseNum = () => {
        var low = document.getElementById('class_low');
        var high = document.getElementById('class_high');
        if(low === undefined || high === undefined)
            return;
        setCourseNum([low.value, high.value]);
    }

    const updateAvgGPA = () => {
        var low = document.getElementById('gpa_low');
        var high = document.getElementById('gpa_high');
        if(low === undefined || high === undefined)
            return;
        setAvgGPA([low.value, high.value]);
    }

    return (
        <div>
            <Modal show={show} backdrop="static">
                <Modal.Header>
                    <Modal.Title>Advanced Filters</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="range">
                        <span style={{"fontWeight":"bold"}}>Course Number Range: </span>{courseNum[0]+' To '+courseNum[1]}
                        <input type="range" className="form-range" id="class_low" min="100" max="599" onChange={updateCourseNum} value={courseNum[0]} />
                        <input type="range" className="form-range" id="class_high" min="100" max="599" onChange={updateCourseNum} value={courseNum[1]} />
                    </div>
                    <div className="range">
                        <span style={{"fontWeight":"bold"}}>Average Course GPA Range: </span>{avgGPA[0]+' To '+avgGPA[1]}
                        <input type="range" className="form-range" id="gpa_low" min="0.0" max="4.0" step="0.1" onChange={updateAvgGPA} value={avgGPA[0]} />
                        <input type="range" className="form-range" id="gpa_high" min="0.0" max="4.0" step="0.1" onChange={updateAvgGPA} value={avgGPA[1]} />
                    </div>
                    <Form.Check type='checkbox' label='GenEd Category Filter' style={{"fontWeight":"bold"}} onChange={toggleGenEd} checked={!disableGenEd} />
                    {genedList.map((cat, index) => (
                        <Form.Check type='checkbox' label={cat} style={{"marginLeft":"25px"}} disabled={disableGenEd} key={cat} onChange={() => updateGened(index)} checked={geneds[index]} />
                    ))}
                    <br></br>
                    <Form.Check type='checkbox' label='Cultural Studies Category Filter' style={{"fontWeight":"bold"}} onChange={toggleCulture} checked={!disableCulture} />
                    {cultureList.map((cat, index) => (
                        <Form.Check type='checkbox' label={cat} style={{"marginLeft":"25px"}} disabled={disableCulture} key={cat} onChange={() => updateCulture(index)} checked={culture[index]} />
                    ))}
                    <br></br>
                    <Form.Check type='checkbox' label='Advanced Composition Filter' style={{"fontWeight":"bold"}} onChange={updateAdvComp} checked={advComp} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleCancel} style={{"color":"lightgray", "border-color":"gray"}}>
                        Cancel
                    </Button>
                    <Button variant="secondary" onClick={handleReset}>
                        Reset Filters
                    </Button>
                    <Button variant="primary" onClick={handleApply}>
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Advanced;
