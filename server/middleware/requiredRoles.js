module.exports = function requireRoles(allowed) {
  return (req, res, next) => {
    try {
      // verifyJWT should already have put decoded token on req.user
      const role = req.role;
      if (role == null) return res.status(401).json({ error: 'Unauthorized' });
      if (!allowed.includes(role)) return res.status(403).json({ error: 'Forbidden' });
      next();
    } catch {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
};
