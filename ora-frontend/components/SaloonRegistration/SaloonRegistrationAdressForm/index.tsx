import { FC, useState, useEffect, useMemo, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import { Map, MapState, Placemark, YMaps, ZoomControl } from "react-yandex-maps";

import {
  registrationSaloonLoadingSelector,
  registrationSaloonCitiesSelector,
  registrationSaloonSelectedValuesSelector,
  registrationSaloonStreetTypesSelector,
} from "@/store/registrationSaloon/selectors";
import {
  registrationSaloonFetchCities,
  registrationSaloonFetchStreetTypes,
  registrationSaloonSetAdressForm,
} from "@/store/registrationSaloon/actions";
import { RegistrationSaloonAdressFormModel } from "@/models/SaloonRegistration";
import { isNumeric } from "@/utils";
import Button from "@/components/Button";
import { ZOOM_LEVELS } from "@/consts/maps";
import placemarkIcon from "@/public/assets/images/map/pin.png";

import styles from "./style.module.scss";

interface SaloonRegistrationAdressFormModel {
  onCountinueClick(): void;
}

const SaloonRegistrationAdressForm: FC<SaloonRegistrationAdressFormModel> = ({
  onCountinueClick,
}) => {
  const { adressForm } = useSelector(registrationSaloonSelectedValuesSelector);
  const {
    adressTypeForm: { hasAdress },
  } = useSelector(registrationSaloonSelectedValuesSelector);
  const citiesList = useSelector(registrationSaloonCitiesSelector);
  const streetTypesList = useSelector(registrationSaloonStreetTypesSelector);
  const loading = useSelector(registrationSaloonLoadingSelector);
  const [mapState, setMapState] = useState<MapState | null>(null);
  const [state, setState] =
    useState<RegistrationSaloonAdressFormModel>(adressForm);

  const dispatch = useDispatch();

  const onApply = () => {
    dispatch(registrationSaloonSetAdressForm(state));
    onCountinueClick();
  };

  const setStreet = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      street: (e.target as HTMLInputElement).value,
    }));
  };

  const setStage = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      stage: (e.target as HTMLInputElement).value,
    }));
  };

  const setBuilding = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      building: (e.target as HTMLInputElement).value,
    }));
  };

  const setOffice = (e: ChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      office: (e.target as HTMLInputElement).value,
    }));
  };

  const setCity = (e: DropdownChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      city: e.value,
      coordinates: null,
    }));
    if (hasAdress) {
      setMapState({
        center: [e.value.yCoordinate, e.value.xCoordinate],
        zoom: ZOOM_LEVELS.CITY,
      });
    }
  };

  // TODO: Не нашёл тип события клика по карте
  const setCoordinates = (e: any) => {
    setState((oldState) => ({
      ...oldState,
      coordinates: e?.get("coords"),
    }));
  }

  const setStreetType = (e: DropdownChangeEvent) => {
    setState((oldState) => ({
      ...oldState,
      streetType: e.value,
    }));
  };

  const disabledButton = useMemo<boolean>(() => {
    if (!state.city) return true;

    if (
      hasAdress &&
      (!state.streetType ||
        !state.street.trim().length ||
        !isNumeric(state.building.trim()) ||
        !isNumeric(state.stage.trim()) ||
        !isNumeric(state.office.trim()))
    ) {
      return true;
    }

    return false;
  }, [state]);

  const fetchAdressBaseInfo = async () => {
    if (!citiesList.length) {
      await dispatch(registrationSaloonFetchCities() as any);
    }
    if (!streetTypesList.length) {
      await dispatch(registrationSaloonFetchStreetTypes() as any);
    }
  };

  useEffect(() => {
    fetchAdressBaseInfo();

    if (hasAdress) {
      if (state.coordinates) {
        setMapState({
          center: state.coordinates,
          zoom: ZOOM_LEVELS.STREET,
        });
      } else if (state.city) {
        setMapState({
          center: [state.city.yCoordinate, state.city.xCoordinate],
          zoom: ZOOM_LEVELS.CITY,
        });
      }
    }
  }, []);

  return !loading ? (
    <div
      className={classNames(
        styles.wrapper,
        "w-full",
        "flex",
        "gap-4",
        "flex-column",
        "align-items-center",
        "pt-6"
      )}
    >
      <h2 className={styles.lightText}>Адрес вашего салона/компании</h2>
      <p className={classNames(styles.lightText, styles.title)}>
        Где клиенты могут найти Вас
      </p>
      <Dropdown
        value={state.city}
        onChange={setCity}
        options={citiesList}
        showClear
        placeholder="Город"
        className={classNames(styles.input, "w-full")}
        optionLabel="name"
      />
      {hasAdress && (
        <div
          className={classNames("w-full", "grid", "column-gap-2", "row-gap-4")}
        >
          <Dropdown
            value={state.streetType}
            onChange={setStreetType}
            options={streetTypesList}
            showClear
            placeholder="Тип улицы"
            className={classNames(styles.input, "w-full")}
            optionLabel="name"
          />
          <InputText
            className={classNames(styles.input, "w-full", "col-12")}
            placeholder="Название улицы"
            maxLength={32}
            value={state.street}
            onChange={setStreet}
            style={{ height: 45 }}
          />
          <InputText
            className={classNames(styles.input, "col-12", "lg:col", "xl:col")}
            placeholder="Дом"
            maxLength={3}
            value={state.building}
            onChange={setBuilding}
            style={{ height: 45 }}
          />
          <InputText
            className={classNames(styles.input, "col-12", "lg:col", "xl:col")}
            placeholder="Этаж"
            maxLength={3}
            value={state.stage}
            onChange={setStage}
            style={{ height: 45 }}
          />
          <InputText
            className={classNames(styles.input, "col-12", "lg:col", "xl:col")}
            placeholder="Офис"
            maxLength={3}
            value={state.office}
            onChange={setOffice}
            style={{ height: 45 }}
          />

          {!!state.city && !!mapState && <div className={classNames("w-full", "col-12")}>
            <p className={classNames(styles.lightText, styles.title, "mb-2")}>
              Метка на карте (необязательно)
            </p>
            <YMaps>
              <Map
                width="100%"
                height={256}
                state={mapState}
                onClick={setCoordinates}
                onBoundsChange={(e: any) => setMapState({
                  center: e.originalEvent.newCenter,
                  zoom: e.originalEvent.newZoom,
                })}
              >
                <ZoomControl />
                {!!state.coordinates && <Placemark
                  geometry={state.coordinates}
                  options={{
                    iconLayout: "default#image",
                    iconImageHref: placemarkIcon.src,
                    iconImageSize: [20, 32],
                  }}
                />}
              </Map>
            </YMaps>
          </div>}
        </div>
      )}
      <Button
        className={classNames(
          "flex",
          "align-items-center",
          "justify-content-center",
          "col-12",
          "mb-3"
        )}
        onClick={onApply}
        disabled={disabledButton}
      >
        Продолжить
      </Button>
    </div>
  ) : (
    <div style={{ maxWidth: 448, width: "100%" }}>
      <Skeleton width="100%" height="386px" />
    </div>
  );
};

export default SaloonRegistrationAdressForm;
