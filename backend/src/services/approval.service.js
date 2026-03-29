const prisma = require('../config/db');

/**
 * Initialize approval steps when an expense is submitted.
 * Respects isManagerApprover flag and rule type.
 */
const initializeApprovalFlow = async (expense, rule, employee) => {
  const steps = [];
  let seq = 1;

  // Manager-first if flag is set
  if (employee.isManagerApprover && employee.managerId) {
    steps.push({ expenseId: expense.id, approverId: employee.managerId, sequence: seq++ });
  }

  // Add rule-defined approvers
  if (rule?.steps?.length) {
    for (const s of rule.steps.sort((a, b) => a.sequence - b.sequence)) {
      steps.push({ expenseId: expense.id, approverId: s.approverId, sequence: seq++ });
    }
  }

  await prisma.approvalStep.createMany({ data: steps });
};

/**
 * Process an approve/reject decision.
 * Returns updated expense status.
 */
const processApproval = async (expenseId, approverId, decision, comment) => {
  const step = await prisma.approvalStep.findFirst({
    where: { expenseId, approverId, status: 'PENDING' },
    include: { expense: { include: { approvalSteps: true } } },
  });

  if (!step) throw new Error('No pending step found');

  await prisma.approvalStep.update({
    where: { id: step.id },
    data: { status: decision, comment, decidedAt: new Date() },
  });

  if (decision === 'REJECTED') {
    await prisma.expense.update({ where: { id: expenseId }, data: { status: 'REJECTED' } });
    return 'REJECTED';
  }

  // Check next step or completion
  const allSteps = step.expense.approvalSteps;
  const nextStep = allSteps.find(s => s.sequence === step.sequence + 1 && s.status === 'PENDING');

  if (!nextStep) {
    await prisma.expense.update({ where: { id: expenseId }, data: { status: 'APPROVED' } });
    return 'APPROVED';
  }

  return 'IN_REVIEW';
};

module.exports = { initializeApprovalFlow, processApproval };
