import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Pagination } from 'react-bootstrap';


function AkunPage() {
    const [akuns, setakuns] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
    });
    const [errors, setErrors] = useState({});
    const [isClicked, setIsCliked] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const validateForm = () => {
        const newErrors = {};
        if(formData.code !==""){
            if (!formData.code || !/^[0-9]+$/.test(formData.code)) {
                newErrors.code = 'Akun must be a valid number.';
            }
        }else{
            newErrors.code = 'Akun is required.';
        }
        if(formData.name !==""){
            if (!formData.name || !/^[\w ]+$/.test(formData.name)) {
                newErrors.name = 'Nama must be a valid character.';
            }
        }else{
            newErrors.name = 'Name is required.';
        }    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        fetch('http://localhost:7000/api/accounts/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                setFormData({ code: '', name: ''});
                setShowModal(false);
                setIsCliked(bool => !bool);
            })
            .catch((error) => console.error('Error adding akun:', error));    
    };
    
    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:7000/api/accounts/list?page=${currentPage}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setakuns(data.data);
                setTotalPages(data.totalPages);
                setLoading(false);
            });
    }, [currentPage,isClicked]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Data Akun</h2>
                 <Button className="mb-3" onClick={() => setShowModal(true)}>
                    Tambah Akun
                 </Button>
            </div>     
                {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Akun</th>
                                <th>Nama</th>
                            </tr>
                        </thead>
                        <tbody>
                            {akuns.map((akun,index) => (
                                <tr key={index + 1 }>
                                    <td>{index + 1}</td>
                                    <td>{akun.code}</td>
                                    <td>{akun.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    )}
                    <Pagination>
                    <Pagination.Prev
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        />
                         {currentPage > 3 && (
                            <>
                                <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
                                <Pagination.Ellipsis />
                            </>
                        )}
                        {[...Array(totalPages).keys()].map((page) => (
                            <Pagination.Item
                                key={page + 1}
                                active={page + 1 === currentPage}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                {page + 1}
                            </Pagination.Item>
                        ))}
                         {currentPage < totalPages - 2 && (
                            <>
                                <Pagination.Ellipsis />
                                <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                                    {totalPages}
                                </Pagination.Item>
                            </>
                        )}
                         <Pagination.Next
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        />
                    </Pagination>
             <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Jurnal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Akun</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                                    name="code"
                                    value={formData.code}
                                    isInvalid={!!errors.code} 
                                    onChange={handleInputChange}/>
                                {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Nama</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    name="name"
                                    isInvalid={!!errors.name} 
                                    value={formData.name}
                                    onChange={handleInputChange}/>
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            <button type="submit" className="btn btn-success">
                                Simpan
                            </button>
                        </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default AkunPage;