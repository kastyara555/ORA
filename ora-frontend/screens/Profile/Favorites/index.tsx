"use client"
import { FC, useEffect, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "primereact/skeleton";

import axiosInstance from "@/api";
import { clientClearFavoriteUrl, clientGetFavoriteUrl, clientSaveFavoriteUrl } from "@/api/favorites";
import { USER_TYPES } from "@/consts/profile";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { commonSetBookingModalData, commonSetUiToast } from "@/store/common/actions";
import { FavoriteServiceModel } from "@/models/favorites";

import FavoriteService from "./FavoriteService";

const FavoritesScreen: FC = () => {
  const dispatch = useDispatch();
  const userData = useSelector(profileUserDataSelector);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<null | FavoriteServiceModel[]>(null);
  const [favoritesIds, setFavoritesIds] = useState<number[]>([]);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const { data }: { data: FavoriteServiceModel[] } = await axiosInstance.post(clientGetFavoriteUrl, {
        idClient: userData.userTypeMapId,
      });

      setFavorites(data);
      setFavoritesIds(data.map(({ id }) => id));
    } catch {
      const toastToBeShown = {
        severity: TOAST_SEVERITIES.ERROR,
        summary: "Избранное",
        detail: "Функционал доступен только авторизированным клиентам",
        life: TOAST_DEFAULT_LIFE,
      };

      dispatch(commonSetUiToast(toastToBeShown));
    } finally {
      setIsLoading(false);
    }
  }

  const handleRecord = (idSaloon: number, idProcedure: number) => {
    dispatch(
      commonSetBookingModalData({
        idSaloon,
        idProcedure,
      })
    );
  };

  const toggleFavorites = async (idService: number) => {
    try {
      if (userData && userData.userType === USER_TYPES.client) {
        const isFavorite = favoritesIds.includes(idService);
        await axiosInstance.post(isFavorite ? clientClearFavoriteUrl : clientSaveFavoriteUrl, {
          idClient: userData.userTypeMapId,
          idService,
        });

        if (isFavorite) {
          setFavoritesIds(favoritesIds.filter(id => id !== idService));
        } else {
          setFavoritesIds([...favoritesIds, idService]);
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
  }, []);

  if (!favorites) {
    return isLoading ? <div className={classNames("flex", "flex-column", "gap-2")}>
      <Skeleton width="100%" height="256px" />
    </div> : <></>;
  }

  return favorites.length ? <div className={classNames("flex", "flex-column", "gap-2")}>
    {favorites.map((service) =>
      <FavoriteService
        key={service.id}
        service={service}
        isFavorite={favoritesIds.includes(service.id)}
        handleRecord={() => handleRecord(service.saloonId, service.procedureId)}
        toggleFavorite={() => toggleFavorites(service.id)}
      />
    )}
  </div> : <div className={classNames("flex", "flex-column", "align-items-center", "gap-4")}>
    <h3>Избранные отсутствуют.</h3>
    <p>Добавить услугу в избранное можно на экране выбора салона.</p>
  </div>
};

export default FavoritesScreen;
