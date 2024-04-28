import ContentWrapper from "@/components/ContentWrapper";
import { FC } from "react";

interface ProcedureProps {
  procedure: any;
}

const Procedure: FC<ProcedureProps> = ({ procedure }) => (
  <ContentWrapper title={procedure.procedureName}></ContentWrapper>
);

export default Procedure;
