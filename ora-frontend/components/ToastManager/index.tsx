import React, { FC, useEffect, useRef, useState } from "react";
import { isEqual } from "lodash";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";

import { commonUiToastSelector } from "@/store/common/selectors";

const ToastManager: FC = () => {
  const activeToast = useSelector(commonUiToastSelector);

  const [prevToast, setPrevToast] = useState<any>(activeToast);
  const toast = useRef(null);

  useEffect(() => {
    if (toast.current && activeToast && !isEqual(activeToast, prevToast)) {
      (toast.current as any).show(activeToast.content);
      setPrevToast(activeToast);
    }
  }, [activeToast, toast.current]);

  return <Toast ref={toast} />;
};

export default ToastManager;
