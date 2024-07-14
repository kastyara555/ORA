"use client";
import { FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { profileUserDataSelector } from "@/store/profile/selectors";
import { clientClearFavoriteUrl, clientFavoriteSaloonsUrl, clientSaveFavoriteUrl } from "@/api/favorites";
import { USER_TYPES } from "@/consts/profile";

interface ProcedureProps {
  initialProcedure: ProcedureDataModel;
}

const Procedure: FC<ProcedureProps> = ({ initialProcedure }) => {
  const [procedureData, setProcedureData] =
    useState<ProcedureDataModel>(initialProcedure);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});
  const userData = useSelector(profileUserDataSelector);
  const pathname = usePathname();
  const dispatch = useDispatch();

  const shouldShowMoreButton = useMemo<boolean>(
    () => !(currentPage * SALOONS_PAGE_SIZE >= procedureData.saloons.total),
    [currentPage, procedureData.saloons.total]
  );

  const fetchFavorites = async () => {
    try {
      if (userData) {
        const { data } = await axiosInstance.post(clientFavoriteSaloonsUrl, {
          idClient: userData.userTypeMapId,
          idServices: procedureData.saloons.data.map(({ idService }) => idService),
        });

        setFavoritesMap(data.reduce((acc: Record<string, boolean>, id: number) => ({ ...acc, [id]: true }), {}));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFavorites = async (idService: number) => {
    try {
      if (userData && userData.userType === USER_TYPES.client) {
        const isFavorite = favoritesMap.hasOwnProperty(idService);
        await axiosInstance.post(isFavorite ? clientClearFavoriteUrl : clientSaveFavoriteUrl, {
          idClient: userData.userTypeMapId,
          idService,
        });

        if (isFavorite) {
          const { [idService]: elementToBeRemoved, ...rest } = favoritesMap;

          setFavoritesMap(rest);
        } else {
          setFavoritesMap({ ...favoritesMap, [idService]: true });
        }
      } else {
        const toastToBeShown = {
          severity: TOAST_SEVERITIES.INFO,
          summary: "Избранные",
          detail: "Функционал доступен только авторизированным клиентам",
          life: TOAST_DEFAULT_LIFE,
        };

        dispatch(commonSetUiToast(toastToBeShown));
      }
    } catch (e) {
      console.error(e);
    }
  };

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

  useEffect(() => {
    fetchFavorites();
  }, [procedureData.saloons.data.length]);

  return (
    <div>
      <ProcedureSaloonsList
        saloonsData={procedureData.saloons.data}
        handleFavoritesClick={toggleFavorites}
        favorites={favoritesMap}
      />
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
