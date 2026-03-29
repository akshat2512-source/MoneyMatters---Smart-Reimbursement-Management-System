export const paginate = (page = 1, limit = 20) => ({
  limit,
  offset: (page - 1) * limit,
})

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
