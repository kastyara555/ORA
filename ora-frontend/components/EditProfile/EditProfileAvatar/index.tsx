"use client";
import { Dispatch, FC, SetStateAction } from "react";
import classNames from "classnames";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { Message } from "primereact/message";
import { Image } from "primereact/image";

import styles from "./style.module.scss";
import Button from "@/components/Button";

interface EditProfileAvatarProps {
  defaultImage: string;
  picturesForm: ImageListType;
  setPicturesForm: Dispatch<SetStateAction<ImageListType>>;
}

const EditProfileAvatar: FC<EditProfileAvatarProps> = ({
  defaultImage,
  picturesForm,
  setPicturesForm,
}) => (
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
            <div className={classNames("col-12", "flex", "flex-column", "p-0")}>
              {errors.maxNumber && (
                <Message
                  className={classNames(styles.errorMessage, "w-full", "mb-1")}
                  severity="error"
                  text="Можно выбрать не более одного изображения"
                />
              )}
              {errors.acceptType && (
                <Message
                  className={classNames(styles.errorMessage, "w-full", "mb-1")}
                  severity="error"
                  text="Можно добавлять только изображения"
                />
              )}
              {errors.maxFileSize && (
                <Message
                  className={classNames(styles.errorMessage, "w-full", "mb-1")}
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
            src={imageList[0] ? imageList[0]["data_url"] : defaultImage}
          />
          <div className={classNames("flex", "flex-column", "row-gap-1")}>
            <Button
              className={classNames(
                "flex",
                "align-items-center",
                "justify-content-center",
                "ml-3",
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
                )}
                onClick={() => setPicturesForm([])}
                severity="secondary"
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
);

export default EditProfileAvatar;
