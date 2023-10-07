"use client";
import { FC } from "react";
import classNames from "classnames";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import ImageUploading from "react-images-uploading";

import { registrationSaloonSelectedValuesSelector } from "@/store/registrationSaloon/selectors";
import { registrationSaloonSetPicturesForm } from "@/store/registrationSaloon/actions";

import styles from "./style.module.scss";
import { Message } from "primereact/message";

interface SaloonRegistrationPicturesFormModel {
  onCountinueClick(): void;
}
const SaloonRegistrationPicturesForm: FC<
  SaloonRegistrationPicturesFormModel
> = ({ onCountinueClick }) => {
  const { picturesForm } = useSelector(
    registrationSaloonSelectedValuesSelector
  );

  const dispatch = useDispatch();

  const onChange = (pictures: any[], addUpdateIndex: number[] | undefined) => {
    // data for submit
    console.log(pictures, addUpdateIndex);
    const newPicturesForm = { ...picturesForm, pictures };

    dispatch(registrationSaloonSetPicturesForm(newPicturesForm));
  };

  const onApply = () => {
    onCountinueClick();
  };

  return (
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
        Покажите клиентам Ваш
        <br />
        профессионализм
      </h2>
      <p className={classNames(styles.lightText, styles.subtitle)}>
        Фотографии отображаются в вашем профиле и клиентском поиске на ORA
      </p>
      <div className={classNames("grid", "w-full", "row-gap-3")}>
        <ImageUploading
          multiple
          value={picturesForm.pictures}
          onChange={onChange}
          maxNumber={3}
          maxFileSize={3000000}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageRemove,
            isDragging,
            dragProps,
            errors,
          }) => (
            <>
              {errors && (
                <div
                  className={classNames("col-12", "flex", "flex-column", "p-0")}
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
              {!!imageList.length && (
                <>
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
                    Очистить изображения
                  </Button>
                  <div className={classNames("col-12", "flex")}>
                    {imageList.map((image, index) => (
                      <div
                        key={index}
                        className={classNames(
                          styles.selectedImage,
                          "flex",
                          "flex-column",
                          "align-items-center",
                          "mr-1"
                        )}
                      >
                        <img
                          className={classNames("py-1")}
                          src={image["data_url"]}
                          alt=""
                          height={108}
                        />
                        <div className="pt-1">
                          <Button
                            severity="secondary"
                            size="small"
                            onClick={() => onImageRemove(index)}
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
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
      >
        Продолжить
      </Button>
    </div>
  );
};

export default SaloonRegistrationPicturesForm;
