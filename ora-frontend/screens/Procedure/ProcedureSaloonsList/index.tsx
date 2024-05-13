import { FC } from "react";

import { ProcedureSaloonSaloonModel } from "@/models/procedure";

import ProcedureSaloon from "./ProcedureSaloon";

interface ProcedureSaloonsListProps {
  saloonsData: ProcedureSaloonSaloonModel[];
}

const ProcedureSaloonsList: FC<ProcedureSaloonsListProps> = ({
  saloonsData,
}) => (
  <div>
    {saloonsData.map((saloonData) => (
      <ProcedureSaloon saloonInfo={saloonData} />
    ))}
  </div>
);

export default ProcedureSaloonsList;
