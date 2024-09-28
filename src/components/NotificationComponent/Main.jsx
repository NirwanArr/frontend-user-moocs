import { useState, useEffect } from "react";
import { IoNotificationsCircleSharp } from "react-icons/io5";
import { getNotificationsByUserId } from "../../api/fetching";
import { decodeToken } from "../../api/payload";

const Main = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("..."); // Ganti dengan nama kunci yang benar
      if (token) {
        const dataToken = decodeToken(token);
        const userId = dataToken.id;

        if (userId) {
          try {
            const notifData = await getNotificationsByUserId(userId);
            setNotifications(notifData);
          } catch (error) {
            console.error("Failed to fetch notifications:", error);
          } finally {
            setLoading(false);
          }
        }
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full pb-10 overflow-hidden bg-white border rounded-xl border-color-primary">
      <div className="w-full bg-[#0093A3]">
        <h1 className="py-3 font-semibold tracking-wider text-center text-white lg:py-4 lg:text-lg">
          Notifikasi
        </h1>
      </div>
      <div className="w-10/12 mx-auto mt-10 max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif.id} className="flex mb-6">
              <span className="text-color-primary">
                <IoNotificationsCircleSharp className="w-6 h-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
              </span>
              <div className="grid w-full grid-cols-2 gap-3 ml-3">
                <div className="flex flex-col">
                  <h1 className="font-semibold text-color-primary lg:text-lg">
                    {notif.titleNotification}
                  </h1>
                  <h3 className="text-sm font-medium lg:text-base">
                    {notif.description}
                  </h3>
                  <p className="text-xs font-medium opacity-50 lg:text-sm">
                    {/* {notif.typeNotification} */}
                  </p>
                </div>
                <div className="flex items-center justify-end">
                  <p className="text-xs font-medium lg:text-sm text-slate-600">
                    {new Date(notif.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <span
                      className={`w-2 h-2 ml-3 rounded-full lg:h-3 lg:w-3 ${notif.NotificationRead.isRead ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    />
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Tidak ada notifikasi.</p>
        )}
      </div>
    </div>
  );
};

export default Main;
