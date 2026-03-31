import { Model, Types } from "mongoose";
import { NotificationDocument } from "src/notifications/schema/notification.schema";

interface NotificationParams {
    user: Types.ObjectId | string;
    title: string;
    message: string;
    type?: string;
    refId?: Types.ObjectId | string;
    refModel?: string;
    isRead?: boolean;
}

export async function CreateNotification(
    notificationModel: Model<NotificationDocument>,
    params: NotificationParams
): Promise<void> {
    try {
        await notificationModel.create({
            user: params.user,
            title: params.title,
            message: params.message,
            type: params.type || "general",
            refId: params.refId,
            refModel: params.refModel,
            isRead: params.isRead ?? false,
        });
    } catch (error) {
        console.error("Notification error:", error);
    }
}