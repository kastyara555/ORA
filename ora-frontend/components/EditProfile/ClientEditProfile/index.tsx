"use client";
import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent, useMemo, useState } from "react";
import classNames from "classnames";
import ImageUploading, {
  ImageListType,
  ImageType,
} from "react-images-uploading";
import { InputMask } from "primereact/inputmask";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { addLocale } from "primereact/api";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { object, string } from "yup";

import RU_LOCALE from "@/consts/locale";
import { profileUpdate } from "@/store/profile/actions";
import { profileUserDateSelector } from "@/store/profile/selectors";

import styles from "./style.module.scss";

interface profileEditForm {
  lastName: string;
}

export interface profileEditClientForm extends profileEditForm {
  mainImage: ImageType | null;
}

const profileSchema = object().shape({
  lastName: string().required().trim().min(2).max(32),
});

const ClientEditProfile = () => {
  const profileInfo = useSelector(profileUserDateSelector);
  const [picturesForm, setPicturesForm] = useState<ImageListType>([]);
  const [profileForm, setProfileForm] = useState<profileEditForm>({
    lastName: profileInfo.lastName,
  });
  const dispatch = useDispatch();

  const submitDisabled = useMemo(() => {
    try {
      profileSchema.validateSync(profileForm);

      if (
        picturesForm.length ||
        profileForm.lastName !== profileInfo.lastName
      ) {
        return false;
      }

      return true;
    } catch {
      return true;
    }
  }, [picturesForm, profileForm]);

  const setProfileLastName = (e: ChangeEvent) => {
    setProfileForm((oldState) => ({
      ...oldState,
      lastName: (e.target as HTMLInputElement).value,
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

  addLocale("ru", RU_LOCALE);

  return (
    <>
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
        <h2>Настройки учетной записи</h2>

        <div
          className={classNames(
            "col-12",
            "mt-2",
            "flex",
            "flex-wrap",
            "grid",
            "align-items-center"
          )}
        >
          <ImageUploading
            multiple
            value={picturesForm}
            onChange={(newPictures) => {
              setPicturesForm([newPictures[newPictures.length - 1]]);
            }}
            maxFileSize={3000000}
            dataURLKey="data_url"
          >
            {({ imageList, onImageUpload, dragProps, errors }) => (
              <>
                {errors && (
                  <div
                    className={classNames(
                      "col-12",
                      "flex",
                      "flex-column",
                      "p-0"
                    )}
                  >
                    {errors.maxNumber && (
                      <Message
                        className={classNames(
                          styles.errorMessage,
                          "w-full",
                          "mb-1"
                        )}
                        severity="error"
                        text="Можно выбрать не более одного изображения"
                      />
                    )}
                    {errors.acceptType && (
                      <Message
                        className={classNames(
                          styles.errorMessage,
                          "w-full",
                          "mb-1"
                        )}
                        severity="error"
                        text="Можно добавлять только изображения"
                      />
                    )}
                    {errors.maxFileSize && (
                      <Message
                        className={classNames(
                          styles.errorMessage,
                          "w-full",
                          "mb-1"
                        )}
                        severity="error"
                        text="Превышен максимальный размер файла"
                      />
                    )}
                  </div>
                )}
                <Image
                  className={styles.profileImage}
                  height="128"
                  width="128"
                  src={
                    imageList[0]
                      ? imageList[0]["data_url"]
                      : profileInfo.mainImage
                  }
                />
                <div className={classNames("flex", "flex-column", "row-gap-1")}>
                  <Button
                    className={classNames(
                      "flex",
                      "align-items-center",
                      "justify-content-center",
                      "ml-3",
                      styles.outlinedButton
                    )}
                    onClick={onImageUpload}
                    outlined
                    {...dragProps}
                  >
                    Выбрать фото
                  </Button>
                  {!!imageList.length && (
                    <Button
                      className={classNames(
                        "flex",
                        "align-items-center",
                        "justify-content-center",
                        "ml-3",
                        styles.outlinedButton
                      )}
                      onClick={() => setPicturesForm([])}
                      outlined
                    >
                      Отменить выбор
                    </Button>
                  )}
                </div>
              </>
            )}
          </ImageUploading>
        </div>

        <div className={classNames("grid", "w-full", "pb-1", "mt-2")}>
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
            <label className={styles.lightText} htmlFor="lastName">
              Фамилия
            </label>
            <InputText
              id="lastName"
              className={classNames(styles.input, "w-full", "mt-2")}
              placeholder="Фамилия"
              value={profileForm.lastName}
              onChange={setProfileLastName}
              maxLength={32}
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
            <label className={styles.lightText} htmlFor="birthday">
              Дата рождения
            </label>
            <Calendar
              id="birthday"
              className={classNames("w-full", "mt-2")}
              placeholder="Дата рождения"
              locale="ru"
              value={
                new Date(
                  profileInfo.birthday.split("-")[2],
                  profileInfo.birthday.split("-")[1] - 1,
                  profileInfo.birthday.split("-")[0]
                )
              }
              showButtonBar
              disabled
            />
          </div>
          <div
            className={classNames(
              "col-12",
              "lg:col-6",
              "xl:col-6",
              "flex",
              "align-items-center",
              "pt-4"
            )}
          >
            <p className={styles.sex}>Пол: {profileInfo.sex}</p>
          </div>
          <div className={classNames("col-12", "mt-2")}>
            <Button
              disabled={submitDisabled}
              className={classNames(styles.button, "w-full")}
              onClick={handleApply}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientEditProfile;
