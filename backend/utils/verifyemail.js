const verifyEmailTemplate = (name, url) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f8f8f8; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #333;">Hello ${name},</h2>
      <p style="color: #666;">Please click the link below to verify your email address:</p>
      <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p style="color: #666;">If you did not request this verification, please ignore this email.</p>
`;
};

export default verifyEmailTemplate;
