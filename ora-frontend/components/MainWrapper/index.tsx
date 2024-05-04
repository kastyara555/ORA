"use client";
import { useDispatch, useSelector } from "react-redux";
import { memo, useLayoutEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

import { profileUserDataSelector } from "@/store/profile/selectors";
import { profileGetInfo, resetProfileUserData } from "@/store/profile/actions";
import { getCookie } from "@/utils/cookie";
import { AUTH_COOKIE_NAME } from "@/consts";
import { PRIVATE_ROUTES } from "@/consts/profile";
import NotFound from "@/app/not-found";

import styles from "./style.module.scss";

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector(profileUserDataSelector);
  const router = useRouter();
  const pathname = usePathname();

  const privateRouteInfo = useMemo(
    () =>
      PRIVATE_ROUTES.find(({ url, noStrict }) =>
        noStrict ? pathname.includes(url) : url === pathname
      ),
    [pathname]
  );

  const showNotFound = useMemo(
    () =>
      privateRouteInfo &&
      (!userInfo ||
        (privateRouteInfo.availableUserTypes &&
          !privateRouteInfo.availableUserTypes?.includes(userInfo.userType))),
    [userInfo, privateRouteInfo]
  );

  useLayoutEffect(() => {
    const authCookie = getCookie(AUTH_COOKIE_NAME);

    if (!userInfo && authCookie && authCookie?.length) {
      dispatch(profileGetInfo() as any);
    }

    if (!authCookie || !authCookie?.length) {
      if (userInfo) {
        dispatch(resetProfileUserData());
      }

      if (privateRouteInfo) {
        router.push("/login");
      }
    }
  }, []);

  return (
    <main className={styles.content}>
      {showNotFound ? <NotFound /> : children}
    </main>
  );
};

export default memo(MainWrapper);
