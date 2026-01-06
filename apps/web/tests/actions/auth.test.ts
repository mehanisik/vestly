import { auth } from "@vestly/auth";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loginAction, logoutAction, signupAction } from "@/app/actions/auth";

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Mock @vestly/auth
vi.mock("@vestly/auth", () => ({
  auth: {
    api: {
      signUpEmail: vi.fn(),
      signInEmail: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

const REQUIRED_REGEX = /required/i;

describe("Auth Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signupAction", () => {
    it("should return field errors for invalid input", async () => {
      const formData = new FormData();
      formData.append("name", "A"); // too short
      formData.append("email", "invalid");
      formData.append("password", "short");

      const result = await signupAction(undefined, formData);

      expect(result.fieldErrors).toBeDefined();
      expect(result.fieldErrors?.name).toContain(
        "Name must be at least 2 characters"
      );
      expect(result.fieldErrors?.email).toContain("Invalid email address");
      expect(result.fieldErrors?.password).toContain(
        "Password must be at least 8 characters"
      );
    });

    it("should redirect to dashboard on successful signup", async () => {
      const formData = new FormData();
      formData.append("name", "John Doe");
      formData.append("email", "john@example.com");
      formData.append("password", "password123");

      (auth.api.signUpEmail as any).mockResolvedValue({ id: "user_123" });

      await signupAction(undefined, formData);

      expect(auth.api.signUpEmail).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith("/dashboard");
    });

    it("should return error message on signup failure", async () => {
      const formData = new FormData();
      formData.append("name", "John Doe");
      formData.append("email", "john@example.com");
      formData.append("password", "password123");

      (auth.api.signUpEmail as any).mockRejectedValue(
        new Error("Email already exists")
      );

      const result = await signupAction(undefined, formData);

      expect(result.error).toBe("Email already exists");
    });
  });

  describe("loginAction", () => {
    it("should return field errors for invalid input", async () => {
      const formData = new FormData();
      formData.append("email", "invalid");
      formData.append("password", "");

      const result = await loginAction(undefined, formData);

      expect(result.fieldErrors).toBeDefined();
      expect(result.fieldErrors?.email).toContain("Invalid email address");
      expect(result.fieldErrors?.password[0]).toMatch(REQUIRED_REGEX);
    });

    it("should redirect to dashboard on successful login", async () => {
      const formData = new FormData();
      formData.append("email", "john@example.com");
      formData.append("password", "password123");

      (auth.api.signInEmail as any).mockResolvedValue({});

      await loginAction(undefined, formData);

      expect(auth.api.signInEmail).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith("/dashboard");
    });

    it("should return error message on login failure", async () => {
      const formData = new FormData();
      formData.append("email", "john@example.com");
      formData.append("password", "wrongpassword");

      (auth.api.signInEmail as any).mockRejectedValue(
        new Error("Invalid credentials")
      );

      const result = await loginAction(undefined, formData);

      expect(result.error).toBe("Invalid credentials");
    });
  });

  describe("logoutAction", () => {
    it("should properly sign out and redirect to login", async () => {
      await logoutAction();

      expect(auth.api.signOut).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });
});
