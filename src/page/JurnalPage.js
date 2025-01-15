// src/pages/JournalPage.js
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Pagination } from 'react-bootstrap';
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from 'react-icons/fa';


function JournalPage() {
    const [accounts, setAccounts] = useState([]);
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ 
        descriptions:'', type:'', amount:'', ref:'',date:'',type_jurnal:'',hal:'' });
    const [errors, setErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isClicked, setIsCliked] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [noJurnal,setNoJurnal] = useState([]);  
    const [noJurnalVal,setNoJurnalVal] = useState(1);  
    const [typeJurnal,setTypeJurnal] =useState("umum");

    function CustomInput({value,onClick}){
        return(
            <div className='input-group' style={{width:'466px'}}>
                <input className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                name='date'
                placeholder='dd/mm/yyyy' 
                type='text' 
                value={value} 
                onClick={onClick} readOnly/>
                <span className='input-group-text'><FaCalendarAlt/></span>
                {errors.date && <div className="invalid-feedback">{errors.date}</div>}
            </div>
        );
    }
    const handleTypeJurnalChange = (e) =>{
        const { value } = e.target;
        setTypeJurnal(value);
        if(typeJurnal !== "umum"){
            setIsCliked(bool => !bool);
          }
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'amount') {
            const formattedValue = value
                .replace(/\D/g, '') // Remove non-numeric characters
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Add commas for thousands
            setFormData({ ...formData, [name]: formattedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    const handleChangeNoVal =(e)=>{
        const { value } = e.target;
        setNoJurnalVal(value);
        if(noJurnalVal > 1){
          setIsCliked(bool => !bool);
        }
    };
    const validateDate = (date) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if(date === 'Invalid date') return 'date not be empty';
        if (!dateRegex.test(date)) return 'Format date must be YYYY-MM-DD';
        const inputDate = moment(new Date(date)).format("YYYY-MM-DD");
        const currentDate = moment(new Date()).format("YYYY-MM-DD");
        if (inputDate !== currentDate) return "The date is not the same as today's date";
        return null;
    };

    const validateForm = () => {
        const newErrors = {};

        if(formData.descriptions !== ''){
            if (!formData.descriptions || !/^[a-zA-Z ]+$/.test(formData.descriptions)) {
                newErrors.descriptions = 'Account must be a valid character.';
            }
        }else{

            newErrors.descriptions = 'Account is required.';
        }

        if(formData.type !== ''){
            if (!formData.type || !/^[a-zA-Z]+$/.test(formData.type)) {
                newErrors.type = 'Type must be a valid character.';
            }
        }else{
            newErrors.type = 'Type is required.';
        }
        if(formData.hal !== ''){
            if (!formData.hal  || !/^[0-9]+$/.test(formData.hal )) {
                newErrors.hal = 'Nomor jurnal page must be a valid number.';
            }
        }else{
            newErrors.hal = 'Nomor jurnal page is required.';
        }
        if(formData.amount !== ''){
            const amountTemp= formData.amount.replaceAll(".","");
            if (!amountTemp || !/^[0-9]+$/.test(amountTemp)) {
                newErrors.amount = 'Amount must be a valid number.';
            }
        }else{
            newErrors.amount = 'Amount is required.';
        }
        if(formData.ref !== ''){
            if (!formData.ref || !/^[0-9]+$/.test(formData.ref)) {
                newErrors.ref = 'Ref must be a valid number.';
            }
        }else{
            newErrors.ref = 'Ref is required.';
        }

        if(formData.type_jurnal !== ''){
            if (!formData.type_jurnal || !/^[a-zA-Z ]+$/.test(formData.type_jurnal)) {
                newErrors.type_jurnal = 'Type jurnal must be a valid charater.';
            }
        }else{
            newErrors.type_jurnal = 'Type jurnal is required.';
        }
        if(formData.hal !== ''){
            if (!formData.hal || !/^[0-9]+$/.test(formData.hal)) {
                newErrors.hal = 'Hal must be a valid number.';
            }
        }else{
            newErrors.hal = 'Hal is required.';
        }

        // if (!formData.account_id.match(/^[0-9]+$/)) newErrors.description = 'Akun must be a valid number.';
        // if (!formData.type.match(/^[a-zA-Z ]+$/)) newErrors.debit = 'Type must be a valid character.';
        // if (!formData.amount.match(/^[0-9 ]+$/)) newErrors.credit = 'amount must be a valid number.';
        formData.date = moment(startDate).format("YYYY-MM-DD");
        const dateError = validateDate(formData.date);
        if (dateError) newErrors.date = dateError;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return; 
        const amountTemp= formData.amount.replaceAll(".","");
        formData.amount =amountTemp;
        fetch('http://localhost:7000/api/transactions/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                setFormData({ descriptions:'', type:'', amount:'', ref:'',date:'',type_jurnal:'',hal:'' });
                setShowModal(false);
                setIsCliked(bool => !bool);
            })
            .catch((error) => console.error('Error submitting data:', error));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    useEffect(() => {
        // Fetch list of accounts
        fetch('http://localhost:7000/api/accounts')
            .then((res) => res.json())
            .then((data) => {
                setAccounts(data.data);
            });
    }, []);

    useEffect(() => { 
        const fetchHalData = ()=>{
            setLoading(true);    
            fetch(`http://localhost:7000/api/transactions/${typeJurnal}/hal?halaman=${noJurnalVal}`)
                .then((response) => response.json())
                .then((data) => {  
                    setNoJurnal(data.data);
                    setLoading(false);
                    
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                });
        }
        const fetchData =  (page) => {
            setLoading(true);
            fetch(`http://localhost:7000/api/transactions/${typeJurnal}/list?page=${currentPage}&halaman=${noJurnalVal}`)
                .then((response) => response.json())
                .then((data) => {
                   data.data.forEach(result => {
                        result.date = moment(new Date(result.date)).utc().format("DD/MM/YYYY");
                        const amountTmp = new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(result.amount);
                        result.amount = amountTmp.replace("Rp", "");
                      }); 
                      
                    setJournals(data.data);
                    setTotalPages(data.totalPages);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                });
        }
        fetchHalData();
        fetchData(currentPage);
    }, [currentPage,noJurnalVal,typeJurnal,isClicked]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Jurnal {typeJurnal}</h2>
                <Button className="mb-3" onClick={() => setShowModal(true)}>
                    Tambah Jurnal
                </Button>
            </div>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <div>
                            <div className='d-flex align-items-end flex-column mb-3'>
                                <div className='p-2'>
                                       <div className='input-group'>     
                                        <span className='input-group-text'>Hal</span> 
                                        <select 
                                            name="hal"
                                            className={`form-select`}
                                            value={noJurnalVal} 
                                            onChange={handleChangeNoVal}>   
                                            {noJurnal.map((no,index) => (
                                                <option key={index + 1} value={no.hal}>{no.hal}</option>
                                            ))} 
                                           
                                        </select></div>
                                    </div>
                                </div>
                        <div className='d-flex align-items-end flex-column mb-3'>
                            <div className='p-2'>
                                <div className='input-group'>     
                                <span className='input-group-text'>Jurnal</span> 
                                    <select 
                                        name="type_jurnal"
                                        className={`form-select ${errors.type_jurnal ? 'is-invalid' : ''}`}
                                        value={typeJurnal} 
                                        onChange={e => handleTypeJurnalChange(e)}>
                                        <option value="umum">umum</option>
                                        <option value="koreksi">koreksi</option>
                                        <option value="khusus">khusus</option>
                                        <option value="penyesuaian">penyesuaian</option>
                                        <option value="penutup">penutup</option>
                                        <option value="pembalik">pembalik</option>
                                    </select> 
                                </div>
                            </div>                
                        </div>       
                        <div><br/></div> 
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Tanggal</th>
                                    <th>Akun</th>
                                    <th>Ref</th>
                                    <th>Debit</th>
                                    <th>Kredit</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {journals.map((journal, index) => (
                                    <tr key={index + 1}>
                                        <td>{index + 1}</td>
                                        <td>{journal.date}</td>
                                        <td>{journal.descriptions}</td>
                                        <td>{journal.ref}</td>
                                        { journal.type === 'debit' &&
                                            <td>{journal.amount}</td>
                                        }  
                                        { journal.type === 'debit' &&
                                            <td></td>
                                        }  
                                        { journal.type === 'kredit' &&
                                            <td></td>
                                        }
                                        { journal.type === 'kredit' &&
                                            <td>{journal.amount}</td>
                                        }  
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        </div>
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
                        <form onSubmit={handleSubmit} id='jurnal'>
                            <div className="mb-3">
                                <label className='form-label'>Tanggal</label>
                                <div></div>
                                <label>
                                    <DatePicker           
                                         selected={startDate}
                                         onChange={(date) => setStartDate(date)}
                                         dateFormat='dd/MM/YYYY'
                                         customInput={<CustomInput/>}
                                       /> 
                                </label> 
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Type Jurnal</label>
                                <select 
                                    name="type_jurnal"
                                    className={`form-select ${errors.type_jurnal ? 'is-invalid' : ''}`}
                                    value={formData.type_jurnal} 
                                    onChange={e => handleInputChange(e)}>
                                <option value="">Pilih Type Jurnal</option>
                                <option value="umum">jurnal umum</option>
                                <option value="koreksi">jurnal koreksi</option>
                                <option value="khusus">jurnal khusus</option>
                                <option value="penyesuaian">jurnal penyesuaian</option>
                                <option value="penutup">jurnal penutup</option>
                                <option value="pembalik">jurnal pembalik</option>
                               </select> 
                                {errors.type_jurnal && <div className="invalid-feedback">{errors.type_jurnal}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">No Halaman Jurnal</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.hal ? 'is-invalid' : ''}`}
                                    name="hal"
                                    value={formData.hal}
                                    onChange={e => handleInputChange(e)}/>
                                {errors.hal && <div className="invalid-feedback">{errors.hal}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Akun</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.descriptions ? 'is-invalid' : ''}`}
                                    name="descriptions"
                                    value={formData.descriptions}
                                    onChange={e => handleInputChange(e)}/>
                                {errors.descriptions && <div className="invalid-feedback">{errors.descriptions}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Ref</label>
                                    <select
                                        name="ref"
                                        className={`form-select ${errors.ref ? 'is-invalid' : ''}`}
                                        value={formData.ref}
                                        onChange={e => handleInputChange(e)}>
                                            <option value="">Pilih Ref</option>
                                        {accounts.map((account,index) => (
                                            <option key={index + 1} value={account.code}>
                                                {account.code +" - "+ account.name}
                                            </option>
                                        ))}
                                    </select>  
                                {errors.ref && <div className="invalid-feedback">{errors.ref}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Type Pencatatan</label>
                                <select 
                                    name="type"
                                    className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                                    value={formData.type}                             
                                    onChange={e => handleInputChange(e)}>
                                <option value="">Pilih Type Pencatatan</option>
                                <option value="Debit">Debit</option>
                                <option value="Kredit">Kredit</option>
                               </select> 
                                {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Amount</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                    name="amount"
                                    value={formData.amount}
                                    onChange={e => handleInputChange(e)}/>
                                {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
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
export default JournalPage;
