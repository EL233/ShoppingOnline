const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 如果是测试环境且没有设置邮箱配置，直接返回成功
  if (process.env.NODE_ENV === 'test' || (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)) {
    console.log('测试模式: 邮件发送被跳过');
    console.log('邮件内容:', {
      to: options.email,
      subject: options.subject,
      html: options.html
    });
    return;
  }

  try {
    // 创建发送邮件的transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.qq.com', // 以QQ邮箱为例，可根据实际情况修改
      port: process.env.EMAIL_PORT || 465,
      secure: process.env.EMAIL_SECURE !== 'false', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // 邮箱授权码
      }
    });

    // 邮件选项
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'EL杂货铺'}" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    // 发送邮件
    const info = await transporter.sendMail(mailOptions);
    console.log('邮件发送成功:', info.messageId);
    return info;
  } catch (error) {
    console.error('邮件发送失败:', error);
    throw error;
  }
};

module.exports = sendEmail;