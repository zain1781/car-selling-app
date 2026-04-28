import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Verifywallet = () => {
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
            await fetch(`${apiUrl}wallet/verify/${token}`, {
                method: 'GET',
            });
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error('Verification error:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Wallet Verified</h1>
            </div>
        </div>
    );
};

export default Verifywallet;
