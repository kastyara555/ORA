"use client";
import { FC } from "react";
import classNames from "classnames";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useDispatch, useSelector } from "react-redux";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { ProgressSpinner } from "primereact/progressspinner";

import {
  registrationSaloonSelectedValuesSelector,
  registrationSaloonLoadingSelector,
} from "@/store/registrationSaloon/selectors";
import { registrationSaloonSetPicturesForm } from "@/store/registrationSaloon/actions";

import styles from "./style.module.scss";

interface SaloonRegistrationPicturesFormModel {
  onCountinueClick(): void;
}
const SaloonRegistrationPicturesForm: FC<
  SaloonRegistrationPicturesFormModel
> = ({ onCountinueClick }) => {
  const { picturesForm } = useSelector(
    registrationSaloonSelectedValuesSelector
  );
  const loading = useSelector(registrationSaloonLoadingSelector);

  const dispatch = useDispatch();

  const onChange = (pictures: ImageListType) => {
    // data for submit
    const newPicturesForm = { ...picturesForm, pictures };

    dispatch(registrationSaloonSetPicturesForm(newPicturesForm));
  };

  const onApply = () => {
    onCountinueClick();
  };

  return (
    <>
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
        <h2 className={styles.lightText} style={{ textAlign: "center" }}>
          Логотип салона
        </h2>
        <p className={classNames(styles.lightText, styles.subtitle)}>
          Миниатюра отображается в Вашем профиле и клиентском поиске на ORA
        </p>
        <div className={classNames("grid", "w-full", "row-gap-3")}>
          <ImageUploading
            multiple
            value={picturesForm.pictures}
            onChange={onChange}
            maxNumber={1}
            maxFileSize={3000000}
            dataURLKey="data_url"
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              isDragging,
              dragProps,
              errors,
            }) => (
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
                        text="Можно добавлять не более трёх изображений"
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
                {!imageList.length ? (
                  <Button
                    style={{ height: 256 }}
                    className={classNames(
                      "flex",
                      "align-items-center",
                      "justify-content-center",
                      "col-12",
                      {
                        [styles.button]: isDragging,
                        [styles.uploadingButton]: !isDragging,
                      }
                    )}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    Для загрузки кликните или наведите файл
                  </Button>
                ) : (
                  <>
                    <div className={classNames("col-12", "flex", "flex-wrap", "gap-4")}>
                      <img
                        className={classNames(styles.avatar,
                          "w-8rem",
                          "h-8rem",
                          "shadow-2",
                        )}
                        src={imageList[0]["data_url"]}
                      />
                      <img
                        className={classNames(styles.avatar,
                          "w-4rem",
                          "h-4rem",
                          "shadow-2",
                        )}
                        src={imageList[0]["data_url"]}
                      />
                      <img
                        className={classNames(styles.avatar,
                          "w-2rem",
                          "h-2rem",
                          "shadow-2",
                        )}
                        src={imageList[0]["data_url"]}
                      />
                    </div>
                    <Button
                      className={classNames(
                        "flex",
                        "align-items-center",
                        "justify-content-center",
                        "col-12"
                      )}
                      severity="secondary"
                      onClick={onImageRemoveAll}
                    >
                      Отменить выбор
                    </Button>
                  </>
                )}
              </>
            )}
          </ImageUploading>
        </div>
        <Button
          className={classNames(
            styles.button,
            "flex",
            "align-items-center",
            "justify-content-center",
            "col-12",
            "mb-3"
          )}
          onClick={onApply}
          disabled={loading}
        >
          Продолжить
        </Button>
      </div>
      <div
        className={classNames({
          [styles.loadingEnabled]: loading,
          [styles.loadingBlock]: !loading,
        })}
      >
        <ProgressSpinner />
      </div>
    </>
  );
};

export default SaloonRegistrationPicturesForm;
