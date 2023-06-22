import "../style/appLayout.css";
import 'rsuite/dist/rsuite.min.css'
import { useNavigate } from "react-router-dom";
import React, {useState} from "react";
import { Sidenav, Nav, Avatar } from 'rsuite';
import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import GearIcon from '@rsuite/icons/Gear';
import PlayOutlineIcon from '@rsuite/icons/PlayOutline';
import AdminIcon from '@rsuite/icons/Admin';
import ExitIcon from '@rsuite/icons/Exit';
import ExploreIcon from '@rsuite/icons/Explore';

export default function AppLayout() {
  const { isAuthenticated, user, isLoading, logout, loginWithRedirect} = useAuth0();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  const handleSelect = (eventKey, event) => {
    if (eventKey==="1"){
      if (isAuthenticated){
        logout({ returnTo: window.location.origin });
      }
      else{
        loginWithRedirect();
      }
    }
    if (eventKey==="2"){
      navigate("/profile")
    }
    if (eventKey==="3"){
      navigate("/subscriptions")
    }
    if (eventKey==="4"){
      navigate("/favourites")
    }
    if (eventKey==="5"){
      navigate("/")
    }
  };

  return (
    
    <div style={{ width: 250 }}>
      <ul className="left-right">
        <li className="left">
          <Sidenav expanded={expanded}>
            <Sidenav.Body>
              <Nav onSelect={handleSelect}>
                {!user ? (
                  <Avatar src="https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/fd35c-no-user-image-icon-27.png?fit=500%2C500&ssl=1" alt="Image" />
                ) : (
                  <Avatar src={user.picture} alt="Image" />
                )}
                
                <Nav.Item eventKey="1" icon={<ExitIcon />}>
                  {!isAuthenticated ? (
                      "Login"
                  ) : (
                      "Logout"
                  )}
                </Nav.Item>
                <br/>
                <Nav.Item eventKey="2" icon={<GearIcon />}>
                  Profile
                </Nav.Item>
                <br/>
                <Nav.Item eventKey="3" icon={<AdminIcon />}>
                  Subscriptions
                </Nav.Item>
                <br/>
                <Nav.Item eventKey="4" icon={<PlayOutlineIcon />}>
                  Favourites
                </Nav.Item>
                <br/>
                <Nav.Item eventKey="5" icon={<ExploreIcon />}>
                  Homepage
                </Nav.Item>
              </Nav>
            </Sidenav.Body>
            <Sidenav.Toggle onToggle={expanded => setExpanded(expanded)} />
          </Sidenav>
        </li>  

          
        <li className="right">
          <Outlet />
        </li>
      </ul>
    </div>
  );
}
