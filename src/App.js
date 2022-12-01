import { Suspense, useState } from "react";
import { LiveList } from "@liveblocks/client";
import {
  RoomProvider,
  useMutation,
  useOthers,
  useStorage,
  useUpdateMyPresence,
} from "./liveblocks.config";

import { useTheme } from "./hooks/useTheme";
import { Moon, Sun, X } from "react-feather";

function WhoIsHere() {
  const userCount = useOthers((others) => others.length);

  return (
    <div className="text-slate-500 text-right underline">
      There are {userCount} other users online.
    </div>
  );
}

function SomeoneIsTyping() {
  const someoneIsTyping = useOthers((others) =>
    others.some((other) => other.presence.isTyping)
  );

  return (
    <div className="">{someoneIsTyping ? "Someone is typing..." : ""}</div>
  );
}

function Room() {
  const [draft, setDraft] = useState("");
  const updateMyPresence = useUpdateMyPresence();
  const todos = useStorage((root) => root.todos);
  const { theme, setTheme } = useTheme();

  const addTodo = useMutation(({ storage }, text) => {
    storage.get("todos").push({ text });
  }, []);

  const deleteTodo = useMutation(({ storage }, index) => {
    storage.get("todos").delete(index);
  }, []);
  return (
    <div className="container mx-auto px-5">
      <div className="flex justify-end my-3">
        {theme === "dark" ? (
          <button
            className="p-2 bg-slate-800 border border-gray-100 border-b-4 rounded-md"
            onClick={() => setTheme("light")}
          >
            <Sun />
          </button>
        ) : (
          <button
            className="p-2 bg-gray-100 border border-slate-900 border-b-4 rounded-md"
            onClick={() => setTheme("dark")}
          >
            <Moon />
          </button>
        )}
      </div>
      <h2 className="text-5xl font-bold my-2">Collaborative To Do List</h2>

      <div className="flex items-center justify-between mb-1">
        <SomeoneIsTyping />
        <WhoIsHere />
      </div>
      <input
        type="text"
        placeholder="What needs to be done?"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          updateMyPresence({ isTyping: true });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateMyPresence({ isTyping: false });
            addTodo(draft);
            setDraft("");
          }
        }}
        onBlur={() => updateMyPresence({ isTyping: false })}
        className="dark:bg-slate-800 py-3 px-3 mb-5 block w-full border border-b-4 border-slate-900 dark:border-gray-100 rounded-md shadow-md focus:shadow-lg focus-visible:outline-0"
      />

      <h3 className="font-bold text-2xl">To do</h3>
      <div className="block border-b border-slate-900 dark:border-gray-100"></div>
      {todos.map((todo, index) => {
        return (
          <div
            key={index}
            className="flex items-center justify-between shadow-sm px-3 py-2 my-3 dark:bg-slate-800 bg-white border-slate-900 dark:border-gray-100 border-b-4 rounded-md"
          >
            <div className="">{todo.text}</div>
            <button className="p-0 m-0" onClick={() => deleteTodo(index)}>
              <X />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function App({ roomId }) {
  return (
    <RoomProvider
      id="react-todo-app"
      initialPresence={{ isTyping: false }}
      initialStorage={{ todos: new LiveList() }}
    >
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <h1 className="text-7xl text-center"> Loading...</h1>
          </div>
        }
      >
        <Room />
      </Suspense>
    </RoomProvider>
  );
}
