const db = require('../models/index')
const logger = require('../utils/logger')
const User = db.user
class AccessController {
  async getUserById(userId) {
    try {
      const user = await User.findByPk(userId)
      return user
    } catch (err) {
      logger.error(`DB error fetching userId=${userId}: ${err.message}`)
      return null
    }
  }

  async validateRole(req, res, expectedRole) {
    const userId = req.headers['x-user-id']
    if (!userId) {
      logger.warn(`Access denied: No user ID, IP: ${req.ip}`)
      res.status(401).send('Unauthorized: User ID missing')
      return null
    }

    const user = await this.getUserById(userId)
    if (!user) {
      logger.warn(`Access denied: User not found, userId=${userId}, IP: ${req.ip}`)
      res.status(401).send('Unauthorized: User not found')
      return null
    }

    if (user.role !== expectedRole) {
      logger.warn(
        `Access denied: Role mismatch, userId=${userId}, role=${user.role}, expected=${expectedRole}, IP: ${req.ip}`
      )
      res.status(403).send('Forbidden: Insufficient role')
      return null
    }

    logger.info(`Access granted for userId=${userId}, role=${user.role}, IP: ${req.ip}`)
    return user
  }

  // Public access - returns some public announcements
  async allAccess(req, res) {
    logger.info(`Public content accessed from IP ${req.ip}`)

    // Example: fetch some public announcements from DB
    try {
      const announcements = await db.Announcement.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']]
      })
      res.status(200).json({
        message: 'Public Content.',
        announcements
      })
    } catch (err) {
      logger.error(`Failed fetching announcements: ${err.message}`)
      res.status(500).send('Error fetching public content')
    }
  }

  // User role access - returns user profile + user-specific data
  async userBoard(req, res) {
    const user = await this.validateRole(req, res, 'user')
    if (!user) return

    try {
      // Fetch user profile details or user-related data
      const profile = {
        id: user.id,
        name: user.name,
        email: user.email,
        memberSince: user.createdAt
      }

      // Example: Fetch user's recent activity (dummy data or real from DB)
      const recentActivity = await db.Activity.findAll({
        where: { userId: user.id },
        limit: 5,
        order: [['createdAt', 'DESC']]
      })

      res.status(200).json({
        message: 'User Content.',
        profile,
        recentActivity
      })
    } catch (err) {
      logger.error(`Error fetching user data for userId=${user.id}: ${err.message}`)
      res.status(500).send('Error fetching user content')
    }
  }

  // Admin role access - returns admin dashboard stats
  async adminBoard(req, res) {
    const user = await this.validateRole(req, res, 'admin')
    if (!user) return

    try {
      // Example: fetch some admin stats from DB
      const totalUsers = await User.count()
      const totalPosts = await db.Post.count()
      const systemStatus = { uptime: process.uptime(), timestamp: Date.now() }

      res.status(200).json({
        message: 'Admin Content.',
        adminName: user.name,
        stats: {
          totalUsers,
          totalPosts,
          systemStatus
        }
      })
    } catch (err) {
      logger.error(`Error fetching admin stats for userId=${user.id}: ${err.message}`)
      res.status(500).send('Error fetching admin content')
    }
  }

  // Moderator role access - returns moderation queue and moderator info
  async moderatorBoard(req, res) {
    const user = await this.validateRole(req, res, 'moderator')
    if (!user) return

    try {
      // Example: fetch moderation queue items (pending posts/reports)
      const pendingReports = await User.findAll({
        where: { status: 'pending' },
        limit: 10,
        order: [['createdAt', 'ASC']]
      })

      res.status(200).json({
        message: 'Moderator Content.',
        moderator: {
          id: user.id,
          name: user.name,
          assignedSections: user.assignedSections || []
        },
        pendingReports
      })
    } catch (err) {
      logger.error(`Error fetching moderator data for userId=${user.id}: ${err.message}`)
      res.status(500).send('Error fetching moderator content')
    }
  }
}

module.exports.accessController = new AccessController()
