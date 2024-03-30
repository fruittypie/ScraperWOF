import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFormData } from '../../state/settings/settingsData';
import { OuterClick } from 'react-outer-click';

const SettingsCollapse = ({ selectedNumber }) => {
    const [isEditing, setIsEditing] = useState({ bet: false, skipSteps: false });
    const [bet, setBet] = useState('');
    const [mode, setMode] = useState('');
    const [skipSteps, setSkipSteps] = useState('');
    const dispatch = useDispatch();

    const handleModeSelect = (selectedMode) => {
        console.log('Current mode:', mode); 
        setMode(selectedMode);
    };

    useEffect(() => {
        console.log('Updated mode:', mode);
        handleFormSubmit();
    }, [mode]);

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
        const key = `formData_${selectedNumber}`;
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
                        <p onClick={() => setIsEditing({ ...isEditing, bet: true })} style={{ color: '#C8CCCE' }}>
                            Step:{bet}
                        </p>
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
                        <p onClick={() => setIsEditing({ ...isEditing, skipSteps: true })} style={{ color: '#C8CCCE' }}>
                            {skipSteps}
                        </p>
                    )}
                </div>
                {/* Mode dropdown */}
                <div className="col">
            <div className="btn-group">
                <button
                    type="button"
                    className={`btn btn-sm ${mode === 'safe' ? 'custom-btn-selected' : 'custom-btn-secondary'}`}
                    style={{ 
                        fontWeight: 'bold', 
                        padding: '2px', 
                        color: mode === 'safe' ? '#C8CCCE' : '#696c6e', 
                        textDecoration: mode === 'safe' ? 'underline' : 'none'  }}
                    onClick={() => handleModeSelect('safe')}
                >
                    Safe
                </button>
                <button
                    type="button"
                    className={`btn btn-sm ${mode === 'risky' ? 'custom-btn-selected' : 'custom-btn-secondary'}`}
                    style={{ 
                        fontWeight: 'bold', 
                        padding: '2px', 
                        color: mode === 'safe' ? '#696c6e' : '#C8CCCE',
                        textDecoration: mode === 'safe' ? 'none' : 'underline'
                     }}
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