import { NavLink } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navigation.css';

export default function Navigation() {
    return (
        <ul>
            <li>
                <NavLink to="/">Home</NavLink>
            </li>

            <li>
                <ProfileButton />
            </li>
        </ul>
    );
}
