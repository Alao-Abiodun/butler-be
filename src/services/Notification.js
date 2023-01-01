const { Notification } = require('../models/notification.model')

/**
 * class {
 *   user: id,
 *   text: headline
 *   body: more text
 * }
 * @param {*} data 
 * @returns 
 */
exports.notify = function create(data) {
    return Notification.create(data)
}

exports.markAsRead = function markAsRead(id) {
    return Notification.findByIdAndUpdate(id, { $set: { read: true } })
}

exports.markAllAsRead = function markAsRead(userId) {
    return Notification.updateMany({ user: userId, read: false }, { $set: { read: true } })
}

// Get last seen days by default
exports.get = function getUsersNotifications(userId, dateRange = 7) {
    const date = new Date();
    date.setDate(date.getDate() - dateRange)
    return Notification.find({ user: userId, created: { $gte: date }}).lean()
}