import React,{useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './page/HomePage';
import BukuBesarPage from './page/BukuBesarPage';
import AkunPage from './page/AkunPage';
import JurnalPage from './page/JurnalPage';
import NeracaLajur from './page/NeracaLajurPage';
import Setting from './page/SettingPage';

function App() {
    const [menuHidden, setMenuHidden] = useState(false);
  return (
    <Router>
        <div className="app-container d-flex">

            <div className={`sidebar bg-orange ${menuHidden ? 'hidden' : ''}`}>
                <button className="btn btn-primarys toggle-button"
                        onClick={() => setMenuHidden(!menuHidden)}>
                        {menuHidden ? '>>' : '<<'}
                </button>
                <nav className="nav" >
                    <ul className="nav flex-column mt-5">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Dasboard</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/akun">Akun</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/jurnal">Jurnal</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/bukuBesar">Buku Besar</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/neracaLajur">Neraca Lajur</a>
                        </li>
                        <li className="nav-item">
                            <hr className="hr" style={{color:"white"}} />
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/setting">Setting</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className={`content flex-grow-1 p-3 ${menuHidden ? 'content-expanded' : ''}`}>
                    <h1 className="text-center mb-4">Aplikasi Akuntasi</h1>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/akun" element={<AkunPage />} />
                        <Route path="/jurnal" element={<JurnalPage />} />
                        <Route path="/bukuBesar" element={<BukuBesarPage />} />
                        <Route path="/neracaLajur" element={<NeracaLajur />}/>
                        <Route path="/setting" element={<Setting />} />
                    </Routes>
            </div>
        </div>
    </Router>
  );
}

export default App;

