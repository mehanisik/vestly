import { fireEvent, render, screen } from "@testing-library/react";
import { useActionState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SignupPage from "@/app/signup/page";
import { authClient } from "@/lib/auth-client";

const JOIN_VESTLY_REGEX = /Join Vestly/i;
const NAME_REGEX = /Name/i;
const EMAIL_REGEX = /Email/i;
const PASSWORD_REGEX = /Password/i;
const CREATE_ACCOUNT_REGEX = /Create Account/i;
const GITHUB_REGEX = /GitHub/i;
const GOOGLE_REGEX = /Google/i;

vi.mock("react", async () => {
  const actual = (await vi.importActual("react")) as any;
  return {
    ...actual,
    useActionState: vi.fn().mockReturnValue([undefined, vi.fn(), false]),
  };
});

// Mock react-dom's useFormStatus
vi.mock("react-dom", async () => {
  const actual = (await vi.importActual("react-dom")) as any;
  return {
    ...actual,
    useFormStatus: vi.fn().mockReturnValue({ pending: false }),
  };
});

// Mock the action
vi.mock("@/app/actions/auth", () => ({
  signupAction: vi.fn(),
}));

// Mock the auth client
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      social: vi.fn(),
    },
  },
}));

// Mock phosphor icons
vi.mock("@phosphor-icons/react", () => ({
  GithubLogo: () => <div data-testid="github-logo" />,
  GoogleLogo: () => <div data-testid="google-logo" />,
}));

describe("SignupPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders signup form", () => {
    render(<SignupPage />);
    expect(screen.getByText(JOIN_VESTLY_REGEX)).toBeDefined();
    expect(screen.getByLabelText(NAME_REGEX)).toBeDefined();
    expect(screen.getByLabelText(EMAIL_REGEX)).toBeDefined();
    expect(screen.getByLabelText(PASSWORD_REGEX)).toBeDefined();
    expect(
      screen.getByRole("button", { name: CREATE_ACCOUNT_REGEX })
    ).toBeDefined();
  });

  it("handles social login (GitHub)", () => {
    render(<SignupPage />);
    const githubButton = screen.getByRole("button", { name: GITHUB_REGEX });
    fireEvent.click(githubButton);
    expect(authClient.signIn.social).toHaveBeenCalledWith({
      provider: "github",
      callbackURL: "/dashboard",
    });
  });

  it("handles social login (Google)", () => {
    render(<SignupPage />);
    const googleButton = screen.getByRole("button", { name: GOOGLE_REGEX });
    fireEvent.click(googleButton);
    expect(authClient.signIn.social).toHaveBeenCalledWith({
      provider: "google",
      callbackURL: "/dashboard",
    });
  });

  it("displays validation errors from state", () => {
    const mockState = {
      fieldErrors: {
        name: ["Name is required"],
        email: ["Invalid email address"],
        password: ["Password must be at least 8 characters"],
      },
    };

    vi.mocked(useActionState).mockReturnValue([mockState, vi.fn(), false]);

    render(<SignupPage />);

    expect(screen.getByText("Name is required")).toBeDefined();
    expect(screen.getByText("Invalid email address")).toBeDefined();
    expect(
      screen.getByText("Password must be at least 8 characters")
    ).toBeDefined();
  });

  it("displays general error message", () => {
    const mockState = {
      error: "User already exists",
    };

    vi.mocked(useActionState).mockReturnValue([mockState, vi.fn(), false]);

    render(<SignupPage />);

    expect(screen.getByText("User already exists")).toBeDefined();
  });
});
