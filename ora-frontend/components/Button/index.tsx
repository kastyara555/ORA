import classNames from "classnames";
import { FC, ReactElement } from "react";
import { Button as ButtonComponent } from "primereact/button";

import styles from "./style.module.scss";

export interface IButtonProps {
  children: ReactElement | null | string | string[];
  onClick?(): void;
  disabled?: boolean;
  className?: string;
  type?: ButtonType;
  size?: ButtonSizeType;
  severity?: ButtonSeverityType;
  outlined?: boolean;
  rounded?: boolean;
  loading?: boolean;
}

type ButtonType = "submit" | "reset" | "button" | undefined;
type ButtonSizeType = "small" | "large" | undefined;
type ButtonSeverityType =
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "help"
  | undefined;

const Button: FC<IButtonProps> = ({
  children,
  onClick = () => {},
  className,
  disabled = false,
  type,
  size,
  severity,
  outlined = false,
  rounded = false,
  loading = false,
}) => (
  <ButtonComponent
    onClick={onClick}
    disabled={disabled}
    className={classNames(className, {
      [styles.primaryButton]: !severity,
    })}
    type={type}
    size={size}
    severity={severity}
    outlined={outlined}
    rounded={rounded}
    loading={loading}
  >
    {children}
  </ButtonComponent>
);

export default Button;
