export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    accountVerified: user.accountVerified,
    avatar: user.avatar,
  };

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Use None for cross-origin, Lax for local
    })
    .json({
      success: true,
      message,
      user: sanitizedUser,
      // token: token, // Optional — not needed if cookie is used
    });
};
