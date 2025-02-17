import * as OTPAuth from "otpauth";


class OtpUtil {
  public generateOtp(key?: string): string {
    const secret = key ? OTPAuth.Secret.fromBase32(key) : new OTPAuth.Secret({ size: 20 });

    const totp = new OTPAuth.TOTP({
      issuer: "WebBuddy",
      label: "WebBuddy",
      algorithm: "SHA1",
      digits: 4,
      period: 30,
      secret,
    });

    return totp.generate();
  }
}

export default new OtpUtil();
