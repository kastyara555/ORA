"use client";
import cn from "classnames";
import { FC, ReactNode, memo } from "react";
import { Image } from "primereact/image";

import styles from "./style.module.scss";

interface InfoBlockProps {
  title: string;
  content: string | ReactNode;
  imageSrc: string;
  order?: "default" | "reverse";
}

const InfoBlock: FC<InfoBlockProps> = ({
  title,
  content,
  imageSrc,
  order = "default",
}) => {
  const textBlock = <p className="p-2">{content}</p>;
  const imageBlock = (
    <Image
      loading="lazy"
      src={imageSrc}
      alt={imageSrc}
      width="320px"
      className="p-2"
    />
  );

  return (
    <div className={cn(styles.wrapper, "py-2")}>
      <h3 className="px-2">{title}</h3>
      <div className={cn(styles.info, "mt-2")}>
        {order === "reverse" ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </div>
  );
};

export default memo(InfoBlock);
