const crypto = require('crypto');
const pool = require('../config/db');
const fs = require('fs');

class FraudService {
  /**
   * Generates a SHA256 hash of a file's content
   * @param {string} filePath 
   * @returns {Promise<string>}
   */
  static async calculateHash(filePath) {
    if (!filePath) return null;
    try {
      const fileBuffer = fs.readFileSync(filePath);
      return crypto.createHash('sha256').update(fileBuffer).digest('hex');
    } catch (err) {
      console.error('Hash calculation failed:', err.message);
      return null;
    }
  }

  /**
   * Analyzes an expense for fraud/suspicious patterns
   * @param {Object} billDetails 
   * @param {Object} user 
   * @returns {Promise<{is_suspicious: boolean, fraud_reason: string, receipt_hash: string}>}
   */
  static async analyzeBill(billDetails, user) {
    const { amount, receipt_url, title } = billDetails;
    const userId = user.id;
    const companyId = user.company_id;
    
    let isSuspicious = false;
    let reasons = [];
    let receiptHash = null;

    // 1. Duplicate Receipt Detection (Hash collision)
    if (receipt_url) {
      receiptHash = await this.calculateHash(receipt_url);
      if (receiptHash) {
        const duplicateCheck = await pool.query(
          'SELECT id FROM bills WHERE receipt_hash = $1 AND id != $2 LIMIT 1',
          [receiptHash, billDetails.id || '00000000-0000-0000-0000-000000000000']
        );
        if (duplicateCheck.rows.length > 0) {
          isSuspicious = true;
          reasons.push("Duplicate receipt detected (image match)");
        }
      }
    }

    // 2. Same Amount + Same Date Detection
    // Note: We check if the same user submitted the same amount on the same calendar day
    const collisionCheck = await pool.query(
      `SELECT id FROM bills 
       WHERE user_id = $1 
       AND amount = $2 
       AND created_at::date = CURRENT_DATE 
       AND id != $3
       LIMIT 1`,
      [userId, amount, billDetails.id || '00000000-0000-0000-0000-000000000000']
    );
    if (collisionCheck.rows.length > 0) {
      isSuspicious = true;
      reasons.push("Multiple submissions with identical amount on the same day");
    }

    // 3. Rapid Submission Detection (Velocity Check)
    // More than 5 expenses in 10 minutes
    const velocityCheck = await pool.query(
      `SELECT COUNT(*) FROM bills 
       WHERE user_id = $1 
       AND created_at > NOW() - interval '10 minutes'`,
      [userId]
    );
    if (parseInt(velocityCheck.rows[0].count) >= 5) {
      isSuspicious = true;
      reasons.push("High-frequency submission (potential bot behavior)");
    }

    // 4. Unusual Amount Detection (Anomaly Detection)
    // If current expense > 3x the user's historical average
    const avgCheck = await pool.query(
      `SELECT AVG(amount) as avg_amount FROM bills WHERE user_id = $1`,
      [userId]
    );
    const avgAmount = parseFloat(avgCheck.rows[0].avg_amount);
    if (avgAmount && amount > avgAmount * 3) {
      isSuspicious = true;
      reasons.push(`Unusual amount detected ($${amount} is > 3x your average of $${avgAmount.toFixed(2)})`);
    }

    return {
      is_suspicious: isSuspicious,
      fraud_reason: reasons.join(" | "),
      receipt_hash: receiptHash
    };
  }
}

module.exports = FraudService;
