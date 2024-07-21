"use client"
import { FC, Fragment, useEffect, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "primereact/skeleton";
import { Divider } from "primereact/divider";

import axiosInstance, { BASE_URL } from "@/api";
import { clientClearFavoriteUrl, clientGetFavoriteUrl, clientSaveFavoriteUrl } from "@/api/favorites";
import Button from "@/components/Button";
import { DEFAULT_PROFILE_IMAGE, USER_TYPES } from "@/consts/profile";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { profileUserDataSelector } from "@/store/profile/selectors";
import { commonSetBookingModalData, commonSetUiToast } from "@/store/common/actions";

import styles from './style.module.scss';

interface FavoriteService {
  id: number;
  saloonId: number;
  saloonName: string;
  mainImage: string | null;
  procedureId: number;
  procedureName: string;
  cityName: string;
}

const FavoritesScreen: FC = () => {
  const dispatch = useDispatch();
  const userData = useSelector(profileUserDataSelector);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<null | FavoriteService[]>(null);
  const [favoritesIds, setFavoritesIds] = useState<number[]>([]);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const { data }: { data: FavoriteService[] } = await axiosInstance.post(clientGetFavoriteUrl, {
        idClient: userData.userTypeMapId,
      });

      setFavorites(data);
      setFavoritesIds(data.map(({ id }) => id));
    } catch (e) {
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
    {favorites.map(({ id, saloonId, saloonName, procedureId, procedureName, mainImage, cityName }) =>
      <Fragment key={id}>
        <div className={classNames(styles.saloon, styles.saloonDesktop, "flex", "align-items-center", "p-3")}>
          <img
            src={
              mainImage
                ? BASE_URL.concat(mainImage)
                : DEFAULT_PROFILE_IMAGE
            }
            alt={mainImage ?? "Главное изображение салона"}
            className={classNames(
              styles.saloonAvatar,
              "h-3rem",
              "w-3rem",
              "shadow-2",
              "mr-2"
            )}
          />
          <div>
            <h3>{saloonName}</h3>
            <h4>г.{cityName}</h4>
          </div>
          <Divider layout="vertical" />
          <h4 className="flex-1">{procedureName}</h4>
          <Divider layout="vertical" />
          <Button onClick={() => handleRecord(saloonId, procedureId)}>
            Выбрать дату
          </Button>
          <Divider layout="vertical" />
          <Button
            className={styles.favoriteButton}
            icon={`pi ${favoritesIds.includes(id) ? 'pi-heart-fill' : 'pi-heart'}`}
            severity="secondary"
            aria-label="Favorite"
            onClick={() => toggleFavorites(id)}
            rounded
            text
          />
        </div>

        <div className={classNames(styles.saloon, styles.saloonMobile, "flex", "flex-column", "p-3")}>
          <div className={classNames("flex", "justify-content-between")}>
            <div className="flex">
              <img
                src={
                  mainImage
                    ? BASE_URL.concat(mainImage)
                    : DEFAULT_PROFILE_IMAGE
                }
                alt={mainImage ?? "Главное изображение салона"}
                className={classNames(
                  styles.saloonAvatar,
                  "h-3rem",
                  "w-3rem",
                  "shadow-2",
                  "mr-2"
                )}
              />
              <div>
                <h3>{saloonName}</h3>
                <h4>г.{cityName}</h4>
              </div>
            </div>
            <Button
              className={styles.favoriteButton}
              icon={`pi ${favoritesIds.includes(id) ? 'pi-heart-fill' : 'pi-heart'}`}
              severity="secondary"
              aria-label="Favorite"
              onClick={() => toggleFavorites(id)}
              rounded
              text
            />
          </div>
          <Divider />
          <h4 className="flex-1">{procedureName}</h4>
          <Divider />
          <Button onClick={() => handleRecord(saloonId, procedureId)}>
            Выбрать дату
          </Button>
        </div>
      </Fragment>
    )
    }
  </div> : <div className={classNames("flex", "flex-column", "align-items-center", "gap-4")}>
    <h3>Избранные отсутствуют.</h3>
    <p>Добавить услугу в избранное можно на экране выбора салона.</p>
  </div>
};

export default FavoritesScreen;
