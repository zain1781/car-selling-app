import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import Main from "./components/Main";
import Cardetails from "./components/Cardetails";
import Auth from "./components/Auth";
import Signup from "./components/auth/Signup";
import File from "./components/File";
import Contact from "./components/Contact";
import About from "./components/About";
import Addvehicle from "./components/admin/Addvehicle";
import Dashboard from "./components/admin/Dashboard";
import AdminLayout from "./components/admin/Adminlayout";
import User from "./components/admin/User";
import ListV from "./components/admin/ListV";
import Updatevei from "./components/admin/Updatevei";
import Carsdetails from "./components/admin/Carsdetails";
import Carsregister from "./components/admin/Carsregister";
import Contacts from "./components/admin/Contacts";
import Cblogs from "./components/admin/Cblogs";
import Orders from "./components/admin/Orders";
import Carsinventory from "./components/admin/CarsInventory";
import Traceshipment from "./components/admin/TraceShipment";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Hero from "./components/Hero";
import Userinventory from "./components/user/Userinventory";
import UDashboard from "./components/user/UDashboard";
import AddVeh from "./components/user/AddVeh";
import Forgetpass from "./components/user/Forgetpass";
import Resetpass from "./components/auth/Resetpass";
import Token from "./components/auth/Token";
import Registercars from "./components/user/Registercars";
import Finance from "./components/user/Finance";
import Traceveih from "./components/user/Traceveih";
import Manageinv from "./components/user/Manageinv";
import Wishlist from "./components/user/Wishlist";
import Invoice from "./components/admin/Invoice";
import { VerifyPayment } from "./components/user/VerifyPayemnt";
import Blogs from "./components/Blogs";
import CarRegistration from "./components/Carregisteration";
import Showblogs from "./components/admin/Showblogs"
import Blog from "./components/Blog";
import Allrecords from "./components/user/Allrecords";
import Ordersss from "./components/user/Ordersss";
import Alldata from "./components/admin/Alldata";
import VerifyBank from "./components/user/Verifybank";
import Wiret from "./components/admin/Wiret";
import Updatew from "./components/admin/UpdateW";
import Docs from "./components/admin/Docs";
import Walletuser from "./components/user/Walletuser";
import Wallets from "./components/admin/Wallets";
import Esiitmation from "./components/admin/Estimation";
import Dshipment from "./components/admin/Dshipment";
import Dorder from "./components/admin/Dorder";
import Destimation from "./components/admin/Destimation";
import AddEmployee from "./components/admin/AddEmployee";
import Allemployess from "./components/admin/Allemployess";
import UpdateEmployee from "./components/admin/UpdateEmployee";
import Addrent from "./components/admin/Addrent";
import Allrent from "./components/admin/Allrent";
import Verifywallet from "./components/user/Verifywallet";
import Dloads from "./components/Dloads";
import Fetchesti from "./components/admin/Fetchesti";
import InOut from "./components/admin/InOut";
import MainA from "./components/admin/MainA";
import Wallet from "./components/admin/Wallet";
import Transaction from "./components/admin/Transaction";
import UpdateRent from "./components/admin/UpdateRent";
import Updateuser from "./components/admin/Updateuser";
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  
  return (
    <>
      {/* Show Navbar only for non-admin routes */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<Main />} />
        <Route path="/inventory" element={<Products />} />
        <Route path="/inventory/:id" element={<Cardetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/car-register" element={<CarRegistration />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/download" element={<Dloads />} />


        {/* ✅ Authentication Routes */}
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/resetpassword/:token" element={<Resetpass />} />
        <Route path="/verify/:token" element={<Token />} />
        <Route path="/payment/:token" element={<VerifyPayment />} />
        <Route path="/bank/:token" element={<VerifyBank />} />
        <Route path="/wallet/:token" element={<Verifywallet />} />


        {/* ✅ User Routes */}
        <Route path="/user/dashboard" element={<UDashboard />} />
        <Route path="/user/add/car" element={<AddVeh />} />
        <Route path="/user/change-pass" element={<Forgetpass />} />
        <Route path="/user/info/car" element={<Userinventory />} />
        <Route path="/user/register/car" element={<Registercars />} />
        <Route path="/user/finance" element={<Finance />} />
        <Route path="/user/trace_car" element={<Traceveih />} />
        <Route path="/user/manage_inv" element={<Manageinv />} />
        <Route path="/user/wishlist" element={<Wishlist />} />
        <Route path="/user/wallet" element={<Walletuser />} />  
        <Route path="/user/allrecords" element={<Allrecords />} />
        <Route path="/user/data/:id" element={<Ordersss />} />



        {/* ✅ Protected Admin Routes */}
   <Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRoles={["staff","admin"]}>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="add" element={<Addvehicle />} />
  <Route path="update/:id" element={<Updatevei />} />
  <Route path="users/cars/:id" element={<Carsdetails />} />
  <Route path="users" element={<User />} />
  <Route path="list" element={<ListV />} />
  <Route path="cars/register" element={<Carsregister />} />
  <Route path="contacts" element={<Contacts />} />
  <Route path="blogs" element={<Cblogs />} />
  <Route path="orders/cars" element={<Orders />} />
  <Route path="inventory/cars/:id" element={<Carsinventory />} />
  <Route path="traceshipment" element={<Traceshipment />} />
  <Route path="invoice" element={<Invoice />} />
  <Route path="all/blogs" element={<Showblogs />} />
  <Route path="finance/data" element={<MainA />} />
  <Route path="wire/set" element={<Wiret />} />
  <Route path="update/wire/:id" element={<Updatew />} />
  <Route path="docs" element={<Docs />} />
  <Route path="wallets" element={<Wallets />} />
  <Route path="shipment/:id" element={<Dshipment />} />
  <Route path="orders/:id" element={<Dorder />} />
  <Route path="estimation" element={<Esiitmation />} />
  <Route path="estimated/:id" element={<Destimation />} />
  <Route path="add/employee" element={<AddEmployee />} />
  <Route path="all/employee" element={<Allemployess />} />
  <Route path="update/employee/:id" element={<UpdateEmployee />} />
  <Route path="add/rent" element={<Addrent />} />
  <Route path="all/rent" element={<Allrent />} />
  <Route path="info/:id" element={<Fetchesti />} />
  <Route path="info/inout" element={<InOut />} />
  <Route path="info/transaction" element={<Transaction />} />
  <Route path="all/finance" element={<Alldata />} />
  <Route path="update/rent/:id" element={<UpdateRent />} />
  <Route path="update/user/:id" element={<Updateuser />} />
  <Route path="wallet/admin" element={<Wallet />} />
</Route>


        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Show Hero & File components only for non-admin routes */}
      {!isAdminRoute && <Hero />}
      {!isAdminRoute && <File />}
    </>
  );
}

export default App;
