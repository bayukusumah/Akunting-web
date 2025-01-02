import React, { useState, useEffect } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import moment from "moment";

function BukuBesarPage() {
    const [ledgers, setLedgers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(101);
    useEffect(() => {
        // Fetch list of accounts
        fetch('http://localhost:7000/api/accounts')
            .then((res) => res.json())
            .then((data) => {
                setAccounts(data.data);
                setSelectedAccount(data.data[0]?.code || 101);
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:7000/api/transactions/ledger/${selectedAccount}?page=${currentPage}`)
            .then((res) => res.json())
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
                    
                setLedgers(data.data);
                setTotalPages(data.totalPages);
                setLoading(false);
            });
    },  [selectedAccount, currentPage]);

    const handleAccountChange = (event) => {
        setSelectedAccount(event.target.value);
        setCurrentPage(1); // Reset to first page
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Buku Besar</h2>
            </div>
                {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <div>
                            <div className='d-flex align-items-end flex-column mb-3'>
                                <div className='p-2'>
                                       <div className='input-group'>     
                                        <span className='input-group-text'>Akun</span> 
                                            <select
                                                id="accountSelect"
                                                className="form-select"
                                                value={selectedAccount}
                                                onChange={handleAccountChange}>
                                                {accounts.map((account,index) => (
                                                    <option key={index + 1} value={account.code}>
                                                        {account.code +" - "+ account.name}
                                                    </option>
                                                ))}
                                            </select></div>
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
                                        <th>Credit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {ledgers.map((ledger, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{ledger.date}</td>
                                        <td>{ledger.descriptions}</td>
                                        <td>{ledger.hal}</td>
                                        { ledger.type === 'debit' &&
                                            <td>{ledger.amount}</td>
                                        }  
                                        { ledger.type === 'debit' &&
                                            <td></td>
                                        }  
                                        { ledger.type === 'kredit' &&
                                            <td></td>
                                        }
                                        { ledger.type === 'kredit' &&
                                            <td>{ledger.amount}</td>
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
                </div>
    );
}

export default BukuBesarPage;