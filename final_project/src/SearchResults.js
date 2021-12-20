
import Table from 'react-bootstrap/Table';

const SearchResults = ({show, setShow, subjectQuery, numberQuery, showClass, showClassReqs, showEveryReq, showAlert, setAlert, alertData, setAlertData, allCourses, setAllCourses, filters, cur_user, setCurUser, sem_id, semester}) => {
    if(!show)
        return (<div></div>);

    const addClass = (className) => {
        const axios = require('axios');
        
        sem_id[semester].courses = [...sem_id[semester].courses, {course_id: className._id, grade:'NT'}];

        axios.put(`https://ancient-ravine-23357.herokuapp.com/semesters/${sem_id[semester]._id}`,{student_id: cur_user.student_id, term: sem_id[semester].term, courses: sem_id[semester].courses})
        .then(function (response) {
            // handle success
            // console.log(response.data);
            axios.get(`https://ancient-ravine-23357.herokuapp.com/students/${cur_user.student_id}`)
            .then(function (response2) {
            // handle success
            // console.log(response2.data);
            cur_user.GPA = response2.data.data.gpa;
            cur_user.credits_earned = response2.data.data.total_credits;
            setCurUser(cur_user);
            })
            .catch(function (error) {
            // handle error
            // console.log(error);
            })
        })
        .catch(function (error) {
            // handle error
            // console.log(error);
        })

        setAlertData(['Add Class', 'Successfully added '+className.subject+' '+className.number+'!']);
        setAlert(true);
    }
    
    var results = [];

    // INC: Only the following course numbers are included as liberal education electives
    // EXC: All courses except for the following course numbers are included as liberal education electives
    // SUBJECT_ALL: All of the course subjects listed have all their courses included as liberal education electives
    const libeds = {ABE: ['INC', '199CHP', '199 CHP'],
                    ACCY: ['INC', '200', '201', '202', '211', '212'],
                    ACE: ['EXC', '161', '261'],
                    AHS: ['INC', '365', '375'],
                    ANSC: ['EXC', '4XX'],
                    ARCH: ['EXC', '232', '341', '342', '351', '352', '433', '434'],
                    ASRM: ['INC', '210'],
                    CHLH: ['EXC', '244', '274', '421'],
                    CPSC: ['EXC', '241', '382', '4XX'],
                    DTX: ['INC', '251', '455'],
                    ECE: ['INC', '316'],
                    ECON: ['EXC', '202', '203'],
                    ENG: ['INC', '110', '111', '177', '261', '315', '377', '411', '440', '441', '451'],
                    ENVS: ['EXC', '101', '480'],
                    EPSY: ['EXC', '280'],
                    ESE: ['INC', '106', '170', '200', '202', '215', '254', '287', '293', '311', '350', '360', '381', '410', '462', '466', '477'],
                    FSHN: ['INC', '120', '140', '220', '302', '322', '329', '344', '428'],
                    GEOG: ['EXC', '100', '103', '210', '222', '280', '370', '371', '379', '380', '392', '401', '405', '406', '421', '459', '477', '478', '479', '482', '489'],
                    GEOL: ['INC', '201'],
                    GLBL: ['EXC', '118', '200', '225', '296', '298', '492', '494', '495', '499'],
                    HDES: ['INC', '410'],
                    IE: ['INC', '340', '445'],
                    INFO: ['EXC', '102'],
                    IS: ['EXC', '457'],
                    NEUR: ['EXC', '314', '419', '432', '461', '462', '481'],
                    NPRE: ['INC', '101', '480', '481', '483'],
                    NRES: ['INC', '101', '103', '109', '202', '210', '220', '223', '242', '287', '310', '325', '423', '424', '425', '426', '428'],
                    NUTR: ['INC', '428'],
                    PSYC: ['EXC', '235', '301', '432'],
                    RHET: ['INC', '233'],
                    SE: ['INC', '361', '400'],
                    SOCW: ['EXC', '225'],
                    TE: ['EXC', '345'],
                    TSM: ['INC', '1XX', '2XX'],
                    UP: ['EXC', '116', '316', '417'],
                    SUBJECT_ALL: ['AAS', 'ACES', 'ADV', 'AFRO', 'AFST', 'AGED', 'AIS', 'ALEC', 'ANTH', 'ART', 'ARTD', 'ARTE', 'ARTF', 'ARTH', 'ARTJ', 'ARTS', 'ASST', 'BADM', 'BDI',
                                    'BTW', 'BUS', 'CHP', 'CI', 'CLCV', 'CMN', 'CW', 'CWL', 'DANC', 'EALC', 'EDUC', 'ENGL', 'ENSU', 'EPOL', 'EPS', 'EURO', 'FAA', 'FIN', 'GCL', 'GSD',
                                    'GWS', 'HDFS', 'HIST', 'HORT', 'HRD', 'HUM', 'IHLT', 'JOUR', 'JS', 'KIN', 'LA', 'LAST', 'LAW', 'LEAD', 'LER', 'LING', 'LLS', 'MACS', 'MDIA', 'MDVL',
                                    'MFST', 'MUS', 'MUSC', 'MUSE', 'PHIL', 'PLPA', 'PS', 'REES', 'REHB', 'REL', 'RMLG', 'RSOC', 'RST', 'SAME', 'SHS', 'SLAV', 'SLCL', 'SLS', 'SOC',
                                    'SPED', 'THEA', 'TMGT', 'TRST', 'WRIT']
    };

    results = [];
    for(var index = 0; index < allCourses.length; ++index) {
        var course = allCourses[index];
        var courseNum = parseInt(course.number, 10);
        // Filters by every single category if enabled
        if(subjectQuery !== '' && subjectQuery !== course.subject) continue;
        if(numberQuery !== '' && numberQuery !== course.number) continue;
        if(courseNum !== '' && isNaN(courseNum)) continue;
        if(courseNum < filters.minNum || courseNum > filters.maxNum) continue;
        if(course.gpa < filters.minGPA || course.gpa > filters.maxGPA) continue;
        if(filters.filterGenEd) {
            if(filters.humanities && !course.fulfilled_reqs.includes('HP') && !course.fulfilled_reqs.includes('LA')) continue;
            if(!filters.humanities && (course.fulfilled_reqs.includes('HP') || course.fulfilled_reqs.includes('LA'))) continue;
            if(filters.social && !course.fulfilled_reqs.includes('BS') && !course.fulfilled_reqs.includes('SS')) continue;
            if(!filters.social && (course.fulfilled_reqs.includes('BS') || course.fulfilled_reqs.includes('SS'))) continue;
            if(filters.libed) {
                if(libeds[course.subject] !== undefined && libeds[course.subject] !== null) {
                    var hasRange = libeds[course.subject].includes(course.number.charAt(0)+'XX');
                    var hasNumber = libeds[course.subject].includes(course.number);
                    if(libeds[course.subject][0] === 'INC' && !hasRange && !hasNumber) continue;
                    if(libeds[course.subject][0] === 'EXC' && (hasRange || hasNumber)) continue;
                }
                else if(!libeds.SUBJECT_ALL.includes(course.subject)) continue;
            }
        }
        if(filters.filterCultural) {
            if(filters.western && !course.fulfilled_reqs.includes('WCC')) continue;
            if(!filters.western && course.fulfilled_reqs.includes('WCC')) continue;
            if(filters.nonwestern && !course.fulfilled_reqs.includes('NW')) continue;
            if(filters.nonwestern && course.fulfilled_reqs.includes('NW')) continue;
            if(filters.usmin && !course.fulfilled_reqs.includes('US')) continue;
            if(!filters.usmin && course.fulfilled_reqs.includes('US')) continue;
        }
        if(filters.filterAdvComp && !course.fulfilled_reqs.includes('ACP')) continue;
        if(!filters.filterAdvComp && course.fulfilled_reqs.includes('ACP')) continue;
        // Else, we should add the course to our filtered results
        results.push(course);
    }
    results.sort(function(course1, course2) {
        if(course1.subject < course2.subject) return -1;
        if(course1.subject > course2.subject) return 1;
        var course1Num = parseInt(course1.number, 10);
        var course2Num = parseInt(course2.number, 10);
        if(course1Num < course2Num) return -1;
        if(course1Num > course2Num) return 1;
        return 0;
    });

    return (
        <div>
            <br></br>
            <Table id="search_res_table">
                <thead>
                    <tr>
                        <th scope="col">
                            Class
                        </th>
                        <th scope="col">
                            Credit Hours
                        </th>
                        <th scope="col">
                            Course Info
                        </th>
                        <th scope="col">
                            Requirements Fulfilled
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((className, index) => (
                        <tr key={index}>
                            <td>
                                {className.subject+' '+className.number}
                            </td>
                            <td>
                                {className.hours}
                            </td>
                            <td>
                                <button type="button" className="btn btn-outline-secondary" id="show_class" onClick={e => showClass(className)}>
                                    Show
                                </button>
                            </td>
                            <td>
                                <button type="button" className="btn btn-outline-secondary" id="show_class" onClick={e => showClassReqs(className)}>
                                    Show
                                </button>
                            </td>
                            <td>
                                <button type="button" className="btn btn-outline-primary" id="add_class" onClick={e => addClass(className)}>
                                    Add
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default SearchResults;
