import { FC, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Skeleton } from "primereact/skeleton";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

import axiosInstance from "@/api";
import { saloonInfoServicesUrl } from "@/api/saloon";
import { clientClearFavoriteUrl, clientCheckFavoriteServicesUrl, clientSaveFavoriteUrl } from "@/api/favorites";
import Button from "@/components/Button";
import { USER_TYPES } from "@/consts/profile";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { SALOON_SERVICES_INITIAL_DATA, SALOON_SERVICES_PAGE_SIZE } from "@/consts/saloon";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { commonSetBookingModalData, commonSetUiToast } from "@/store/common/actions";
import { SaloonServiceDataModel } from "@/models/saloon";

import styles from './style.module.scss';

interface SaloonServicesProps {
  idSaloon: number;
}

const SaloonServices: FC<SaloonServicesProps> = ({ idSaloon }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [servicesData, setServicesData] = useState<SaloonServiceDataModel>(SALOON_SERVICES_INITIAL_DATA);
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});
  const dispatch = useDispatch();
  const userData = useSelector(profileUserDataSelector);

  const shouldShowMoreButton = useMemo<boolean>(
    () => !(page * SALOON_SERVICES_PAGE_SIZE >= servicesData.total),
    [page, servicesData.total]
  );

  const loadServices = async () => {
    try {
      setIsLoading(true);

      const { data } = await axiosInstance.post<SaloonServiceDataModel>(
        saloonInfoServicesUrl(idSaloon),
        {
          pageNumber: page,
          pageSize: SALOON_SERVICES_PAGE_SIZE,
        }
      );

      setServicesData({
        total: data.total,
        data: [...servicesData.data, ...data.data],
      });
    } catch (e) {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Салон",
        detail: "Ошибка загрузки услуг салона.",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setIsLoading(false);
    }
  }

  const handleRecord = useCallback((idProcedure: number) => {
    dispatch(
      commonSetBookingModalData({
        idSaloon,
        idProcedure,
      })
    );
  }, [idSaloon]);

  const fetchFavorites = async () => {
    try {
      if (userData && servicesData.data.length) {
        const { data } = await axiosInstance.post(clientCheckFavoriteServicesUrl, {
          idClient: userData.userTypeMapId,
          idServices: servicesData.data.map(({ id }) => id),
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
          summary: "Избранное",
          detail: "Функционал доступен только авторизированным клиентам",
          life: TOAST_DEFAULT_LIFE,
        };

        dispatch(commonSetUiToast(toastToBeShown));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [servicesData.data.length]);

  useLayoutEffect(() => {
    loadServices();
  }, [page]);

  if (isLoading && !servicesData.data.length) {
    return <Skeleton width="100%" height="256px" />
  }

  return servicesData.data.length ? <div>
    <div className={classNames("flex", "flex-column", "gap-2")}>
      {servicesData.data.map(({ id, procedureId, procedureName }) => (
        <div key={id} className={classNames(styles.service, "flex", "flex-wrap", "align-items-center", "justify-content-between", "p-3", "gap-2")}>
          <h3>{procedureName}</h3>
          <div className={classNames("flex", "align-items-center", "gap-2")}>
            <Button onClick={() => handleRecord(procedureId)}>Выбрать дату</Button>
            <Button
              className={styles.favoriteButton}
              icon={`pi ${favoritesMap.hasOwnProperty(id) ? 'pi-heart-fill' : 'pi-heart'}`}
              severity="secondary"
              aria-label="Favorite"
              onClick={() => toggleFavorites(id)}
              rounded
              text
            />
          </div>
        </div>
      ))}
    </div>
    {shouldShowMoreButton && (
      <Button
        loading={isLoading}
        onClick={() => setPage(page + 1)}
        className={classNames("w-full", "mt-4")}
      >
        Показать ещё
      </Button>
    )}
  </div> : <h3>Салон не оказывает услуг.</h3>
};

export default SaloonServices;
