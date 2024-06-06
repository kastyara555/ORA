import { FC, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "primereact/skeleton";
import classNames from "classnames";

import axiosInstance from "@/api";
import { clientHistoryUrl } from "@/api/client";
import Button from "@/components/Button";
import { HISTORY_ITEMS_PAGE_SIZE } from "@/consts/profile";
import { TOAST_DEFAULT_LIFE, TOAST_SEVERITIES } from "@/consts/toast";
import { ClientProfileModel, INITIAL_CLIENT_HISTORY, ProfileClientHistoryDataModel } from "@/models/profile";
import { commonSetUiToast } from "@/store/common/actions";
import { profileUserDataSelector } from "@/store/profile/selectors";

import BookingHistoryItem from "./BookingHistoryItem";

const BookingHistoryClient: FC = () => {
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [historyData, setHistoryData] = useState<ProfileClientHistoryDataModel>(INITIAL_CLIENT_HISTORY);

    const profileData = useSelector(profileUserDataSelector) as ClientProfileModel;

    const dispatch = useDispatch();

    const shouldShowMoreButton = useMemo<boolean>(
        () => !(page * HISTORY_ITEMS_PAGE_SIZE >= historyData.total),
        [page, historyData.total]
    );

    const fetchHistory = async () => {
        try {
            setLoading(true);

            const { data } = await axiosInstance.post<ProfileClientHistoryDataModel>(
                clientHistoryUrl(profileData.userTypeMapId),
                {
                    pageNumber: page,
                    pageSize: HISTORY_ITEMS_PAGE_SIZE,
                }
            );

            setHistoryData({
                total: data.total,
                data: [...historyData.data, ...data.data],
            });
        } catch {
            const toastToBeShown = {
                severity: TOAST_SEVERITIES.ERROR,
                summary: "Профиль",
                detail: "Ошибка загрузки истории записей.",
                life: TOAST_DEFAULT_LIFE,
            };

            dispatch(commonSetUiToast(toastToBeShown));
        } finally {
            setLoading(false);
        }
    };

    useLayoutEffect(() => {
        fetchHistory();
    }, [page]);

    return loading ? <Skeleton width="100%" height="512px" className="my-4" /> :
        <div>
            <div className={classNames("flex", "flex-column", "gap-2")}>
                {historyData.data.map((record) => <BookingHistoryItem key={record.id} record={record} />)}
            </div>
            {shouldShowMoreButton && (
                <Button
                    loading={loading}
                    onClick={() => setPage(page + 1)}
                    className={classNames("w-full", "mt-4")}
                >
                    Показать ещё
                </Button>
            )}
        </div>
};

export default BookingHistoryClient;
