import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFormData } from '../../state/settings/settingsData';
import { OuterClick } from 'react-outer-click';

const SettingsCollapse = ({ selectedNumber }) => {
    const [isEditing, setIsEditing] = useState({ bet: false, skipSteps: false });
    const [bet, setBet] = useState('');
    const [mode, setMode] = useState('risky');
    const [skipSteps, setSkipSteps] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch();

    const handleModeSelect = (selectedMode) => {
        setMode(prevMode => prevMode === selectedMode ? '' : selectedMode);
        handleFormSubmit();
    };

    useEffect(() => {
        const key = `formData_${selectedNumber}`; // Construct the key
        const savedFormData = JSON.parse(localStorage.getItem(key));
        if (savedFormData) {
            setBet(savedFormData.bet);
            setMode(savedFormData.mode);
            setSkipSteps(savedFormData.skipSteps);
        } else {
            setBet('1'); 
            setSkipSteps('0');
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
        setIsEditing({ bet: false, skipSteps: false });
    };

    const handleClickOutside = () => {
        if (isEditing.bet || isEditing.skipSteps) {
            handleFormSubmit();
        }
    };

    return (
        <OuterClick onOuterClick={handleClickOutside}>
            <div className="row mb-3 justify-content-between">
                {/* Bet input */}
                <div className="col">
                    {isEditing.bet ? (
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Bet"
                            value={bet}
                            onChange={(e) => setBet(e.target.value)}
                        />
                    ) : (
                        <h5 onClick={() => setIsEditing({ ...isEditing, bet: true })} style={{ color: '#C8CCCE' }}>
                            {bet}
                        </h5>
                    )}
                </div>
                {/* Skip steps input */}
                <div className="col">
                    {isEditing.skipSteps ? (
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Skip Steps"
                            value={skipSteps}
                            onChange={(e) => setSkipSteps(e.target.value)}
                        />
                    ) : (
                        <h5 onClick={() => setIsEditing({ ...isEditing, skipSteps: true })} style={{ color: '#C8CCCE' }}>
                            {skipSteps}
                        </h5>
                    )}
                </div>
                {/* Mode dropdown */}
                <div className="col">
            <div className="btn-group">
                <button
                    type="button"
                    className={`btn btn-sm ${mode === 'safe' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleModeSelect('safe')}
                >
                    Safe
                </button>
                <button
                    type="button"
                    className={`btn btn-sm ${mode === 'risky' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleModeSelect('risky')}
                >
                    Risky
                </button>
            </div>
        </div>
            </div>
        </OuterClick>
    );
};

export default SettingsCollapse;