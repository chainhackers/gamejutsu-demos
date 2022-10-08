import { NextPage } from 'next';
import Link from 'next/link';
import styles from './tests.module.scss'

const TestsPage: NextPage = () => {
    return (
        <div className={styles.container}>
            <Link href="/GameField">
                GameField
            </Link>
            <Link href="/Checkers">
                Checkers
            </Link>
        </div>
    );
};

export default TestsPage;