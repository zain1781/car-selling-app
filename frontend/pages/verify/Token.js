import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const VerifyEmail = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const router = useRouter();
    const { token } = router.query;
    const [status, setStatus] = useState('Verifying...');

    useEffect(() => {
        if (token) {
            verifyEmail();
        }
    }, [token]);

    const verifyEmail = async () => {
        try {
            const response = await fetch(`${apiUrl}users/verify/${token}`, {
                method: 'GET',
            });
            const data = await response.json();

            if (response.ok) {
                setStatus('Email verified successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setStatus(data.message || 'Verification failed');
            }
        } catch (error) {
            setStatus('An error occurred during verification');
        }
    };

    return (
        <div className="verification-container">
            <h1>Email Verification</h1>
            <p>{status}</p>
        </div>
    );
};

export default VerifyEmail; 