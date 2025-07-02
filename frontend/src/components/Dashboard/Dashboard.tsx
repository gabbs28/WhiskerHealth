import { useAppSelector } from '../../redux/store.ts';
import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';

import styles from './Dashboard.module.css';

export function Dashboard() {
    const user = useAppSelector((store) => store.session.user);

    return <div className={styles.container}>{user ? <LoggedIn /> : <LoggedOut />}</div>;
}
