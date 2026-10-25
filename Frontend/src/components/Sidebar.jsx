import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">
            <h3>RMS</h3>

            <nav>
                <Link to="/">Dashboard</Link>

                <Link to="/properties">
                    Properties
                </Link>

                <Link to="/tenants">
                    Tenants
                </Link>

                <Link to="/payments">
                    Payments
                </Link>

                <Link to="/login">
                    Login
                </Link>
            </nav>
        </aside>
    );
}

export default Sidebar;