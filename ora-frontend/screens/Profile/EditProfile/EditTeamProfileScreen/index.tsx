"use client";

import { memo } from "react";
import classNames from "classnames";
import { TabPanel, TabView } from "primereact/tabview";

import EditTeamMastersTable from "@/screens/Profile/EditProfile/EditTeamProfileScreen/EditTeamMastersTable";
import EditTeamAddMasterForm from "@/screens/Profile/EditProfile/EditTeamProfileScreen/EditTeamAddMasterForm";

const EditTeamProfileScreen = () => (
  <TabView className={classNames("w-full", "mt-4")}>
    <TabPanel header="Список мастеров">
      <EditTeamMastersTable />
    </TabPanel>
    <TabPanel header="Добавление мастеров">
      <EditTeamAddMasterForm />
    </TabPanel>
  </TabView>
);

export default memo(EditTeamProfileScreen);
