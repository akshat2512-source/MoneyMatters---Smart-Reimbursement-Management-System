// Table: approval_rules
// id, company_id FK, step_sequence, approver_id FK, is_manager_approver bool,
// condition_type(percentage|specific|hybrid), condition_value JSONB
//
// Table: approval_requests
// id, expense_id FK, approver_id FK, step, status(pending|approved|rejected), comment, decided_at
