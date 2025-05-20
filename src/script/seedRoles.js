// seedRoles.js
require('dotenv').config()
const Role = require('../models').role // Adjust path if needed
const logger = require('../utils/logger')

async function initial() {
  try {
    // Create roles
    await Role.bulkCreate(
      [
        { id: 1, name: 'user' },
        { id: 2, name: 'moderator' },
        { id: 3, name: 'admin' }
      ],
      {
        ignoreDuplicates: true // avoids inserting if already present
      }
    )

    logger.info('Roles seeded successfully.')
  } catch (error) {
    logger.error('Error seeding roles:', error)
  } finally {
    logger.info('Database connection closed.')
    process.exit(1)
  }
}

initial()
