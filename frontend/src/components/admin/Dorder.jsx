import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Dorder = () => {
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [car, setCar] = useState(null);
  const { id } = useParams();
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRes = await fetch(`${api}order/${id}`);
        const orderData = await orderRes.json();
        setOrder(orderData.order);

        const userRes = await fetch(`${api}users/${orderData.order.userId}`);
        const userData = await userRes.json();
        setUser(userData);

        const carRes = await fetch(`${api}inventory/${orderData.order.carId}`);
        const carData = await carRes.json();
        setCar(carData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, api]);

  if (!order || !user || !car) return <div className="text-center mt-10 text-gray-600">Loading...</div>;

  const renderTable = (title, data) => (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <table className="table-auto w-full border border-gray-200 rounded-lg shadow-md">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key} className="border-b border-gray-100">
              <td className="p-3 font-medium bg-gray-50 capitalize">{key}</td>
              <td className="p-3">{value?.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {renderTable("Order Information", order)}
      {renderTable("User Information", user)}
      {renderTable("Car Information", car)}
    </div>
  );
};

export default Dorder;
