import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';

function NeracaLajurPage() {    
    const [NeracaLajur, setNeracaLajur] = useState([]);
    const [NeracaLajurTotal, setNeracaLajurTotal] = useState([]);
    const [labaBersih,setlabaBersih] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:7000/api/transactions/neraca-lajur`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setNeracaLajur(data.data);
                setNeracaLajurTotal(data.total);
                setlabaBersih(data.bersih);
                setLoading(false); 
            });
           
    },  []);
    const formatValue = (value) => {
        console.log(value);
        if (value === 0) return "-";
        if (value === "0") return "-";
        if (value === undefined) return "-";
        const amountTmp = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
            }).format(value);
        const hasil = amountTmp.replace("Rp", "");
        return hasil;    
      };
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Neraca</h2>
            </div>
                {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <Table striped bordered hover align-middle>
                            <thead>
                                <tr>
                                    <th rowSpan={2}>Kode</th>
                                    <th rowSpan={2}>Nama Akun</th>
                                    <th colSpan={2}>Neraca Saldo</th>
                                    <th colSpan={2}>Penyesuaian</th>
                                    <th colSpan={2}>Neraca Saldo <br/> Setelah Penyesuaian</th>
                                    <th colSpan={2}>Rugi Laba</th>
                                    <th colSpan={2}>Modal</th>
                                    <th colSpan={2}>Neraca</th>
                                </tr>
                                <tr>
                                    <th>Debit</th>
                                    <th>Credit</th>
                                    <th>Debit</th>
                                    <th>Credit</th>
                                    <th>Debit</th>
                                    <th>Credit</th>
                                    <th>Debit</th>
                                    <th>Credit</th>
                                    <th>Debit</th>
                                    <th>Credit</th>
                                    <th>Debit</th>
                                    <th>Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                            {NeracaLajur.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.akun?.code}</td>
                                    <td>{item.akun?.name}</td>
                                    <td>{formatValue(item.neracaSaldo?.debit)}</td>
                                    <td>{formatValue(item.neracaSaldo?.kredit)}</td>
                                    <td>{formatValue(item.neracaPenyesuaian?.debit)}</td>
                                    <td>{formatValue(item.neracaPenyesuaian?.kredit)}</td>
                                    <td>{formatValue(item.saldoPenyesuaian?.debit )}</td>
                                    <td>{formatValue(item.saldoPenyesuaian?.kredit )}</td>
                                    <td>{formatValue(item.rugiLaba?.debit )}</td>
                                    <td>{formatValue(item.rugiLaba?.kredit )}</td>
                                    <td>{formatValue(item.neracaModal?.debit )}</td>
                                    <td>{formatValue(item.neracaModal?.kredit )}</td>
                                    <td>{formatValue(item.neracaNeraca?.debit )}</td>
                                    <td>{formatValue(item.neracaNeraca?.kredit )}</td>
                                </tr>
                            ))}
                               <tr>
                                  
                                  <td colSpan={2}></td> 
                                  <td>{formatValue(NeracaLajurTotal.debitSaldo)}</td>
                                  <td>{formatValue(NeracaLajurTotal.kreditSaldo)}</td>
                                  <td>{formatValue(NeracaLajurTotal.debitSesuai)}</td>
                                  <td>{formatValue(NeracaLajurTotal.kreditSesuai)}</td>
                                  <td>{formatValue(NeracaLajurTotal.debitSaldoSesuai)}</td>
                                  <td>{formatValue(NeracaLajurTotal.kreditSaldoSesuai)}</td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                               </tr>
                               <tr>
                                  <td colSpan={8}>Laba Bersih</td> 
                                  <td>{formatValue(labaBersih.bersihDebit)}</td>
                                  <td></td>
                                  <td></td>
                                  <td>{formatValue(labaBersih.bersihDebit)}</td>
                                  <td></td>
                                  <td></td>
                               </tr>
                               <tr>
                                    <td colSpan={8}>Modal Akhir</td>
                                    <td></td>
                                    <td></td>
                                    <td>{formatValue(NeracaLajurTotal.debitModal)}</td>
                                    <td></td> 
                                    <td></td>
                                    <td>{formatValue(NeracaLajurTotal.debitModal)}</td>
                                    
                               </tr>
                               <tr>
                                    <td colSpan={8}></td>
                                    <td></td>
                                    <td></td>
                                    <td>{formatValue(NeracaLajurTotal.debitModal)}</td>
                                    <td>{formatValue(NeracaLajurTotal.kreditModal)}</td> 
                                    <td>{formatValue(NeracaLajurTotal.debitNeraca)}</td>
                                    <td>{formatValue(NeracaLajurTotal.KreditNeraca)}</td>
                               </tr>
                            </tbody>
                        </Table>  
                    )}
                </div>
    );
}

export default NeracaLajurPage; 