import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import React, { Suspense } from "react";
import { SearchProvider } from "../context/SearchContext";
import { WishlistProvider } from "../context/WishListContext";

const LoginPage = React.lazy(() => import("./components/LoginPage/LoginPage"));

const SignUpPage = React.lazy(() =>
  import("./components/SignUpPage/SignUpPage")
);
import CreateProfile from "./components/SignUpPage/CreateProfile";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
const AboutUs = React.lazy(() => import("./components/AboutUs/AboutUs"));
import ProtectedRoute from "../utils/ProtectedRoute";

const ContactUs = React.lazy(() => import("./components/ContactUs/ContactUs"));

const PrivacyPolicy = React.lazy(() =>
  import("./components/PrivacyPolicy/PrivacyPolicy")
);
import HomePage from "./components/HomePage/HomePage";

const SearchDestinationPage = React.lazy(() =>
  import("./components/SearchDestination/SearchDestinationPage")
);

const CareersPage = React.lazy(() =>
  import("./components/Careers/CareersPage")
);

const DestinationPage = React.lazy(() =>
  import("./components/Destinations/DestinationPage")
);

const TravelTips = React.lazy(() =>
  import("./components/Travel-Tips/TravelTips")
);

const AdminPanel = React.lazy(() =>
  import("./components/AdminPanel/AdminPanel")
);
const CountryDestinationPage = React.lazy(() =>
  import("./components/CountryDestination/CountryDestinationPage")
);
const StateDestinationPage = React.lazy(() =>
  import("./components/Statedestination/StateDestinationPage")
);

const PlanDetails = React.lazy(() =>
  import("./components/PlanDetails/PlanDetails")
);

const MyProfile = React.lazy(() => import("./components/MyProfile/MyProfile"));
import Loader from "./components/Loader";

function App() {
  const location = useLocation(); // Get the current route

  // Conditionally hide Footer on specific routes
  const hideFooterOnRoutes = ["/signup", "/createprofile", "/login"];
  const shouldShowNavbar = !hideFooterOnRoutes.includes(location.pathname);
  const shouldShowFooter = !hideFooterOnRoutes.includes(location.pathname);

  return (
    <div className="bg-[#F8F8F8] ">
      {shouldShowNavbar && <Navbar />}
      {/* Always show Navbar */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <Suspense fallback={<Loader />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<Loader />}>
              <SignUpPage />
            </Suspense>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/createprofile" element={<CreateProfile />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route
            path="/aboutus/privacy-policy"
            element={
              <Suspense fallback={<Loader />}>
                <PrivacyPolicy />
              </Suspense>
            }
          />
          <Route
            path="/contactus"
            element={
              <Suspense fallback={<Loader />}>
                <ContactUs />
              </Suspense>
            }
          />
          <Route
            path="/searchpage"
            element={
              <Suspense fallback={<Loader />}>
                <SearchDestinationPage />
              </Suspense>
            }
          />
          <Route
            path="/aboutus/careers"
            element={
              <Suspense fallback={<Loader />}>
                <CareersPage />
              </Suspense>
            }
          />
          <Route
            path="/destination/*"
            element={
              <Suspense fallback={<Loader />}>
                <DestinationPage />
              </Suspense>
            }
          />
          <Route
            path="/traveltips"
            element={
              <Suspense fallback={<Loader />}>
                <TravelTips />
              </Suspense>
            }
          />
          <Route
            path="/destination/:continent/:country"
            element={
              <Suspense fallback={<Loader />}>
                <CountryDestinationPage />
              </Suspense>
            }
          />
          <Route
            path="/destination/:continent/:country/:state"
            element={
              <Suspense fallback={<Loader />}>
                <StateDestinationPage />
              </Suspense>
            }
          />
          <Route
            path="/destination/:continent/:country/:state/:id"
            element={
              <Suspense fallback={<Loader />}>
                <PlanDetails />
              </Suspense>
            }
          />
          <Route
            path="/adminpanel/*"
            element={
              <Suspense fallback={<Loader />}>
                <AdminPanel />
              </Suspense>
            }
          />
          <Route
            path="/myprofile"
            element={
              <Suspense fallback={<Loader />}>
                <MyProfile />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      {/* Conditionally show the Footer based on the current route */}
      {shouldShowFooter && <Footer />}
    </div>
  );
}

function AppWithRouter() {
  return (
    <WishlistProvider>
      <SearchProvider>
        <Router>
          <App />
        </Router>
      </SearchProvider>
    </WishlistProvider>
  );
}

export default AppWithRouter;
