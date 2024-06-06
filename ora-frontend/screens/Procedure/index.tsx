"use client";
import { FC, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { usePathname } from "next/navigation";

import axiosInstance from "@/api";
import { getProcedureDataUrl } from "@/api/categories";
import Button from "@/components/Button";
import { SALOONS_PAGE_SIZE } from "@/consts/procedure";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { ProcedureDataModel } from "@/models/procedure";
import ProcedureSaloonsList from "@/screens/Procedure/ProcedureSaloonsList";
import { commonSetUiToast } from "@/store/common/actions";

interface ProcedureProps {
  initialProcedure: ProcedureDataModel;
}

const Procedure: FC<ProcedureProps> = ({ initialProcedure }) => {
  const [procedureData, setProcedureData] =
    useState<ProcedureDataModel>(initialProcedure);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const dispatch = useDispatch();

  const shouldShowMoreButton = useMemo<boolean>(
    () => !(currentPage * SALOONS_PAGE_SIZE >= procedureData.saloons.total),
    [currentPage, procedureData.saloons.total]
  );

  const handleLoadMore = async () => {
    try {
      setIsLoading(true);
      const splittedPathname = pathname.split("/");

      const { data: newPageData } = await axiosInstance.post(
        getProcedureDataUrl(splittedPathname[2], splittedPathname[3]),
        {
          pageNumber: currentPage + 1,
          pageSize: SALOONS_PAGE_SIZE,
        }
      );

      setProcedureData({
        ...procedureData,
        saloons: {
          ...procedureData.saloons,
          data: [...procedureData.saloons.data, ...newPageData.saloons.data],
        },
      });
      setCurrentPage(currentPage + 1);
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Процедура",
        detail: "Ошибка загрузки информации о процедуре.",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ProcedureSaloonsList saloonsData={procedureData.saloons.data} />
      {shouldShowMoreButton && (
        <Button
          onClick={handleLoadMore}
          loading={isLoading}
          className={classNames("w-full", "mt-4")}
        >
          Показать ещё
        </Button>
      )}
    </div>
  );
};

export default Procedure;
