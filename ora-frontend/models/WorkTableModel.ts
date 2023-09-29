export interface WorkDayModel {
    isWorking: boolean;
    startHour: number | null;
    startMinute: number | null;
    finishHour: number | null;
    finishMinute: number | null;
};

interface WorkTableModel {
    monday: WorkDayModel;
    tuesday: WorkDayModel;
    wednesday: WorkDayModel;
    thursday: WorkDayModel;
    friday: WorkDayModel;
    saturday: WorkDayModel;
    sunday: WorkDayModel;
};

export type WorkTableDays = keyof WorkTableModel;

export default WorkTableModel;
