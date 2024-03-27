import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFormData } from '../../state/settings/settingsData';

const SettingsCollapse = () => {
    const [bet, setBet] = useState('');
    const [total, setTotal] = useState('');
    const [mode, setMode] = useState('');
    const [skipSteps, setSkipSteps] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch();

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    const handleModeSelect = (mode) => {
        setMode(mode);
        setMenuOpen(false); 
    };

    const handleFormSubmit = () => {
        const formData = {
            bet,
            total,
            mode,
            skipSteps
        };
        dispatch(setFormData(formData));
    };

    return (
        <div>
            {/* First row */}
            <div className="row mb-3 justify-content-between">
                {/* Bet input */}
                <div className="col">
                    <input type="text" className="form-control form-control-sm" placeholder="Bet" value={bet} onChange={(e) => setBet(e.target.value)} />
                </div>
                {/* Total input */}
                <div className="col">
                    <input type="text" className="form-control form-control-sm" placeholder="Total" value={total} onChange={(e) => setTotal(e.target.value)} />
                </div>
                {/* Skip steps input */}
                <div className="col">
                    <input type="text" className="form-control form-control-sm" placeholder="Skip Steps" value={skipSteps} onChange={(e) => setSkipSteps(e.target.value)} />
                </div>
                {/* Mode dropdown */}
                <div className="col">
                    <div className="dropdown">
                        <button className="btn btn-sm btn-secondary" type="button" id="modeDropdown" onClick={handleMenuToggle}>
                            Mode
                        </button>
                        <ul className={`dropdown-menu${menuOpen ? ' show' : ''}`} aria-labelledby="modeDropdown">
                            <li><button className="dropdown-item" onClick={() => handleModeSelect('safe')}>Safe</button></li>
                            <li><button className="dropdown-item" onClick={() => handleModeSelect('risky')}>Risk</button></li>
                        </ul>
                    </div>
                </div>
                {/* Submit button */}
                <div className="col-auto">
                    <button className="btn btn-sm custom-btn" onClick={handleFormSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsCollapse;
