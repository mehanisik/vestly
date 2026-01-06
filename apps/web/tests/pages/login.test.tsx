import { fireEvent, render, screen } from "@testing-library/react";
import { useActionState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "@/app/login/page";
import { authClient } from "@/lib/auth-client";

const WELCOME_BACK_REGEX = /Welcome Back/i;
const EMAIL_REGEX = /Email/i;
const PASSWORD_REGEX = /Password/i;
const LOG_IN_REGEX = /Log In/i;
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
  loginAction: vi.fn(),
}));

// Mock the auth client
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      social: vi.fn(),
    },
  },
}));

// Mock phosphor icons (optional, but good for speed and avoiding SVG issues)
vi.mock("@phosphor-icons/react", () => ({
  GithubLogo: () => <div data-testid="github-logo" />,
  GoogleLogo: () => <div data-testid="google-logo" />,
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByText(WELCOME_BACK_REGEX)).toBeDefined();
    expect(screen.getByLabelText(EMAIL_REGEX)).toBeDefined();
    expect(screen.getByLabelText(PASSWORD_REGEX)).toBeDefined();
    expect(screen.getByRole("button", { name: LOG_IN_REGEX })).toBeDefined();
  });

  it("handles social login (GitHub)", () => {
    render(<LoginPage />);
    const githubButton = screen.getByRole("button", { name: GITHUB_REGEX });
    fireEvent.click(githubButton);
    expect(authClient.signIn.social).toHaveBeenCalledWith({
      provider: "github",
      callbackURL: "/dashboard",
    });
  });

  it("handles social login (Google)", () => {
    render(<LoginPage />);
    const googleButton = screen.getByRole("button", { name: GOOGLE_REGEX });
    fireEvent.click(googleButton);
    expect(authClient.signIn.social).toHaveBeenCalledWith({
      provider: "google",
      callbackURL: "/dashboard",
    });
  });

  it("displays validation errors when state is provided", () => {
    // Mock useActionState to return an error state
    const mockState = {
      fieldErrors: {
        email: ["Invalid email address"],
        password: ["Password is required"],
      },
    };

    vi.mocked(useActionState).mockReturnValue([mockState, vi.fn(), false]);

    render(<LoginPage />);

    expect(screen.getByText("Invalid email address")).toBeDefined();
    expect(screen.getByText("Password is required")).toBeDefined();
  });

  it("displays general error message when state.error is provided", () => {
    const mockState = {
      error: "Invalid credentials",
    };

    vi.mocked(useActionState).mockReturnValue([mockState, vi.fn(), false]);

    render(<LoginPage />);

    expect(screen.getByText("Invalid credentials")).toBeDefined();
  });
});
