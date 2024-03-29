import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFormData } from '../../state/settings/settingsData';

const SettingsCollapse = ({ isSettingsOpen, selectedNumber }) => {
    const [bet, setBet] = useState('');
    const [mode, setMode] = useState('');
    const [skipSteps, setSkipSteps] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch();

    const handleMenuToggle = () => {
        setMenuOpen(prevState => !prevState); 
    };

    const handleModeSelect = (mode) => {
        setMode(mode);
        setMenuOpen(false); 
    };

    useEffect(() => {
        const key = `formData_${selectedNumber}`; // Construct the key
        const savedFormData = JSON.parse(localStorage.getItem(key));
        if (savedFormData) {
            setBet(savedFormData.bet);
            setMode(savedFormData.mode);
            setSkipSteps(savedFormData.skipSteps);
        }
    }, [selectedNumber]);

    const handleFormSubmit = () => {
        const formData = {
            bet,
            mode,
            skipSteps
        };
        const key = `formData_${selectedNumber}`; // Append selectedNumber to the key
        localStorage.setItem(key, JSON.stringify(formData));
        dispatch(setFormData(formData));
    };

    return (
        <div style={{ display: isSettingsOpen ? 'block' : 'none' }}>
            {/* First row */}
            <div className="row mb-3 justify-content-between">
                {/* Bet input */}
                <div className="col">
                    <input type="text" className="form-control form-control-sm" placeholder="Bet" value={bet} onChange={(e) => setBet(e.target.value)} />
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
