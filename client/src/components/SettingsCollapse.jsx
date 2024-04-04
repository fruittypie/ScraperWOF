import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setFormData } from '../../state/settings/settingsData';
import { OuterClick } from 'react-outer-click';
import '../styles/SettingsCollapse.css';


const SettingsCollapse = ({ selectedNumber }) => {
    const [isEditing, setIsEditing] = useState({ bet: false, skipSteps: false });
    const [bet, setBet] = useState('');
    const [mode, setMode] = useState('');
    const [skipSteps, setSkipSteps] = useState('');
    const dispatch = useDispatch();
    const inputRef = useRef(null);

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

    const handleModeSelect = (selectedMode) => {
        setMode(selectedMode);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          handleFormSubmit();
        }
    };

    useEffect(() => {
        if (isEditing && inputRef.current) {
          inputRef.current.focus();
        }
    }, [isEditing]);

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

    const handleClickOutside = () => {
        if (isEditing.bet || isEditing.skipSteps) {
            handleFormSubmit();
        }
    };

    const handleInputClick = (inputType) => {
        if (inputType === 'bet') {
          setIsEditing({ bet: true, skipSteps: false });
        } else {
          setIsEditing({ bet: false, skipSteps: true });
        }
    };

    return (
        <OuterClick onOuterClick={handleClickOutside}>
            <div className="row mt-1">
                {/* Bet input */}
                <div className="col d-flex align-items-center">
                    {isEditing.bet ? (
                        <input
                            type="text"
                            className="form-control form-control-sm setting-form"
                            placeholder="Bet"
                            ref={inputRef}
                            value={bet}
                            onChange={(e) => setBet(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    ) : (
                        <h6 onClick={() => handleInputClick('bet')} 
                            className="m-0"
                        >
                            Bet: {bet}
                        </h6>
                    )}
                </div>
                {/* Skip steps input */}
                <div className="col d-flex align-items-center">
                    {isEditing.skipSteps ? (
                        <input
                            type="text"
                            className="form-control form-control-sm setting-form"
                            placeholder="Steps"
                            ref={inputRef}
                            value={skipSteps}
                            onChange={(e) => setSkipSteps(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    ) : (
                        <h6 onClick={() => handleInputClick('skipSteps')}
                            className="m-0"
                        >
                            Steps: {skipSteps}
                        </h6>
                    )}
                </div>
                {/* Mode */}
                <div className="col col-md-8 d-flex justify-content-end">
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
                    Risk
                </button>
            </div>
        </div>
            </div>
        </OuterClick>
    );
};

export default SettingsCollapse;