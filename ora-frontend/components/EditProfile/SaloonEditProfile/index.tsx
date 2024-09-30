import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { ImageListType, ImageType } from "react-images-uploading";
import { InputTextarea } from "primereact/inputtextarea";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { object, string } from "yup";

import { profileUpdate } from "@/store/profile/actions";
import {
  profileLoadingSelector,
  profileUserDataSelector,
} from "@/store/profile/selectors";
import EditProfileAvatar from "@/components/EditProfile/EditProfileAvatar";
import SaloonEditTime from "@/components/EditProfile/SaloonEditProfile/SaloonEditTime";
import WorkTableModel from "@/models/WorkTableModel";
import Button from "@/components/Button";

import styles from "./style.module.scss";

interface profileEditForm {
  description: string;
}

export interface profileEditSaloonForm extends profileEditForm {
  mainImage: ImageType | null;
}

const profileSchema = object().shape({
  description: string().trim().max(256).notRequired(),
});

const SaloonEditProfile = () => {
  const profileInfo = useSelector(profileUserDataSelector);
  const loading = useSelector(profileLoadingSelector);
  const [picturesForm, setPicturesForm] = useState<ImageListType>([]);
  const [profileForm, setProfileForm] = useState<profileEditForm>({
    description: profileInfo.saloonDescription,
  });
  const dispatch = useDispatch();

  const submitDisabled = useMemo(() => {
    try {
      profileSchema.validateSync(profileForm);

      if (
        picturesForm.length ||
        profileForm.description !== profileInfo.saloonDescription
      ) {
        return false;
      }

      return true;
    } catch {
      return true;
    }
  }, [picturesForm, profileForm]);

  const setProfileDescription = (e: ChangeEvent) => {
    setProfileForm((oldState) => ({
      ...oldState,
      description: (e.target as HTMLInputElement).value,
    }));
  };

  const handleApply = () => {
    dispatch(
      profileUpdate({
        ...profileForm,
        mainImage: picturesForm.length ? picturesForm[0] : null,
      }) as any
    );
  };

  useEffect(() => {
    setProfileForm({ description: profileInfo.saloonDescription });
    setPicturesForm([]);
  }, [profileInfo]);

  return !loading ? (
    <div
      className={classNames(
        "flex",
        "flex-wrap",
        "align-items-center",
        "justify-content-center",
        "py-4",
        "row-gap-3"
      )}
    >
      <EditProfileAvatar
        defaultImage={profileInfo.mainImage}
        picturesForm={picturesForm}
        setPicturesForm={setPicturesForm}
      />

      <div className={classNames("grid", "w-full", "pb-1", "mt-2")}>
        <div className="col-12">
          <label className={styles.lightText} htmlFor="saloonName">
            Название салона
          </label>
          <InputText
            id="saloonName"
            className={classNames("w-full", "mt-2")}
            value={profileInfo.saloonName}
            disabled
          />
        </div>

        <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
          <label className={styles.lightText} htmlFor="name">
            Имя
          </label>
          <InputText
            id="name"
            className={classNames("w-full", "mt-2")}
            value={profileInfo.name}
            disabled
          />
        </div>
        <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
          <label className={styles.lightText} htmlFor="email">
            Email
          </label>
          <InputText
            id="email"
            className={classNames("w-full", "mt-2")}
            placeholder="Email"
            value={profileInfo.email}
            disabled
          />
        </div>

        <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
          <label className={styles.lightText} htmlFor="phone">
            Номер телефона
          </label>
          <InputMask
            id="phone"
            className={classNames("w-full", "mt-2")}
            placeholder="Номер телефона"
            mask="+375-99-999-99-99"
            value={profileInfo.phone}
            disabled
          />
        </div>
        <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
          <label className={styles.lightText} htmlFor="description">
            Описание
          </label>
          <InputTextarea
            id="description"
            className={classNames(styles.input, "w-full", "mt-2")}
            placeholder="Описание (опционально)"
            value={profileForm.description}
            onChange={setProfileDescription}
            maxLength={256}
            rows={3}
          />
        </div>

        <div className={classNames("col-12", "lg:col-4", "xl:col-4")}>
          <label className={styles.lightText} htmlFor="city">
            Город
          </label>
          <InputText
            id="city"
            className={classNames("w-full", "mt-2")}
            value={profileInfo.city.name}
            disabled
          />
        </div>
        {profileInfo.address ? (
          <>
            <div className={classNames("col-12", "lg:col-4", "xl:col-4")}>
              <label className={styles.lightText} htmlFor="streetType">
                Тип улицы
              </label>
              <InputText
                id="streetType"
                className={classNames("w-full", "mt-2")}
                value={profileInfo.address.streetType.name}
                disabled
              />
            </div>

            <div className={classNames("col-12", "lg:col-4", "xl:col-4")}>
              <label className={styles.lightText} htmlFor="street">
                Название улицы
              </label>
              <InputText
                id="street"
                className={classNames("w-full", "mt-2")}
                value={profileInfo.address.street}
                disabled
              />
            </div>

            <div className={classNames("col-12", "lg:col-4", "xl:col-4")}>
              <label className={styles.lightText} htmlFor="building">
                Строение
              </label>
              <InputText
                id="building"
                className={classNames("w-full", "mt-2")}
                value={profileInfo.address.building}
                disabled
              />
            </div>
            <div className={classNames("col-12", "lg:col-4", "xl:col-4")}>
              <label className={styles.lightText} htmlFor="stage">
                Этаж
              </label>
              <InputText
                id="stage"
                className={classNames("w-full", "mt-2")}
                value={profileInfo.address.stage}
                disabled
              />
            </div>
            <div className={classNames("col-12", "lg:col-4", "xl:col-4")}>
              <label className={styles.lightText} htmlFor="office">
                Офис
              </label>
              <InputText
                id="office"
                className={classNames("w-full", "mt-2")}
                value={profileInfo.address.office}
                disabled
              />
            </div>
          </>
        ) : (
          <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
            <label className={styles.lightText} htmlFor="visitPayment">
              Стоимость визита
            </label>
            <InputText
              id="visitPayment"
              className={classNames("w-full", "mt-2")}
              value={profileInfo.visitPayment}
              disabled
            />
          </div>
        )}

        <SaloonEditTime
          value={JSON.parse(profileInfo.workingTime) as WorkTableModel}
        />

        <div className={classNames("col-12", "mt-4")}>
          <Button
            disabled={submitDisabled}
            className="w-full"
            onClick={handleApply}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <Skeleton className="mt-4" width="100%" height="512px" />
  );
};

export default SaloonEditProfile;
