# Approval Engine Logic

## On expense submission
1. Check employee.isManagerApprover → prepend manager as step 1
2. Load company ApprovalRule
3. Create ApprovalStep rows in sequence
4. Notify first approver

## Rule Types
- SEQUENTIAL     : steps run in order, each must decide before next is activated
- PERCENTAGE     : N% of all approvers must approve (any order)
- SPECIFIC       : auto-approve if a designated approver approves
- HYBRID         : PERCENTAGE OR SPECIFIC — whichever fires first

## processApproval flow
1. Mark step APPROVED / REJECTED + timestamp
2. If REJECTED → expense = REJECTED, stop
3. If SEQUENTIAL → find next step, activate it
4. Check rule conditions (percentage or specific)
5. If condition met → expense = APPROVED
