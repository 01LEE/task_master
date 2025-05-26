const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  async initialize() {
    const emailProvider = process.env.EMAIL_PROVIDER;

    switch (emailProvider) {
      case 'nodemailer':
        await this.initializeNodemailer();
        break;
      case 'sendgrid':
        // SendGrid 설정 (추후 확장 가능)
        console.log('SendGrid not implemented yet');
        break;
      default:
        throw new Error(`Unsupported email provider: ${emailProvider}`);
    }
  }

  async initializeNodemailer() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 연결 테스트
    try {
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
    }
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: {
        name: 'DoGether',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'DoGether 이메일 인증',
      html: this.getVerificationEmailTemplate(verificationUrl)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`📮 Gmail 발송 완료! 메시지 ID: ${result.messageId}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  getVerificationEmailTemplate(verificationUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DoGether 이메일 인증</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐕 DoGether</h1>
            <p>반려견과 함께하는 즐거운 여행</p>
          </div>
          <div class="content">
            <h2>안녕하세요!</h2>
            <p>DoGether에 가입해 주셔서 감사합니다.</p>
            <p>아래 버튼을 클릭하여 이메일 인증을 완료해 주세요:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">이메일 인증하기</a>
            </div>
            
            <p>또는 다음 링크를 복사하여 브라우저에 붙여넣으세요:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">
              ${verificationUrl}
            </p>
            
            <p><strong>참고:</strong> 이 링크는 24시간 후에 만료됩니다.</p>
          </div>
          <div class="footer">
            <p>이 이메일을 요청하지 않으셨다면 무시하셔도 됩니다.</p>
            <p>© 2024 DoGether. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService(); 