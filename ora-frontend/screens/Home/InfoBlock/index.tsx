import cn from "classnames";
import { FC, ReactNode, memo } from "react";
import { Image } from "primereact/image";

import styles from "./style.module.scss";

interface InfoBlockProps {
  title: string;
  content: string | ReactNode;
  imageSrc: string;
  order?: "default" | "reverse";
  className?: string;
}

const InfoBlock: FC<InfoBlockProps> = ({
  title,
  content,
  imageSrc,
  order = "default",
  className = null,
}) => {
  const textBlock = <p className="p-2">{content}</p>;
  const imageBlock = (
    <Image
      loading="lazy"
      src={imageSrc}
      alt={title}
      width="360px"
      className="p-2"
    />
  );

  return (
    <div className={cn(styles.wrapper, className, "py-2")}>
      <h2 className="px-2">{title}</h2>
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
