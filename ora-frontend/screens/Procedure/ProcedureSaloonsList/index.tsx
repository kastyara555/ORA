import { FC } from "react";

import { ProcedureSaloonSaloonModel } from "@/models/procedure";

import ProcedureSaloon from "./ProcedureSaloon";

interface ProcedureSaloonsListProps {
  saloonsData: ProcedureSaloonSaloonModel[];
  favorites: Record<string, boolean>;
  handleFavoritesClick(idService: number): void;
}

const ProcedureSaloonsList: FC<ProcedureSaloonsListProps> = ({
  saloonsData, favorites, handleFavoritesClick
}) => (
  <div>
    {saloonsData.map((saloonData) => (
      <ProcedureSaloon
        isFavorite={favorites.hasOwnProperty(saloonData.idService)}
        handleFavoritesClick={() => handleFavoritesClick(saloonData.idService)}
        key={saloonData.id}
        saloonInfo={saloonData}
      />
    ))}
  </div>
);

export default ProcedureSaloonsList;
