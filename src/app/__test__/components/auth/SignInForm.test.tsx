import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { act } from "react";
import SignInForm from "@/app/components/auth/SignInForm";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-hook-form", () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit:
      (fn: (data: any) => void) => (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (Object.keys(mockErrors).length === 0) {
          fn(mockFormData);
        }
      },
    formState: {
      errors: mockErrors,
    },
  }),
}));

const mockFormData: {
  email: string;
  password: string;
} = {
  email: "",
  password: "",
};

const mockErrors: Record<string, { message: string }> = {};

jest.mock("@/app/Hooks/useTodo", () => ({
  useTodo: jest.fn(() => ({
    authAction: {
      handleSignIn: jest.fn(async (data) => {
        if (!data.email.includes("@")) {
          return;
        }
        if (!data.password) {
          return;
        }
        if (data.email === "error@example.com") {
          mockEnqueueSnackbar(
            "サインインに失敗しました。もう一度お試しください。",
            { variant: "error" }
          );
          return;
        }
        mockRouter.push("/dashboard");
      }),
      isSubmittingLoading: false,
    },
    authUserState: {
      user: null,
      isAuthLoading: false,
      authError: null,
    },
  })),
}));

const mockEnqueueSnackbar = jest.fn();
jest.mock("notistack", () => ({
  useSnackbar: jest.fn(() => ({
    enqueueSnackbar: mockEnqueueSnackbar,
  })),
}));

const mockRouter = {
  push: jest.fn(),
};

describe("SignInForm コンポーネントのテスト", () => {
  let emailInput: HTMLElement;
  let passwordInput: HTMLElement;
  let form: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockFormData.email = "";
    mockFormData.password = "";
    Object.keys(mockErrors).forEach((key) => delete mockErrors[key]);

    render(<SignInForm />);
    emailInput = screen.getByLabelText(/Email/i);
    passwordInput = screen.getByLabelText(/Password/i);
    form = screen.getByTestId("signin-form");
  });

  describe("UIとフォーム動作のテスト", () => {
    it("無効なメールアドレスでエラーメッセージが表示されること", async () => {
      mockErrors.email = {
        message: "無効なメールアドレス形式です。",
      };

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        mockFormData.email = "invalid-email";
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        mockFormData.password = "password123";
        fireEvent.submit(form);
      });

      const useTodoMock = require("@/app/Hooks/useTodo").useTodo;
      const handleSignInMock = useTodoMock().authAction.handleSignIn;
      expect(handleSignInMock).not.toHaveBeenCalled();
      expect(mockErrors.email).toBeDefined();
      expect(mockErrors.email.message).toBe("無効なメールアドレス形式です。");
    });

    it("パスワードが空の場合にエラーメッセージが表示されること", async () => {
      mockErrors.password = {
        message: "パスワードを入力してください。",
      };

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        mockFormData.email = "test@example.com";
        fireEvent.change(passwordInput, { target: { value: "" } });
        mockFormData.password = "";
        fireEvent.submit(form);
      });

      const useTodoMock = require("@/app/Hooks/useTodo").useTodo;
      const handleSignInMock = useTodoMock().authAction.handleSignIn;
      expect(handleSignInMock).not.toHaveBeenCalled();
      expect(mockErrors.password).toBeDefined();
      expect(mockErrors.password.message).toBe(
        "パスワードを入力してください。"
      );
    });

    it("有効な入力でログイン処理が実行されユーザーがリダイレクトされること", async () => {
      Object.keys(mockErrors).forEach((key) => delete mockErrors[key]);

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        mockFormData.email = "test@example.com";
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        mockFormData.password = "password123";
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("ログインエラー時にエラーメッセージが表示されること", async () => {
      Object.keys(mockErrors).forEach((key) => delete mockErrors[key]);

      await act(async () => {
        fireEvent.change(emailInput, {
          target: { value: "error@example.com" },
        });
        mockFormData.email = "error@example.com";
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        mockFormData.password = "password123";
        fireEvent.submit(form);
      });

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        "サインインに失敗しました。もう一度お試しください。",
        { variant: "error" }
      );
    });
  });

  it("送信中はローディングインジケーターが表示されること", async () => {
    const useTodoMock = require("@/app/Hooks/useTodo").useTodo;
    useTodoMock.mockReturnValue({
      authAction: {
        handleSignIn: jest.fn(),
        isSubmittingLoading: true,
      },
      authUserState: {
        user: null,
        isAuthLoading: false,
        authError: null,
      },
    });

    const { container } = render(<SignInForm />);
    expect(
      container.querySelector(".MuiCircularProgress-root")
    ).toBeInTheDocument();
  });
});
