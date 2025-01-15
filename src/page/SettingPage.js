import React, { useState, useEffect } from 'react';
//import { Button, Table, Modal, Pagination } from 'react-bootstrap';


function SettingPage() {
    const [formData, setFormData] = useState({
        pendapatan: 0,
        beban: 0,
        modal : 0
    });
    const [isClicked, setIsCliked] = useState(false);
    const [errors, setErrors] = useState({});
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const validateForm = () => {
        const newErrors = {};
        if(formData.pendapatan !==0){
            if (!formData.pendapatan || !/^[0-9]+$/.test(formData.pendapatan)) {
                newErrors.pendapatan = 'Pendapatan must be a valid number.';
            }
        }else{
            newErrors.pendapatan = 'Pendapatan is required.';
        }
        if(formData.beban !==0){
            if (!formData.beban || !/^[0-9]+$/.test(formData.beban)) {
                newErrors.beban = 'Beban must be a valid character.';
            }
        }else{
            newErrors.beban = 'Beban is required.';
        }   
        if(formData.modal !==0){
            if (!formData.modal || !/^[0-9]+$/.test(formData.modal)) {
                newErrors.modal = 'Modal must be a valid character.';
            }
        }else{
            newErrors.modal = 'Modal is required.';
        }      
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        fetch('http://localhost:7000/api/setting/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                setFormData({ pendapatan: 0, beban: 0 ,modal : 0});
                setIsCliked(bool => !bool);
            })
            .catch((error) => console.error('Error adding akun:', error));    
    };
    
    useEffect(() => {
        fetch(`http://localhost:7000/api/setting/list`)
            .then((res) => res.json())
            .then((data) => {
                const hasil = data.data;
                if(hasil.length >0){
                setFormData({ pendapatan: hasil[0].pendapatan, 
                    beban: hasil[0].beban,
                    modal: hasil[0].modal,
                    utang: hasil[0].utang});
                }
            });
    }, [isClicked]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Setting</h2>
            </div>     

                <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Pedapatan</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.pendapatan ? 'is-invalid' : ''}`}
                                    name="pendapatan"
                                    value={formData.pendapatan}
                                    isInvalid={!!errors.pendapatan} 
                                    onChange={handleInputChange}/>
                                {errors.pendapatan && <div className="invalid-feedback">{errors.pendapatan}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Beban</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.beban ? 'is-invalid' : ''}`}
                                    name="beban"
                                    isInvalid={!!errors.beban} 
                                    value={formData.beban}
                                    onChange={handleInputChange}/>
                                {errors.beban && <div className="invalid-feedback">{errors.beban}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Modal</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.modal ? 'is-invalid' : ''}`}
                                    name="modal"
                                    isInvalid={!!errors.modal} 
                                    value={formData.modal}
                                    onChange={handleInputChange}/>
                                {errors.modal && <div className="invalid-feedback">{errors.modal}</div>}
                            </div>
                            <button type="submit" className="btn btn-success">
                                Simpan
                            </button>
                        </form>
        </div>
    );
}

export default SettingPage;