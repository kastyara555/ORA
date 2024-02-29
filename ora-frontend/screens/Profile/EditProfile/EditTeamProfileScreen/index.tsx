"use client";

import Link from "next/link";
import { memo } from "react";
import classNames from "classnames";

import EditTeamMastersTable from "@/screens/Profile/EditProfile/EditTeamProfileScreen/EditTeamMastersTable";
import Button from "@/components/Button";

import styles from "./style.module.scss";

const EditTeamProfileScreen = () => (
  <div className={classNames(styles.container, "py-4")}>
    <h3 className="pb-4">Список мастеров</h3>
    <EditTeamMastersTable />
    <br />
    <Link className={classNames(styles.addMasterLink, "my-4")} href="/profile/edit/team/add-master">
      <Button className={classNames("flex", "justify-content-center")} size="small">Добавить мастера</Button>
    </Link>
  </div>
);

export default memo(EditTeamProfileScreen);
