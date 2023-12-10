"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { profileUserDateSelector } from "@/store/profile/selectors";
import { profileGetInfo, resetProfileUserData } from "@/store/profile/actions";
import { getCookie } from "@/utils/cookie";
import { AUTH_COOKIE_NAME, PRIVATE_ROUTES } from "@/consts";
import { usePathname, useRouter } from "next/navigation";

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector(profileUserDateSelector);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authCookie = getCookie(AUTH_COOKIE_NAME);

    if (!userInfo && authCookie && authCookie?.length) {
      dispatch(profileGetInfo() as any);
    }

    if (!authCookie || !authCookie?.length) {
      if (userInfo) {
        dispatch(resetProfileUserData());
      }

      if (PRIVATE_ROUTES.includes(pathname)) {
        router.push("/login");
      }
    }
  }, []);

  return <main>{children}</main>;
};

export default MainWrapper;
