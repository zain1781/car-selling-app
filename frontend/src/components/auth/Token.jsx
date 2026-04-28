import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Token = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            verifyEmail();
        }
    }, [token]);

    const verifyEmail = async () => {
        try {
            await fetch(`${apiUrl}users/verify/${token}`, {
                method: 'GET',
            });
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            console.error('Verification error:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Email Verified</h1>
                <p className="text-gray-600">Redirecting to login page...</p>
            </div>
        </div>
    );
};

export default Token;
