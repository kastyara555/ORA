import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Message } from "primereact/message";
import Link from "next/link";

import Button from "@/components/Button";
import { USER_TYPES } from "@/consts/profile";
import { commonSetBookingModalData } from "@/store/common/actions";
import { profileUserDataSelector } from "@/store/profile/selectors";

import styles from './style.module.scss';

interface BookingButtonProps {
    handleApply(): void;
    handleApplyLogin(login: string, password: string): void;
}

interface BookingButtonStateModel {
    login: string;
    password: string;
}

const LOGIN_INITIAL_STATE: BookingButtonStateModel = {
    login: "",
    password: "",
};

const BookingButton: FC<BookingButtonProps> = ({ handleApply, handleApplyLogin }) => {
    const [state, setState] = useState<BookingButtonStateModel>(LOGIN_INITIAL_STATE);
    const profileData = useSelector(profileUserDataSelector);
    const dispatch = useDispatch();

    const setLogin = (e: ChangeEvent) => {
        setState((oldState) => ({
            ...oldState,
            login: (e.target as HTMLInputElement).value,
        }));
    };

    const setPassword = (e: ChangeEvent) => {
        setState((oldState) => ({
            ...oldState,
            password: (e.target as HTMLInputElement).value,
        }));
    };

    const disabledLoginButton = useMemo<boolean>(() => {
        if (!state.login.length || !state.password.length) return true;

        return false;
    }, [state]);

    const handleCloseBookingSidebar = useCallback(() => {
        dispatch(commonSetBookingModalData(null))
    }, []);

    if (!profileData) {
        return <div className={classNames("mt-4", "flex", "flex-column", "align-items-center")}>
            <h3 className={styles.authorizationTitle}>Авторизоваться как клиент и записаться</h3>
            <InputText
                className={classNames(styles.input, "mt-4", "w-full")}
                placeholder="Email"
                maxLength={32}
                value={state.login}
                onChange={setLogin}
            />
            <Password
                className={classNames(
                    "mt-2",
                    "w-full"
                )}
                inputClassName={classNames(styles.input, styles.password)}
                placeholder="Пароль"
                feedback={false}
                maxLength={32}
                value={state.password}
                onChange={setPassword}
                toggleMask
            />
            <Button
                className={classNames(
                    "mt-4",
                    "w-full",
                    "flex",
                    "align-items-center",
                    "justify-content-center"
                )}
                disabled={disabledLoginButton}
                onClick={() => handleApplyLogin(state.login, state.password)}
            >
                Войти и записаться
            </Button>
            <Link
                href="/registration/user"
                onClick={handleCloseBookingSidebar}
                className={classNames(styles.link, "mt-4")}
            >
                Регистрация
            </Link>
            <Link
                href="/restore/request"
                onClick={handleCloseBookingSidebar}
                className={classNames(styles.link, "mt-2")}
            >
                Забыли пароль?
            </Link>
        </div>
    }

    if (profileData.userType !== USER_TYPES.client) {
        return <Message severity="warn" className={classNames("mt-2", "w-full")} text="Для записи необходимо авторизоваться как клиент" />
    }

    return <Button
        className={classNames("w-full", "mt-4")}
        onClick={handleApply}
    >
        Записаться
    </Button>
}

export default BookingButton;
