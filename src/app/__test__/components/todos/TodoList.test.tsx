import { render, screen } from "@testing-library/react";
import { TodoList } from "@/app/components/todos/TodoList";
import { mockTodoList } from "@/app/__test__/mocks/todo-mocks";

jest.mock("@/app/lib/firebase/firebaseservice", () => ({
  updateTodo: jest.fn(),
}));

describe("TodoListコンポーネントのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("TodoListが正しくレンダリングされること", () => {
    render(<TodoList todoList={mockTodoList} />);

    mockTodoList.forEach((todo) => {
      const todoElement = screen.getByText(todo.title);
      expect(todoElement).toBeInTheDocument();
    });
  });

  it("空のTodoリストが正しく処理されること", () => {
    render(<TodoList todoList={[]} />);
    expect(screen.queryByRole("listitem")).toBeNull();
  });
});
