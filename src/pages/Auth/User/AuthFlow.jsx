import React, { useState } from 'react';
import CreateAccount from '../User/CreateAccount';
import BusinessSetup from '../User/BusinessSetup';
import SignIn from '../User/SignIn';

const AuthFlow = () => {
    const [currentPage, setCurrentPage] = useState('signIn');

    const renderPage = () => {
        switch (currentPage) {
            case 'signIn':
                return <SignIn setPage={setCurrentPage} />;
            case 'createAccount':
                return <CreateAccount setPage={setCurrentPage} />;
            case 'businessSetup':
                return <BusinessSetup setPage={setCurrentPage} />;
            default:
                return <SignIn setPage={setCurrentPage} />;
        }
    };

    return (
        <div>
            {renderPage()}
        </div>
    );
};

export default AuthFlow;