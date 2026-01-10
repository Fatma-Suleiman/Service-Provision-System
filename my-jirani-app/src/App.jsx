
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from '../components/Footer';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ServiceList from './components/ServiceList';
import ServiceDetail from './components/ServiceDetail';
import CategoriesScreen from './screens/CategoriesScreen';
import ApplyServiceScreen from './screens/ApplyServiceScreen'; 
import SeekerProfileScreen from './screens/SeekerProfileScreen';
import ProfilePage from './components/ProfilePage';  
import ProviderProfileScreen from './screens/ProviderProfileScreen';
import ProviderHistoryScreen from './screens/ProviderHistoryScreen';
import ProviderDashboard from './screens/ProviderDashboardScreen';
import ProviderProfileView from './screens/ProviderProfileViewScreen';
import ProviderRequestsScreen from './screens/ProviderRequestsScreen';
 


function App() {
  return (
      <div className="App">
        <Navbar />
        <div className="container my-4">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/about" element={<AboutScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/category/:category" element={<ServiceList />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/categories" element={<CategoriesScreen />} />
            <Route path="/apply-service" element={<ApplyServiceScreen />} />
            <Route path="/seeker-profile" element={<SeekerProfileScreen />} />
            <Route path="/profile" element={<ProfilePage />} />  
            <Route path="/provider/profile" element={<ProviderProfileScreen />}/>
            <Route path="/provider/history" element={<ProviderHistoryScreen />} />
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/provider/my-profile" element={<ProviderProfileView />} />
            <Route path="/provider/requests" element={<ProviderRequestsScreen />} />
          </Routes>
        </div>
        <Footer />
      </div>

  );
}

export default App;
