import API from "./api";

export interface SendOTPRequest {
  email: string;
  phone?: string;
  useEmail?: boolean;
}

export interface VerifyOTPRequest {
  email?: string;
  phone?: string;
  otp: string;
}

export interface OTPResponse {
  message: string;
  success: boolean;
  error?: string;
}

export const otpApi = {
  sendOTP: async (data: SendOTPRequest): Promise<OTPResponse> => {
    const response = await API.post<OTPResponse>("/auth/send-otp", {
      email: data.email,
      phone: data.phone || "",
      useEmail: data.useEmail !== undefined ? data.useEmail : true,
    });
    return response.data;
  },

  verifyOTP: async (data: VerifyOTPRequest): Promise<OTPResponse> => {
    const response = await API.post<OTPResponse>("/auth/verify-otp", {
      email: data.email || "",
      phone: data.phone || "",
      otp: data.otp,
    });
    return response.data;
  },
};

