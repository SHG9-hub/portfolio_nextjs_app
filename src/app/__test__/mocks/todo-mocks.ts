import { Todo } from "@/app/lib/firebase/firebaseservice";

export const mockTodoList: Todo[] = [
    {
        id: "1",
        title: "テスト用Todo 1",
        completed: false,
        userId: "test-user-id"
    },
    {
        id: "2",
        title: "テスト用Todo 2",
        completed: true,
        userId: "test-user-id"
    },
    {
        id: "3",
        title: "テスト用Todo 3",
        completed: false,
        userId: "test-user-id"
    }
]; 