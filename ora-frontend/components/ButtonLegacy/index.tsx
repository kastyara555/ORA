import classNames from 'classnames';
import { FC, ReactElement } from 'react';

import styles from './style.module.scss';

export interface IButtonLegacyProps {
    children: ReactElement | null | string;
    onClick(): void;
    disabled?: boolean;
    className?: string;
}

const ButtonLegacy: FC<IButtonLegacyProps> = ({ children, onClick, disabled = false, className }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={classNames(styles.button, className)}
    >
        {children}
    </button>
);

export default ButtonLegacy;

