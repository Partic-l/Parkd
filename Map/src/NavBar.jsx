import { Link } from "react-router";

export default function NavBar() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/social">Social</Link>
        </nav>
    )
}