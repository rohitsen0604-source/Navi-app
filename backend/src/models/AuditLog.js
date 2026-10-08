const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  actorRole: String,
  action: {
    type: String,
    required: true // e.g. "REASSIGN_DRIVER", "MANUAL_CANCEL", "APPROVE_DRIVER"
  },
  entityType: String,
  entityId: String,
  previousState: mongoose.Schema.Types.Mixed,
  newState: mongoose.Schema.Types.Mixed,
  notes: String,
  ipAddress: String
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
