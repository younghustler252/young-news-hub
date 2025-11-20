// services/notificationService.js
import API from '../api/axios';
import { handleError } from '../utils/handleError';

/*-------------------------------------------------------
🟢 Create a new notification
@route   POST /api/notifications
@access  Private
-------------------------------------------------------*/
export const createNotification = async (payload) => {
  try {
    const response = await API.post('/notifications', payload);
    return response?.data; // { success, data: notification }
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/*-------------------------------------------------------
🟢 Get all notifications (paginated)
@route   GET /api/notifications?page=&limit=
@access  Private
-------------------------------------------------------*/
export const getNotifications = async (page = 1, limit = 20) => {
  try {
    const response = await API.get('/notifications', { params: { page, limit } });
    const { data, pagination } = response?.data || {};
    return { notifications: data, pagination }; // { notifications: [...], pagination: { total, page, pages } }
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/*-------------------------------------------------------
🟢 Mark a single notification as read
@route   PUT /api/notifications/:id/read
@access  Private
-------------------------------------------------------*/
export const markAsRead = async (notificationId) => {
  try {
    const response = await API.put(`/notifications/${notificationId}/read`);
    return response?.data; // { success, message, notification }
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/*-------------------------------------------------------
🟢 Mark all notifications as read
@route   PUT /api/notifications/read-all
@access  Private
-------------------------------------------------------*/
export const markAllAsRead = async () => {
  try {
    const response = await API.put('/notifications/read-all');
    return response?.data; // { success, message, modifiedCount }
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/*-------------------------------------------------------
🟢 Delete a single notification
@route   DELETE /api/notifications/:id
@access  Private
-------------------------------------------------------*/
export const deleteNotification = async (notificationId) => {
  try {
    const response = await API.delete(`/notifications/${notificationId}`);
    return response?.data; // { success, message }
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/*-------------------------------------------------------
🟢 Delete all notifications
@route   DELETE /api/notifications
@access  Private
-------------------------------------------------------*/
export const deleteAllNotifications = async () => {
  try {
    const response = await API.delete('/notifications');
    return response?.data; // { success, message, modifiedCount }
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/*-------------------------------------------------------
🟢 Get unread notification count
@route   GET /api/notifications/unread-count
@access  Private
-------------------------------------------------------*/
export const getUnreadCount = async () => {
  try {
    const response = await API.get('/notifications/unread-count');
    return response?.data; // { success, count }
  } catch (error) {
    throw new Error(handleError(error));
  }
};
