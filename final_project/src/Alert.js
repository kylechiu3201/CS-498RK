import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Alert = ({alert, description, show, setShow}) => {
    const handleClose = () => setShow(false);

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{alert}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {description}
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

export default Alert;
