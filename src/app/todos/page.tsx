import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select();

  return (
    <div className="max-w-xl mx-auto p-8 mt-20 bg-white rounded-2xl shadow-md border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-900">Supabase Todos Test</h1>
        <Link href="/" className="text-xs text-blue-600 hover:underline">
          ← Back to Work Wise
        </Link>
      </div>

      {error ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
          <div className="font-semibold">Supabase Notice:</div>
          <div>{error.message}</div>
          <div className="text-slate-500">
            If table "todos" does not exist yet in project fgcbzsfcfwzxjoitftmd, create it in your Supabase SQL editor to test queries.
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {todos && todos.length > 0 ? (
            todos.map((todo: { id: string | number; name?: string; title?: string }) => (
              <li
                key={todo.id}
                className="p-3 bg-slate-50 rounded-lg text-slate-700 border border-slate-100 flex items-center justify-between text-sm"
              >
                <span>{todo.name || todo.title || JSON.stringify(todo)}</span>
                <span className="text-[10px] font-mono text-slate-400">ID: {todo.id}</span>
              </li>
            ))
          ) : (
            <p className="text-sm text-slate-500 py-4 text-center">
              No todos found. Insert a row into the "todos" table in Supabase to see it here.
            </p>
          )}
        </ul>
      )}
    </div>
  );
}
